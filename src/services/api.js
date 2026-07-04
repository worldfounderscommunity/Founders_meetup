const GAS_URL = "https://script.google.com/macros/s/AKfycbxSDsB5h2fp-7xtP3SjQKlfJCcs-KCZuJlMSXNJSigMGFObju5OdjOiBThJn600_MKf/exec";

// Function to handle API requests to Google Apps Script
export const submitRegistration = async (data) => {
  if (!GAS_URL) {
    console.warn("GAS_URL not found, using mock successful response for development.");
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, registrationId: data.registrationId });
      }, 1500);
    });
  }

  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'register', ...data }),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // GAS often requires text/plain for CORS
      }
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error('Failed to connect to the server');
  }
};

export const verifyAttendee = async (registrationId) => {
  if (!GAS_URL) {
    return new Promise((resolve) => setTimeout(() => resolve({
      success: true,
      data: {
        registrationId,
        fullName: "Mock User",
        phone: "+919876543210",
        email: "mock@example.com",
        organization: "Mock Startup",
        role: "Founder",
        attendanceStatus: "Pending"
      }
    }), 1000));
  }

  try {
    const response = await fetch(`${GAS_URL}?action=verify&id=${registrationId}`);
    return await response.json();
  } catch (error) {
    throw new Error('Failed to verify attendee');
  }
};

export const markAttendance = async (registrationId) => {
  if (!GAS_URL) return { success: true };
  
  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'markAttendance', registrationId }),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    });
    return await response.json();
  } catch (error) {
    throw new Error('Failed to mark attendance');
  }
};

export const getAllRegistrations = async () => {
  if (!GAS_URL) return { success: true, data: [] };
  
  try {
    const response = await fetch(`${GAS_URL}?action=getAll`);
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch registrations');
  }
};
