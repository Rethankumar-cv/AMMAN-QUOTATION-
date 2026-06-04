# Amman Earth Movers - Quotation System

An offline-first, mobile-responsive Progressive Web Application (PWA) built to generate professional, print-ready PDF quotations for the heavy earthmoving and vehicle solutions industry.

## 🚀 Core Features

- **100% Offline Capable**: Built with a local-first architecture (IndexedDB and LocalStorage), allowing field managers to generate quotes securely without an internet connection.
- **PWA Ready**: Installable directly to the home screen on iOS, Android, and Desktop devices.
- **Pixel-Perfect PDF Generation**: Uses `html2canvas` and `jsPDF` to translate the dynamic React DOM into high-resolution, A4-formatted PDF documents.
- **Custom Branding Engine**: Dynamically upload company logos, authorized signatures, and rubber stamps (converted to Base64 and saved locally).
- **Automated Calculations**: Calculates equipment hire, fuel, driver charges, transportation, and GST percentages dynamically.
- **Smart Draft Management**: Debounced autosaving prevents data loss during browser crashes.
- **Local Backup & Restore**: Export all quotations and settings as a portable JSON file, protected by strict sequence-rollback guardrails upon import.
- **Native Mobile Sharing**: Integrates with the native Web Share API for instantly sending PDFs via WhatsApp, Email, or Slack on mobile devices.

## 🛠️ Technology Stack

- **Core**: React.js (Vite)
- **Routing**: React Router v6
- **Styling**: Vanilla CSS (CSS Variables for theming)
- **Icons**: Lucide React
- **Local Database**: LocalForage (IndexedDB Wrapper)
- **PDF Engine**: html2canvas + jsPDF
- **PWA**: vite-plugin-pwa

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rethankumar-cv/AMMAN-QUOTATION-.git
   cd AMMAN-QUOTATION-
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🌐 Deployment (Vercel)

This project includes a `vercel.json` file ensuring React Router paths (e.g., `/history`, `/preview`) work seamlessly on static hosting without throwing 404 errors.

1. Push the repository to GitHub.
2. Import the project in your Vercel Dashboard.
3. Vercel will automatically detect the Vite build settings.
4. Click **Deploy**.

## 🛡️ Data Integrity & Architecture

- **No Cloud Required**: Designed specifically for data privacy; no Firebase, AWS, or backend servers are used.
- **Duplicate Protection**: Alerts the user if a quotation is generated for the exact same client and parameters on the same day.
- **Sequence Protection**: The quotation numbering (e.g., `AEM/26/0001`) dynamically tracks the calendar year and prevents rollback collisions during backup restorations.

## 📄 Licensing
Proprietary software built for Amman Earth Movers. All rights reserved.
