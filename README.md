# Founders Meet Registration System

A production-ready startup event registration and QR-based entry management platform built with React.js and Google Apps Script.

## Features
- **Premium UI**: Glassmorphism design, responsive, smooth animations via Framer Motion.
- **Registration Flow**: Robust validation using Zod and React Hook Form.
- **Dynamic Ticket Generation**: Creates a beautiful digital ticket with a scannable QR code.
- **QR Code Scanning**: Built-in camera scanner for organizers to verify entry.
- **Admin Dashboard**: View all attendees, track check-ins, and export data to CSV.
- **Serverless Backend**: Entirely powered by Google Apps Script and Google Sheets, including automated confirmation emails via GmailApp.

## Technologies Used
- React.js (Vite)
- Tailwind CSS v4
- react-router-dom, react-hook-form, zod
- html5-qrcode, qrcode.react, html2canvas, react-hot-toast, framer-motion

## Setup Instructions

### 1. Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory (copy `.env.example`):
   ```bash
   VITE_GOOGLE_SCRIPT_URL=your_google_script_web_app_url_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

### 2. Backend Setup (Google Apps Script)

1. Go to [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet.
2. Go to **Extensions > Apps Script**.
3. Clear the default code and copy-paste the contents of `Code.gs` from this repository.
4. Click the **Run** button at the top to execute the `setup()` function (this creates the correct sheet columns and authorizes the script).
5. Deploy the script:
   - Click **Deploy > New deployment**.
   - Select type: **Web App**.
   - Execute as: **Me**.
   - Who has access: **Anyone**.
   - Click **Deploy** and copy the resulting "Web app URL".
6. Paste this URL into your `.env` file as `VITE_GOOGLE_SCRIPT_URL`.

## Deployment

The resulting build is completely static. You can easily deploy the `dist` folder to:
- GitHub Pages
- Vercel
- Netlify

For GitHub Pages deployment, run:
```bash
npm run build
```
Then commit the `dist` folder to your `gh-pages` branch.
