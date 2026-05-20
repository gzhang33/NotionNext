/* eslint-disable react/no-unknown-property */
const Style = () => {
  return <style jsx global>{`

    :root {
      --bg: #1a1a1a;
      --bg-surface: rgba(255,255,255,0.03);
      --bg-surface-hover: rgba(255,255,255,0.06);
      --border: rgba(255,255,255,0.06);
      --border-hover: rgba(255,255,255,0.12);
      --text: rgba(255,255,255,0.85);
      --text-secondary: rgba(255,255,255,0.4);
      --text-muted: rgba(255,255,255,0.2);
      --text-body: rgba(255,255,255,0.6);
      --accent: #ff5c39;
      --glass-bg: rgba(255,255,255,0.05);
      --glass-border: rgba(255,255,255,0.08);
      --code-bg: rgba(255,255,255,0.03);
      --divider: rgba(255,255,255,0.06);
    }

    .light #theme-gianni {
      --bg: #f5f2ed;
      --bg-surface: rgba(0,0,0,0.03);
      --bg-surface-hover: rgba(0,0,0,0.06);
      --border: rgba(0,0,0,0.08);
      --border-hover: rgba(0,0,0,0.15);
      --text: rgba(0,0,0,0.85);
      --text-secondary: rgba(0,0,0,0.45);
      --text-muted: rgba(0,0,0,0.22);
      --text-body: rgba(0,0,0,0.6);
      --accent: #ff5c39;
      --glass-bg: rgba(255,255,255,0.7);
      --glass-border: rgba(0,0,0,0.08);
      --code-bg: rgba(0,0,0,0.04);
      --divider: rgba(0,0,0,0.08);
    }

    #theme-gianni {
      background-color: var(--bg);
      color: var(--text);
      font-family: 'Inter', sans-serif;
      transition: background-color 300ms, color 300ms;
    }

    #theme-gianni a { color: var(--text-secondary); text-decoration: none; transition: color 200ms; }
    #theme-gianni a:hover { color: var(--accent); }

    #theme-gianni ::selection { background: rgba(255,92,57,0.3); color: #fff; }

    #theme-gianni .notion { margin-top: 0 !important; margin-bottom: 0 !important; }

    #theme-gianni .blog-item-title {
      color: var(--text);
      font-family: 'Syne', sans-serif;
      font-weight: 700;
    }
    #theme-gianni .blog-item-title:hover { color: var(--accent); }

    #theme-gianni .gianni-navbar-inner {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 999px;
    }

    #theme-gianni .gianni-pill {
      font-size: 11px; padding: 5px 16px; border-radius: 999px;
      color: var(--text-secondary); border: 1px solid var(--border);
      transition: all 200ms; cursor: pointer;
    }
    #theme-gianni .gianni-pill:hover { color: var(--text); border-color: var(--border-hover); }
    #theme-gianni .gianni-pill.active {
      background: rgba(255,92,57,0.1); color: var(--accent);
      border-color: rgba(255,92,57,0.2);
    }

    #theme-gianni .gianni-timeline-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: var(--text-muted); transition: background 200ms;
    }
    #theme-gianni .gianni-timeline-item:hover .gianni-timeline-dot { background: var(--accent); }
    #theme-gianni .gianni-timeline-line {
      width: 1px; background: var(--divider);
      position: absolute; top: 16px; bottom: 0; left: 50%; transform: translateX(-50%);
    }
    #theme-gianni .gianni-timeline-item:first-child .gianni-timeline-dot { background: var(--accent); }
    #theme-gianni .gianni-timeline-item:first-child .gianni-timeline-title { color: var(--accent); }

    #theme-gianni .gianni-sidebar-widget {
      background: var(--bg-surface); border: 1px solid var(--border);
      border-radius: 12px; padding: 16px; transition: all 300ms;
    }

    #theme-gianni .gianni-toc-item {
      font-size: 11px; color: var(--text-muted); padding: 5px 0 5px 12px;
      border-left: 1px solid var(--divider); transition: all 200ms;
      margin-bottom: 2px; display: block;
    }
    #theme-gianni .gianni-toc-item:hover { color: var(--text-secondary); }
    #theme-gianni .gianni-toc-item.active {
      color: var(--accent); border-left-color: var(--accent);
      background: rgba(255,92,57,0.04);
    }

    #theme-gianni ::-webkit-scrollbar { width: 4px; }
    #theme-gianni ::-webkit-scrollbar-thumb { background: var(--text-muted); border-radius: 999px; }

  `}</style>
}

export { Style }
