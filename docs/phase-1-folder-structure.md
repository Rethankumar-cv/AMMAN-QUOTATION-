# Planned Folder Structure (Phase 1)

This represents the architectural blueprint for the React application once development begins.

```text
amman-quotation-app/
├── public/
│   ├── index.html                 # Main HTML template
│   └── assets/
│       └── amman-logo.png         # Brand logo reference
├── src/
│   ├── assets/                    # Images, global icons, fonts
│   ├── components/                # Reusable UI components
│   │   ├── common/                # Buttons, Inputs, Typography, Cards
│   │   ├── layout/                # Header, Footer, Sidebar/Navigation
│   │   └── quotation/             # Quotation specific (Form Sections, Preview Pane, Line Items)
│   ├── config/                    # Global constants, branding tokens
│   │   ├── theme.js               # Color codes (Orange, Grey, White), typography rules
│   │   └── equipmentList.js       # Hardcoded initial equipment/rate data
│   ├── hooks/                     # Custom React hooks (e.g., useQuotationCalculator)
│   ├── pages/                     # Main view pages
│   │   └── CreateQuotation.jsx    # Primary workspace for generating quotes
│   ├── services/                  # External APIs, localStorage wrappers, or export logic
│   ├── styles/                    # Global CSS / framework configurations
│   │   └── index.css              # Main stylesheet containing brand CSS variables
│   ├── utils/                     # Helper functions (currency formatting, date formatters)
│   ├── App.jsx                    # Root component and potential routing setup
│   └── main.jsx                   # React DOM entry point
├── docs/                          # Project planning and requirements (You are here)
├── package.json                   # Dependencies
└── README.md                      # Project setup instructions
```
