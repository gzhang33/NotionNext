/* eslint-disable react/no-unknown-property */
const Style = () => {
  return (
    <style jsx global>{`
      :root {
        --bg: #1a1a1a;
        --bg-surface: rgba(255, 255, 255, 0.03);
        --bg-surface-hover: rgba(255, 255, 255, 0.06);
        --border: rgba(255, 255, 255, 0.06);
        --border-hover: rgba(255, 255, 255, 0.12);
        --text: rgba(255, 255, 255, 0.85);
        --text-secondary: rgba(255, 255, 255, 0.4);
        --text-muted: rgba(255, 255, 255, 0.2);
        --text-body: rgba(255, 255, 255, 0.6);
        --accent: #ff5c39;
        --accent-soft: rgba(255, 92, 57, 0.08);
        --glass-bg: rgba(255, 255, 255, 0.05);
        --glass-border: rgba(255, 255, 255, 0.08);
        --code-bg: rgba(255, 255, 255, 0.03);
        --divider: rgba(255, 255, 255, 0.06);
        --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
        --shadow-lg: 0 8px 30px rgba(0, 0, 0, 0.25);
        --radius-sm: 8px;
        --radius-lg: 16px;
        --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
        --transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
        --transition-slow: 400ms cubic-bezier(0.4, 0, 0.2, 1);
        --progress-height: 3px;
        --cover-radius: 10px;
        --header-height: 56px;
      }

      .light #theme-gianni {
        --bg: #f5f2ed;
        --bg-surface: rgba(0, 0, 0, 0.03);
        --bg-surface-hover: rgba(0, 0, 0, 0.06);
        --border: rgba(0, 0, 0, 0.08);
        --border-hover: rgba(0, 0, 0, 0.15);
        --text: rgba(0, 0, 0, 0.85);
        --text-secondary: rgba(0, 0, 0, 0.45);
        --text-muted: rgba(0, 0, 0, 0.22);
        --text-body: rgba(0, 0, 0, 0.6);
        --accent: #ff5c39;
        --accent-soft: rgba(255, 92, 57, 0.06);
        --glass-bg: rgba(255, 255, 255, 0.7);
        --glass-border: rgba(0, 0, 0, 0.08);
        --code-bg: rgba(0, 0, 0, 0.04);
        --divider: rgba(0, 0, 0, 0.08);
        --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06);
        --shadow-lg: 0 8px 30px rgba(0, 0, 0, 0.1);
      }

      #theme-gianni {
        background-color: var(--bg);
        color: var(--text);
        font-family: 'Inter', sans-serif;
        transition:
          background-color 300ms,
          color 300ms;
      }

      #theme-gianni a {
        color: var(--text-secondary);
        text-decoration: none;
        transition: color var(--transition-fast);
      }
      #theme-gianni a:hover {
        color: var(--accent);
      }

      #theme-gianni ::selection {
        background: rgba(255, 92, 57, 0.3);
        color: #fff;
      }

      #theme-gianni .notion {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
      }

      /* ── Responsive Grid ── */
      @media (max-width: 900px) {
        #container-wrapper {
          grid-template-columns: 1fr !important;
        }
        #right-sidebar {
          display: none !important;
        }
      }

      /* ── Typography ── */
      #theme-gianni .blog-item-title {
        color: var(--text);
        font-family: 'Syne', sans-serif;
        font-weight: 700;
      }
      #theme-gianni .blog-item-title:hover {
        color: var(--accent);
      }

      #theme-gianni .gianni-theme-toggle {
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 9999px;
        background: var(--bg-surface);
        border: 1px solid var(--border);
        transition: all var(--transition-fast);
      }
      #theme-gianni .gianni-theme-toggle:hover {
        border-color: var(--border-hover);
        box-shadow: var(--shadow-sm);
      }

      /* ── Navbar (floating pill) ── */
      #theme-gianni .gianni-nav-pill {
        background: #1a1a1a;
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 1.25rem;
        box-shadow: 0 18px 42px rgba(0, 0, 0, 0.18);
        transition: box-shadow var(--transition-base);
      }
      @media (min-width: 640px) {
        #theme-gianni .gianni-nav-pill {
          border-radius: 9999px;
        }
      }
      .light #theme-gianni .gianni-nav-pill {
        background: #1a1a1a;
        border-color: rgba(255, 255, 255, 0.05);
      }
      #theme-gianni .gianni-nav-logo {
        font-family: 'Syne', sans-serif;
        font-weight: 800;
        font-size: 13px;
        letter-spacing: -0.02em;
        line-height: 1;
        color: rgba(255, 255, 255, 0.85);
        text-decoration: none;
      }
      .light #theme-gianni .gianni-nav-logo {
        color: #fff;
      }
      #theme-gianni .gianni-nav-dot {
        color: var(--accent);
      }
      #theme-gianni .gianni-nav-link {
        display: inline-block;
        border-radius: 9999px;
        padding: 6px 14px;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.02em;
        line-height: 1;
        transition: all 200ms;
        color: rgba(255, 255, 255, 0.4);
        text-decoration: none;
        cursor: pointer;
      }
      .light #theme-gianni .gianni-nav-link {
        color: rgba(255, 255, 255, 0.5);
      }
      #theme-gianni .gianni-nav-link:hover {
        color: rgba(255, 255, 255, 1);
        background: rgba(255, 255, 255, 0.08);
      }
      #theme-gianni .gianni-nav-link:active {
        transform: scale(0.95);
      }
      #theme-gianni .gianni-nav-link.active {
        background: var(--accent);
        color: #fff;
      }
      #theme-gianni .gianni-hamburger {
        color: #fff;
        transition:
          background 200ms,
          transform 200ms;
      }
      #theme-gianni .gianni-hamburger:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      #theme-gianni .gianni-hamburger:active {
        transform: scale(0.9);
      }

      /* ── Mobile fullscreen overlay (personal website style) ── */
      #theme-gianni .gianni-mobile-fullscreen-backdrop {
        background: rgba(26, 26, 26, 0.95);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        position: fixed;
        inset: 0;
      }
      .light #theme-gianni .gianni-mobile-fullscreen-backdrop {
        background: rgba(26, 26, 26, 0.95);
      }
      #theme-gianni .gianni-mobile-fullscreen-link {
        font-family: 'Syne', sans-serif;
        font-size: 28px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.9);
        padding: 8px 0;
        transition:
          color 200ms,
          transform 200ms;
        text-decoration: none;
      }
      #theme-gianni .gianni-mobile-fullscreen-link:hover {
        color: var(--accent);
      }
      #theme-gianni .gianni-mobile-fullscreen-link:active {
        transform: scale(0.95);
        background: rgba(255, 255, 255, 0.05);
      }

      /* ── Pills & Tags ── */
      #theme-gianni .gianni-pill {
        font-size: 11px;
        padding: 5px 16px;
        border-radius: 999px;
        color: var(--text-secondary);
        border: 1px solid var(--border);
        transition: all var(--transition-fast);
        cursor: pointer;
        position: relative;
      }
      #theme-gianni .gianni-pill:hover {
        color: var(--text);
        border-color: var(--border-hover);
      }
      #theme-gianni .gianni-pill.active {
        color: var(--accent);
        border-color: rgba(255, 92, 57, 0.25);
      }
      #theme-gianni .gianni-pill.active::after {
        content: '';
        position: absolute;
        bottom: -3px;
        left: 50%;
        transform: translateX(-50%);
        width: 12px;
        height: 2px;
        border-radius: 1px;
        background: var(--accent);
      }

      #theme-gianni .gianni-tag {
        font-size: 9px;
        padding: 2px 8px;
        border-radius: 999px;
        color: var(--text-muted);
        border: 1px solid var(--border);
        transition: all var(--transition-fast);
        white-space: nowrap;
      }
      #theme-gianni .gianni-tag:hover {
        color: var(--text-secondary);
        border-color: var(--border-hover);
      }

      /* ── Timeline ── */
      #theme-gianni .gianni-timeline-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--text-muted);
        transition: background var(--transition-fast);
      }
      #theme-gianni .gianni-timeline-item:hover .gianni-timeline-dot {
        background: var(--accent);
      }
      #theme-gianni .gianni-timeline-line {
        width: 1px;
        background: var(--divider);
        position: absolute;
        top: 16px;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
      #theme-gianni .gianni-timeline-item:first-child .gianni-timeline-dot {
        background: var(--accent);
      }
      #theme-gianni .gianni-timeline-item:first-child .gianni-timeline-title {
        color: var(--accent);
      }

      /* ── Cards & Widgets ── */
      #theme-gianni .gianni-card {
        background: var(--bg-surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        transition: all var(--transition-base);
      }
      #theme-gianni .gianni-card:hover {
        border-color: var(--border-hover);
        box-shadow: var(--shadow-sm);
      }

      #theme-gianni .gianni-sidebar-widget {
        background: var(--bg-surface);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 16px;
        transition: all var(--transition-base);
      }

      /* ── Section Titles ── */
      #theme-gianni .gianni-section-title {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--text-muted);
        font-weight: 500;
        margin-bottom: 8px;
      }

      /* ── TOC ── */
      #theme-gianni .gianni-toc-item {
        font-size: 11px;
        color: var(--text-muted);
        padding: 5px 0 5px 12px;
        border-left: 1px solid var(--divider);
        transition: all var(--transition-fast);
        margin-bottom: 2px;
        display: block;
      }
      #theme-gianni .gianni-toc-item:hover {
        color: var(--text-secondary);
      }
      #theme-gianni .gianni-toc-item.active {
        color: var(--accent);
        border-left-color: var(--accent);
        background: rgba(255, 92, 57, 0.04);
      }

      /* ── Glass Input ── */
      #theme-gianni .gianni-glass-input {
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-lg);
        transition: all var(--transition-base);
      }
      #theme-gianni .gianni-glass-input:focus-within {
        box-shadow: 0 0 0 2px var(--accent);
        border-color: rgba(255, 92, 57, 0.3);
      }
      #theme-gianni .gianni-glass-input:focus-within .gianni-search-icon {
        color: var(--accent);
      }

      /* ── Reading Progress ── */
      #theme-gianni .gianni-reading-progress {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 60;
        height: var(--progress-height);
        background: var(--accent);
        transition: width 100ms linear;
        pointer-events: none;
      }

      /* ── Animations ── */
      @keyframes gianni-fade-in {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      #theme-gianni .gianni-animate-in {
        opacity: 0;
        animation: gianni-fade-in 300ms ease-out forwards;
      }

      /* ── Scrollbar ── */
      #theme-gianni ::-webkit-scrollbar {
        width: 4px;
      }
      #theme-gianni ::-webkit-scrollbar-thumb {
        background: var(--text-muted);
        border-radius: 999px;
      }

      /* (old mobile nav styles replaced by fullscreen overlay) */
    `}</style>
  )
}

export { Style }
