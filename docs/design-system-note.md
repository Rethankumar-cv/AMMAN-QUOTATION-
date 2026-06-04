# Design System Implementation Note

The design system has been successfully implemented directly into `src/styles/index.css`. 

## Key Features Built:
1. **Color Tokens:** CSS Custom Properties (`--color-orange-500`, `--color-grey-500`) are mapped directly from the Amman Earth Movers logo, ensuring absolute brand consistency. Semantic tokens (`--bg-app`, `--border-focus`) abstract the colors for logical UI usage.
2. **Typography Rules:** A clean `Inter`/sans-serif stack is defined. Heading sizes scale logically, and form labels use a distinctive, professional uppercase tracking style (`.form-label`).
3. **Spacing Scale:** An `8px` grid system is strictly enforced via `--space-1` through `--space-10`.
4. **Mobile First Architecture:** The `.app-container` restricts max width to `768px` and centers the app. This simulates a high-end mobile/tablet application perfectly suited for field managers.
5. **Interactive States:** 
   - Primary buttons (`.btn-primary`) feature hover darkening and an active click depression effect.
   - Input fields (`.form-input`) have a `16px` font size (preventing unwanted iOS zooming on mobile) and transition to a sharp Brand Orange glowing border (`box-shadow`) upon focus.
   - Error states (`.form-input.error`) are pre-defined to turn red.

This CSS file now serves as the single source of truth for all component styling moving forward.
