# Production Readiness Checklist

## 🔴 Critical Pre-Deployment Tasks (Technical Debt)
- [ ] **Storage Migration:** Move `companyProfile` and `branding` Base64 objects from `localStorage` to `IndexedDB` to avoid the 5MB browser quota limit crashing the autosave feature.
- [ ] **Draft Recovery UI:** Surface the `recoverOrphanedDrafts()` function on the Dashboard so users can actually interact with and recover their crashed sessions.
- [ ] **PWA Asset Verification:** Ensure `/assets/amman-logo.png` and `favicon.ico` are correctly placed in the `/public` directory for the manifest to load correctly on iOS/Android.

## 🟠 High Priority Polish (UX/UI)
- [ ] **Mobile Preview Scaling:** Add a CSS media query with `transform: scale()` to the `.preview-container` so the A4 PDF template fits visually on a mobile screen without horizontal scrolling.
- [ ] **Edit Mode Cleanup:** Ensure that navigating away from an `/edit/:id` route via the browser back button automatically clears the `aem_edit_draft_[id]` key to prevent storage bloat.
- [ ] **Sequence Rollover QA:** Manually test changing the OS system clock to April 1st to verify the financial year reference number sequence strictly resets to `0001`.

## 🟡 Standard Deployment Tasks
- [ ] **Lighthouse Audit:** Run Google Lighthouse to verify the Service Worker registers correctly and the Web App Manifest meets all installability criteria.
- [ ] **Build Validation:** Run `npm run build` locally to ensure Vite transpiles without syntax, dependency, or React hook exhaustive-deps warnings.
- [ ] **Hosting CI/CD:** Connect the GitHub repository to Vercel/Netlify for automated production deployments.
- [ ] **Manifest Update:** Verify the `theme_color` in the `manifest.json` correctly matches the brand's primary orange (`#F39200`) for the mobile status bar tint.
