const SHEET_NAME = "Registrations";
const SCRIPT_URL = ScriptApp.getService().getUrl();

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "Registration ID", 
      "Full Name", 
      "Phone", 
      "Email", 
      "Organization", 
      "Role", 
      "Purpose",
      "Registration Date", 
      "Attendance Status", 
      "Check-in Time"
    ]);
    sheet.getRange("A1:J1").setFontWeight("bold").setBackground("#d9ead3");
    sheet.setFrozenRows(1);
  }
}

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;

    if (action === "register") {
      return handleRegistration(postData);
    } else if (action === "markAttendance") {
      return handleMarkAttendance(postData);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Invalid action" })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (action === "verify") {
      return handleVerify(e.parameter.id);
    } else if (action === "getAll") {
      return handleGetAll();
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Invalid action" })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleRegistration(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();

  // Check for duplicates
  for (let i = 1; i < values.length; i++) {
    if (values[i][3] === data.email || values[i][2] === data.phone) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Email or Phone already registered." })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  const timestamp = new Date();
  
  sheet.appendRow([
    data.registrationId,
    data.fullName,
    data.phone,
    data.email,
    data.organization,
    data.role,
    data.purpose || "",
    timestamp,
    "Pending", // Attendance Status
    "" // Check-in Time
  ]);

  // Send Email (We do it asynchronously by triggering it or just blocking if fast enough, GAS limits apply for large base64 attachments)
  sendConfirmationEmail(data);

  return ContentService.createTextOutput(JSON.stringify({ success: true, registrationId: data.registrationId })).setMimeType(ContentService.MimeType.JSON);
}

function handleVerify(id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === id) {
      const attendeeData = {
        registrationId: values[i][0],
        fullName: values[i][1],
        phone: values[i][2],
        email: values[i][3],
        organization: values[i][4],
        role: values[i][5],
        attendanceStatus: values[i][7]
      };
      return ContentService.createTextOutput(JSON.stringify({ success: true, data: attendeeData })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Registration ID not found." })).setMimeType(ContentService.MimeType.JSON);
}

function handleMarkAttendance(data) {
  const id = data.registrationId;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === id) {
      sheet.getRange(i + 1, 8).setValue("Present");
      sheet.getRange(i + 1, 9).setValue(new Date());
      return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Registration ID not found." })).setMimeType(ContentService.MimeType.JSON);
}

function handleGetAll() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const values = sheet.getDataRange().getValues();
  
  const registrations = [];
  for (let i = 1; i < values.length; i++) {
    registrations.push({
      registrationId: values[i][0],
      fullName: values[i][1],
      phone: values[i][2],
      email: values[i][3],
      organization: values[i][4],
      role: values[i][5],
      registrationDate: values[i][6],
      attendanceStatus: values[i][7]
    });
  }

  return ContentService.createTextOutput(JSON.stringify({ success: true, data: registrations })).setMimeType(ContentService.MimeType.JSON);
}

function sendConfirmationEmail(data) {
  const subject = "Founders Meet Registration Confirmation";
  
  let paymentDetails = "";
  let needsPayment = false;
  if (data.purpose === "Networking") {
    paymentDetails = "₹299";
    needsPayment = true;
  } else if (data.purpose === "Pitching") {
    paymentDetails = "₹1499";
    needsPayment = true;
  } else {
    paymentDetails = "Free";
  }

  let paymentHtml = "";
  if (needsPayment) {
    paymentHtml = `
      <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #fde68a;">
        <h3 style="color: #d97706; margin-top: 0;">Payment Required: ${paymentDetails}</h3>
        <p style="margin-bottom: 15px;">Please scan the QR code below to complete your payment of ${paymentDetails} for ${data.purpose}.<br/>Mention your Registration ID (<strong>${data.registrationId}</strong>) in the payment notes.</p>
        <div style="text-align: center;">
          <img src="https://techmiyaedtech2003.github.io/Founders_meet/Images/payment_QR.jpeg" alt="Scan to Pay" style="max-width: 250px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
        </div>
      </div>
    `;
  } else {
    paymentHtml = `
      <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #bbf7d0;">
        <h3 style="color: #166534; margin-top: 0; margin-bottom: 0;">Payment: ${paymentDetails}</h3>
      </div>
    `;
  }

  const htmlBody = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #4f46e5;">Registration Confirmed</h2>
      <p>Hello ${data.fullName},</p>
      <p>Your registration for the Founders Meet 2026 is confirmed.</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Registration ID:</strong> ${data.registrationId}</p>
        <p style="margin: 5px 0;"><strong>Organization:</strong> ${data.organization}</p>
        <p style="margin: 5px 0;"><strong>Role:</strong> ${data.role}</p>
        <p style="margin: 5px 0;"><strong>Purpose:</strong> ${data.purpose || "N/A"}</p>
      </div>

      ${paymentHtml}
      
      <p>Please save this email. The QR code required for entry is displayed on your ticket (which is attached).</p>
      <p>Looking forward to seeing you there!</p>
      <br/>
      <p>Best regards,</p>
      <p>The Founders Meet Team</p>
    </div>
  `;

  let attachments = [];
  
  // Attach Ticket
  if (data.ticketImage) {
    try {
      const base64Data = data.ticketImage.split(',')[1];
      const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), 'image/jpeg', `Ticket-${data.registrationId}.jpg`);
      attachments.push(blob);
    } catch(e) {
      console.error("Failed to parse image for email attachment", e);
    }
  }

  // Attach Payment QR Code if payment is required
  if (needsPayment) {
    try {
      // Assuming you host the repo on gh-pages, this URL will fetch the QR code directly
      const qrUrl = "https://techmiyaedtech2003.github.io/Founders_meet/Images/payment_QR.jpeg";
      const qrResponse = UrlFetchApp.fetch(qrUrl);
      const qrBlob = qrResponse.getBlob().setName("payment_QR.jpeg");
      attachments.push(qrBlob);
    } catch(e) {
      console.error("Failed to fetch payment QR code", e);
    }
  }

  GmailApp.sendEmail(data.email, subject, "", {
    htmlBody: htmlBody,
    attachments: attachments
  });
}

// Function to handle CORS preflight
function doOptions(e) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
  return ContentService.createTextOutput("").setHeaders(headers);
}
