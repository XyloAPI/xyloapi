# XyloAPI Frontend Design & Layout Rules

This document outlines the strict styling, spacing, and layout specifications for the XyloAPI frontend. All future modifications, new pages, and component refinements must adhere to these rules to maintain design consistency and premium visual aesthetics.

---

## 📐 1. Full-Screen Fluid Layout (Tidak Mengumpul di Tengah)

*   **Fluid Containers**: Do NOT restrict page layouts or sections to narrow fixed-width centered boxes (such as standard `1280px` maximum widths).
*   **Container Width**: All core layout containers (`.container`) must span the full screen width:
    ```css
    .container {
      max-width: 100%;
      margin: 0 auto;
      padding: 0 80px; /* Generous 80px side margins on desktop */
      width: 100%;
    }
    ```
*   **Responsive Side Padding**:
    *   **Desktop**: `80px`
    *   **Tablet**: `48px`
    *   **Mobile**: `24px`
*   **Expanded Rows**: Dynamic status rows, navigation headers, and feature grids must stretch horizontally to the left and right margins of the viewport instead of clustering in a narrow pillar.

---

## ↕️ 2. Generous Vertical Spacing (Lebih ke Atas & Lebih ke Bawah)

*   **Breathing Room**: Avoid tight vertical stacking. Allow layout components to spread out vertically towards the top and bottom of the viewport.
*   **Hero Section Padding**:
    ```css
    .hero-section {
      min-height: 100vh;
      padding-top: 160px;   /* Deep top clearance under navigation */
      padding-bottom: 120px; /* Spacious bottom span */
    }
    ```
*   **Vertical Margins Hierarchy (Hero)**:
    *   **Headline to Description**: `32px`
    *   **Description to Action Buttons**: `48px`
    *   **Buttons to Stats Divider Line**: `72px`
    *   **Stats Row Padding (Internal)**: `36px 0` (Top and bottom padding inside the horizontal dividing lines)
*   **Section Padding**: General page sections must have at least `120px` to `140px` of vertical padding.

---

## ⚖️ 3. Element Alignment & Typography Widths

*   **Stat Item Centering**: Any multi-column stat or detail block must align its text and child elements internally to the center:
    ```css
    .hero-stat-item {
      display: flex;
      flex-direction: column;
      align-items: center; /* Center-aligns values and labels */
      text-align: center;
      flex: 1;
    }
    ```
*   **Readable Paragraph Boundaries**: Centered paragraph text (such as descriptions) must have an expanded width boundary so it does not wrap excessively:
    ```css
    .hero-description.centered {
      text-align: center;
      margin-left: auto;
      margin-right: auto;
      max-width: 820px; /* Spans wider to let text flow smoothly */
    }
    ```
*   **Open Typography (Outfit & Space Grotesk)**:
    *   Display headers must use a slightly open letter-spacing to prevent cramped or squished headings:
        ```css
        .hero-title {
          font-family: var(--font-display); /* Outfit */
          letter-spacing: 0.02em; /* Spacious, high-end look */
        }
        ```

---

## 🎨 4. Premium Lamborghini Visual Identity

*   **Color Palette**:
    *   **Background Canvas**: `#000000` (Pure Black)
    *   **Card Surfaces**: `#0D0D0D` (Deep Iron)
    *   **Borders & Dividers**: `#1A1A1A` (Thin Charcoal Line)
    *   **Highlights & Primary Buttons**: `#FFC000` (Pure Gold)
    *   **Text Neutrals**: `#FFFFFF` (White) and `#888888` (Ash Grey)
*   **Sharp Edges Policy**:
    *   **Zero Border-Radius**: Under no circumstances should borders be rounded. All buttons, cards, containers, input forms, and highlights must have `0px` border radius (strictly sharp edges):
        ```css
        border-radius: 0px !important;
        ```

---

## 🚫 5. Authenticity Policy (No Fake Elements)

*   **Zero AI-Template Clichés**: Remove simulated interactive terminals, fake scrolling log consoles, execution status dots, and simulation buttons.
*   **Data Truthfulness**: Metrics and stats must reflect actual backend parameters and Neon PostgreSQL database request logs, returning zero values truthfully if no traffic has been registered.

---

## 🔒 6. Production Safety & Cleanliness (No Errors or Data Exposure)

*   **No Console Diagnostic Clutter**: Do not leave development console logs (`console.log`, `console.error`, `console.debug`) in production-ready files. Keep the browser console clean and professional.
*   **Zero Internal Data Exposure**: Never render raw stack traces, SQL syntax strings, endpoint secrets, database table structures, or system filepath references in user-facing components.
*   **Elegant & Secure Error Fallbacks**: When API requests fail or the gateway goes offline:
    *   Do NOT show raw server error codes or raw alert boxes.
    *   Gracefully render safe, localized fallback placeholders (e.g., `0`, `0ms`, `100%`, or empty states `—`) to protect backend structural information from exposure.

---

## 🔒 7. Strict Error Wrapping Policy (No Frontend Error Exposure)

*   **Zero Frontend Error Leakage**: Under no circumstances should raw error messages, network stack traces, raw HTTP status codes, or dynamic database/API error descriptions be displayed to the user on the frontend UI.
*   **Uniform Template Message**: All errors on the frontend UI must be wrapped in a single, consistent static template text for all endpoints:
    ```
    Request execution failed.
    ```
*   **Terminal Redirection**: Log the detailed raw error object/string to the developer tools console (`console.error(...)`) on the client side.
*   **Wajib Dibaca Sebelum Mulai**: This rule is mandatory. Before working on any page, component, or endpoint handler, ensure that this error template wrapping is strictly integrated.
