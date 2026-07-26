/**
 * EP Script Hub V1
 */

(function () {
  if (document.getElementById('ep-hub')) {
    const ex = document.getElementById('ep-hub');
    ex.style.display = ex.style.display === 'none' ? 'block' : 'none';
    return;
  }
  const originalPerformanceNow = performance.now.bind(performance);
  let timeOffset = 0;
  let timeTargetOffset = 0;
  let timeLoopStarted = false;
  let isInstantFailureActive = false;
  let isReverseTimerActive = false;

  function startTimeLoop() {
    if (timeLoopStarted) return;
    timeLoopStarted = true;
    function tick() {
      timeOffset += (timeTargetOffset - timeOffset) * 0.08;
      requestAnimationFrame(tick);
    }
    tick();
  }

  const customPerformanceNow = () => originalPerformanceNow() + timeOffset;

  function restorePerformanceNow() {
    if (isInstantFailureActive) {
      performance.now = () => originalPerformanceNow() * 9999;
    } else if (isReverseTimerActive) {
      performance.now = () => originalPerformanceNow() / -1;
    } else if (timeLoopStarted) {
      performance.now = customPerformanceNow;
    } else {
      performance.now = originalPerformanceNow;
    }
  }


  if (!document.getElementById('ep-hub-font')) {
    const link = document.createElement('link');
    link.id = 'ep-hub-font';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(link);
  }

  const style = document.createElement('style');
  style.id = 'ep-hub-styles';
  style.innerHTML = `
    #ep-hub {
      position: fixed;
      top: 40px;
      right: 40px;
      width: 740px;
      height: 460px;
      background: #080c14;
      border: none;
      border-radius: 14px;
      box-shadow: 0 28px 72px rgba(0,0,0,0.85);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #cbd5e1;
      z-index: 2147483647 !important;
      overflow: hidden;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), height 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), border-radius 0.3s;
      padding: 2px;
      transform: translateZ(0);
      backface-visibility: hidden;
      animation: ep-container-pulse 8s infinite ease-in-out;
    }

    /* Dual Layer Rotating Border Systems */
    /* Clockwise Indigo-Blue Laser Beam */
    #ep-hub::before {
      content: '';
      position: absolute;
      top: -65%;
      left: -65%;
      width: 230%;
      height: 230%;
      background: conic-gradient(
        from 0deg,
        transparent 0%,
        transparent 45%,
        #1e3a8a 60%,
        #3b82f6 80%,
        #60a5fa 95%,
        #3b82f6 100%
      );
      animation: ep-border-zip-cw 4.5s infinite linear;
      will-change: transform;
      z-index: -3;
    }

    /* Counter-Clockwise Teal-Indigo Laser Beam */
    .ep-border-bg2 {
      content: '';
      position: absolute;
      top: -65%;
      left: -65%;
      width: 230%;
      height: 230%;
      background: conic-gradient(
        from 180deg,
        transparent 0%,
        transparent 45%,
        #312e81 60%,
        #06b6d4 80%,
        #22d3ee 95%,
        #06b6d4 100%
      );
      animation: ep-border-zip-ccw 6s infinite linear;
      will-change: transform;
      z-index: -2;
      mix-blend-mode: screen;
      pointer-events: none;
    }

    /* Inner mask overlaying the backgrounds */
    #ep-hub::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      right: 2px;
      bottom: 2px;
      background: linear-gradient(145deg, #070b13 0%, #090e19 50%, #05080e 100%);
      border-radius: 12px;
      z-index: -1;
      pointer-events: none;
      animation: ep-mask-shimmer 12s infinite linear;
      background-size: 200% 200%;
    }

    #ep-hub.ep-min::after {
      border-radius: 6px;
    }

    /* Clockwise keyframes */
    @keyframes ep-border-zip-cw {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    /* Counter-clockwise keyframes */
    @keyframes ep-border-zip-ccw {
      0% {
        transform: rotate(360deg);
      }
      100% {
        transform: rotate(0deg);
      }
    }

    /* Pulse glow keyframes */
    @keyframes ep-container-pulse {
      0%, 100% {
        box-shadow: 0 28px 72px rgba(0,0,0,0.85),
                    0 0 16px rgba(59, 130, 246, 0.1);
      }
      50% {
        box-shadow: 0 28px 72px rgba(0,0,0,0.85),
                    0 0 32px rgba(6, 182, 212, 0.22);
      }
    }

    /* Mask background light shimmering */
    @keyframes ep-mask-shimmer {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    /* Modern Thin Scrollbar Styling */
    .ep-content::-webkit-scrollbar,
    .ep-cheers-list::-webkit-scrollbar,
    .ep-sticker-grid::-webkit-scrollbar {
      width: 4px;
    }
    .ep-content::-webkit-scrollbar-track,
    .ep-cheers-list::-webkit-scrollbar-track,
    .ep-sticker-grid::-webkit-scrollbar-track {
      background: transparent;
    }
    .ep-content::-webkit-scrollbar-thumb,
    .ep-cheers-list::-webkit-scrollbar-thumb,
    .ep-sticker-grid::-webkit-scrollbar-thumb {
      background: #1e293b;
      border-radius: 4px;
    }
    .ep-content::-webkit-scrollbar-thumb:hover,
    .ep-cheers-list::-webkit-scrollbar-thumb:hover,
    .ep-sticker-grid::-webkit-scrollbar-thumb:hover {
      background: #3b82f6;
    }

    #ep-hub.ep-min {
      width: 190px;
      height: 38px;
      border-radius: 8px;
    }

    .ep-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 18px;
      background: #0c111d;
      border-bottom: 1px solid rgba(59, 130, 246, 0.15);
      cursor: move;
      user-select: none;
      height: 40px;
      box-sizing: border-box;
      flex-shrink: 0;
    }

    #ep-hub.ep-min .ep-header {
      border-bottom: none;
      padding: 8px 14px;
      height: 38px;
    }

    .ep-title {
      font-size: 13px;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.06em;
      display: flex;
      align-items: center;
      gap: 8px;
      text-transform: uppercase;
    }

    .ep-title-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #3b82f6;
      box-shadow: 0 0 6px #3b82f6;
    }

    .ep-tag {
      font-size: 9.5px;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: #3b82f6;
      background: rgba(59, 130, 246, 0.12);
      border: 1px solid rgba(59, 130, 246, 0.25);
      padding: 2px 6px;
      border-radius: 4px;
      box-shadow: 0 0 6px rgba(59, 130, 246, 0.15);
      animation: ep-glow-pulse 2.2s infinite ease-in-out;
    }

    @keyframes ep-glow-pulse {
      0%, 100% {
        box-shadow: 0 0 4px rgba(59, 130, 246, 0.15);
        border-color: rgba(59, 130, 246, 0.25);
      }
      50% {
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.45);
        border-color: rgba(59, 130, 246, 0.55);
      }
    }

    #ep-hub.ep-min .ep-tag,
    #ep-hub.ep-min .ep-title-dot {
      display: none;
    }

    .ep-controls {
      display: flex;
      gap: 6px;
    }

    .ep-ctrl {
      background: none;
      border: none;
      color: #475569;
      font-size: 15px;
      cursor: pointer;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: color 0.15s, background 0.15s;
      padding: 0;
      line-height: 1;
    }

    .ep-ctrl:hover {
      color: #94a3b8;
      background: rgba(148, 163, 184, 0.08);
    }
    
    #ep-x:hover {
      color: #f87171;
      background: rgba(248, 113, 113, 0.08);
    }

    .ep-layout {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    #ep-hub.ep-min .ep-layout {
      display: none;
    }

    .ep-sidebar {
      width: 190px;
      background: #05080f;
      border-right: 1px solid #141c2b;
      display: flex;
      flex-direction: column;
      padding: 16px 8px;
      gap: 6px;
      box-sizing: border-box;
      flex-shrink: 0;
    }

    .ep-sb-label {
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #334155;
      text-transform: uppercase;
      padding: 4px 10px;
      margin-bottom: 2px;
    }

    .ep-tab-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      background: none;
      border: none;
      color: #475569;
      font-family: inherit;
      font-size: 12.5px;
      font-weight: 600;
      padding: 10px 14px;
      border-radius: 8px;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s ease;
      width: 100%;
      box-sizing: border-box;
    }

    .ep-tab-btn:hover {
      background: rgba(148, 163, 184, 0.04);
      color: #94a3b8;
    }

    .ep-tab-btn.ep-active {
      background: rgba(59, 130, 246, 0.08);
      color: #3b82f6;
    }

    .ep-tab-btn svg {
      width: 15px;
      height: 15px;
      stroke: currentColor;
      stroke-width: 2;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
      transition: stroke 0.2s ease;
    }

    .ep-content {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }

    .ep-pane {
      display: none;
      flex-direction: column;
      flex: 1;
    }

    .ep-pane.ep-active {
      display: flex;
    }

    .ep-section-label {
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: #334155;
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    .ep-note {
      font-size: 11.5px;
      color: #475569;
      line-height: 1.45;
      margin-bottom: 18px;
      background: #0c111d;
      border: 1px solid #141c2b;
      border-radius: 8px;
      padding: 10px 14px;
    }

    .ep-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .ep-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #0c111d;
      border: 1px solid #141c2b;
      border-radius: 6px;
      padding: 8px 12px;
      cursor: pointer;
      text-align: left;
      font-family: inherit;
      color: #94a3b8;
      width: 100%;
      height: 48px;
      box-sizing: border-box;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .ep-btn:hover {
      background: #0f1625;
      border-color: rgba(59, 130, 246, 0.35);
      color: #cbd5e1;
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.08);
    }

    .ep-btn-icon {
      width: 28px;
      height: 28px;
      background: rgba(59, 130, 246, 0.06);
      border: 1px solid rgba(59, 130, 246, 0.12);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .ep-btn:hover .ep-btn-icon {
      background: rgba(59, 130, 246, 0.12);
      border-color: rgba(59, 130, 246, 0.25);
    }

    .ep-btn-icon svg {
      width: 13px;
      height: 13px;
      stroke: #3b82f6;
      stroke-width: 2;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
      transition: stroke 0.3s ease;
    }

    .ep-btn-label {
      font-size: 12.5px;
      font-weight: 600;
      color: #94a3b8;
      transition: color 0.3s ease;
    }

    .ep-btn:hover .ep-btn-label {
      color: #cbd5e1;
    }

    .ep-btn.ep-running {
      background: rgba(234, 179, 8, 0.05) !important;
      border-color: rgba(234, 179, 8, 0.3) !important;
      color: #fbbf24 !important;
      cursor: not-allowed;
    }
    .ep-btn.ep-running .ep-btn-icon {
      background: rgba(234, 179, 8, 0.1) !important;
      border-color: rgba(234, 179, 8, 0.2) !important;
    }
    .ep-btn.ep-running .ep-btn-icon svg {
      stroke: #fbbf24 !important;
    }
    .ep-btn.ep-running .ep-btn-label {
      color: #fbbf24 !important;
    }

    .ep-btn.ep-done-state {
      background: rgba(34, 197, 94, 0.05) !important;
      border-color: rgba(34, 197, 94, 0.3) !important;
      color: #4ade80 !important;
      cursor: not-allowed;
    }
    .ep-btn.ep-done-state .ep-btn-icon {
      background: rgba(34, 197, 94, 0.1) !important;
      border-color: rgba(34, 197, 94, 0.2) !important;
    }
    .ep-btn.ep-done-state .ep-btn-icon svg {
      stroke: #4ade80 !important;
    }
    .ep-btn.ep-done-state .ep-btn-label {
      color: #4ade80 !important;
    }

    .ep-btn.ep-error-state {
      background: rgba(239, 68, 68, 0.05) !important;
      border-color: rgba(239, 68, 68, 0.3) !important;
      color: #f87171 !important;
    }
    .ep-btn.ep-error-state .ep-btn-icon {
      background: rgba(239, 68, 68, 0.1) !important;
      border-color: rgba(239, 68, 68, 0.2) !important;
    }
    .ep-btn.ep-error-state .ep-btn-icon svg {
      stroke: #f87171 !important;
    }
    .ep-btn.ep-error-state .ep-btn-label {
      color: #f87171 !important;
    }

    /* Active Toggled Button Style */
    .ep-btn.ep-toggled {
      background: rgba(34, 197, 94, 0.05) !important;
      border-color: rgba(34, 197, 94, 0.3) !important;
      color: #4ade80 !important;
    }
    .ep-btn.ep-toggled .ep-btn-icon {
      background: rgba(34, 197, 94, 0.1) !important;
      border-color: rgba(34, 197, 94, 0.2) !important;
    }
    .ep-btn.ep-toggled .ep-btn-icon svg {
      stroke: #4ade80 !important;
    }
    .ep-btn.ep-toggled .ep-btn-label {
      color: #4ade80 !important;
    }

    .ep-empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      flex: 1;
      padding: 36px 24px;
      border: 1px dashed #141c2b;
      border-radius: 10px;
      background: rgba(12, 17, 29, 0.2);
      margin-top: 10px;
    }

    .ep-empty-icon {
      font-size: 24px;
      margin-bottom: 10px;
      opacity: 0.6;
    }

    .ep-empty-title {
      font-size: 13.5px;
      font-weight: 600;
      color: #94a3b8;
      margin-bottom: 6px;
    }

    .ep-empty-desc {
      font-size: 11px;
      color: #475569;
      max-width: 240px;
      line-height: 1.4;
    }

    .ep-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 18px;
      border-top: 1px solid #141c2b;
      background: #05080f;
      height: 38px;
      box-sizing: border-box;
      flex-shrink: 0;
    }

    #ep-hub.ep-min .ep-footer {
      display: none;
    }

    .ep-status {
      font-size: 11px;
      font-weight: 600;
      color: #22c55e;
      letter-spacing: 0.03em;
      opacity: 0;
      transition: opacity 0.25s;
    }

    .ep-status.ep-status-visible {
      opacity: 1;
    }

    .ep-wordmark {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #1e293b;
      text-transform: uppercase;
    }

    .ep-spinner {
      animation: ep-spin 0.85s linear infinite;
    }

    @keyframes ep-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Modal Overlay Panel */
    .ep-modal-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(8, 12, 20, 0.95);
      backdrop-filter: blur(12px);
      z-index: 100;
      display: flex;
      flex-direction: column;
      padding: 20px;
      box-sizing: border-box;
      animation: ep-fade-in 0.2s ease-out;
    }

    @keyframes ep-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .ep-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      flex-shrink: 0;
    }

    .ep-modal-title {
      font-size: 13.5px;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .ep-modal-close {
      background: none;
      border: none;
      color: #475569;
      font-size: 22px;
      cursor: pointer;
      padding: 0 4px;
      line-height: 1;
      transition: color 0.15s;
    }

    .ep-modal-close:hover {
      color: #f87171;
    }

    .ep-cheers-list {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding-right: 4px;
    }

    .ep-cheer-item {
      background: #0c111d;
      border: 1px solid #141c2b;
      border-radius: 8px;
      padding: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .ep-cheer-item.slide-out {
      transform: translateX(100%);
      opacity: 0;
      height: 0;
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      margin-top: 0 !important;
      margin-bottom: 0 !important;
      border: none !important;
      overflow: hidden;
    }

    .ep-cheer-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .ep-cheer-emoji {
      font-size: 22px;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid #141c2b;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ep-cheer-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .ep-cheer-sender {
      font-size: 13px;
      font-weight: 600;
      color: #cbd5e1;
    }

    .ep-cheer-meta {
      font-size: 11px;
      color: #64748b;
    }

    .ep-cheer-actions {
      display: flex;
      gap: 8px;
    }

    .ep-cheer-btn {
      background: #05080f;
      border: 1px solid #141c2b;
      color: #94a3b8;
      font-size: 11px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .ep-cheer-btn:hover {
      background: #0f1625;
      border-color: #1d2d44;
      color: #cbd5e1;
    }

    .ep-cheer-btn.ep-cheer-primary {
      background: rgba(59, 130, 246, 0.08);
      border-color: rgba(59, 130, 246, 0.2);
      color: #3b82f6;
    }

    .ep-cheer-btn.ep-cheer-primary:hover {
      background: rgba(59, 130, 246, 0.15);
      border-color: rgba(59, 130, 246, 0.35);
      color: #60a5fa;
    }

    /* Sticker Selection Panel */
    .ep-sticker-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      overflow-y: auto;
      flex: 1;
      padding-right: 4px;
    }

    .ep-sticker-card {
      background: #0c111d;
      border: 1px solid #141c2b;
      border-radius: 8px;
      padding: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      cursor: pointer;
      position: relative;
      transition: all 0.2s;
      box-sizing: border-box;
      height: 70px;
    }

    .ep-sticker-card:hover:not(.ep-sticker-disabled) {
      background: #0f1625;
      border-color: #3b82f6;
    }

    .ep-sticker-card.ep-sticker-disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }

    .ep-sticker-emoji {
      font-size: 20px;
    }

    .ep-sticker-cost {
      font-size: 10px;
      color: #64748b;
      font-weight: 600;
    }

    .ep-sticker-lock {
      position: absolute;
      top: 4px;
      right: 6px;
      font-size: 9px;
      color: #ef4444;
    }

    /* Auth Cover styling */
    .ep-auth-cover {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #080c14;
      z-index: 100000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 30px;
      box-sizing: border-box;
      border-radius: 12px;
      font-family: 'Inter', sans-serif;
    }
    .ep-auth-title {
      font-size: 16px;
      font-weight: 700;
      color: #f1f5f9;
      margin-bottom: 8px;
      letter-spacing: 0.02em;
    }
    .ep-auth-info {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 20px;
      max-width: 320px;
      line-height: 1.5;
      text-align: center;
    }
    .ep-auth-input-wrapper {
      position: relative;
      width: 100%;
      max-width: 280px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .ep-auth-input {
      width: 100%;
      background: #0c111d;
      border: 1px solid #1e293b;
      color: #f1f5f9;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      box-sizing: border-box;
      text-align: center;
      letter-spacing: 0.05em;
      transition: border-color 0.2s;
    }
    .ep-auth-input:focus {
      border-color: #3b82f6;
    }
    .ep-auth-btn {
      width: 100%;
      background: #3b82f6;
      border: none;
      color: #ffffff;
      padding: 12px;
      border-radius: 8px;
      font-size: 13.5px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, opacity 0.2s;
    }
    .ep-auth-btn:hover {
      background: #2563eb;
    }
    .ep-auth-btn:disabled {
      background: #1e293b;
      color: #475569;
      cursor: not-allowed;
    }
    .ep-auth-error {
      font-size: 12px;
      color: #f87171;
      min-height: 18px;
      margin-top: 8px;
      font-weight: 500;
      line-height: 1.4;
      max-width: 280px;
      text-align: center;
    }
  `;
  document.head.appendChild(style);

  const hub = document.createElement('div');
  hub.id = 'ep-hub';
  hub.innerHTML = `
    <div class="ep-border-bg2"></div>
    <div class="ep-auth-cover" id="ep-auth-cover">
      <div class="ep-auth-title">Access - Enter your student ID</div>
      <div class="ep-auth-info">Go to your realm profile and enter the 6 digit student ID</div>
      <div class="ep-auth-input-wrapper">
        <input type="text" class="ep-auth-input" id="ep-auth-input" placeholder="000000" maxlength="8" />
        <button class="ep-auth-btn" id="ep-auth-btn">Verify Access</button>
        <div class="ep-auth-error" id="ep-auth-error"></div>
      </div>
    </div>
    <div class="ep-header" id="ep-drag">
      <div class="ep-title">
        EP Script Hub
        <span class="ep-tag">V1</span>
      </div>
      <div class="ep-controls">
        <button class="ep-ctrl" id="ep-min" title="Minimise">&#8212;</button>
        <button class="ep-ctrl" id="ep-x" title="Close">&#215;</button>
      </div>
    </div>

    <div class="ep-layout">
      <!-- Sidebar -->
      <div class="ep-sidebar">
        <div class="ep-sb-label">Tabs</div>
        <button class="ep-tab-btn ep-active" data-tab="classic">
          <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          Classic
        </button>
        <button class="ep-tab-btn" data-tab="languages">
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Languages
        </button>
      </div>

      <!-- Content Area -->
      <div class="ep-content" id="ep-body">
        <!-- Classic Tab -->
        <div class="ep-pane ep-active" id="pane-classic">
          <div class="ep-note" style="color: #60a5fa; border-color: rgba(59, 130, 246, 0.3); background: rgba(59, 130, 246, 0.05); font-weight: 500;">
            Complete task works, just might need a reload to actually SEE it worked fr
          </div>
          <div class="ep-section-label">Classic Tools</div>
          <div class="ep-buttons">
            <button class="ep-btn" id="ep-complete">
              <div class="ep-btn-icon">
                <svg viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span class="ep-btn-label">Complete Task</span>
            </button>
            
            <button class="ep-btn" id="ep-cheers">
              <div class="ep-btn-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <span class="ep-btn-label">Give Credits</span>
            </button>

            <button class="ep-btn" id="ep-set-credits" style="grid-column: span 2;">
              <div class="ep-btn-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <span class="ep-btn-label">Set Credits</span>
            </button>

            <button class="ep-btn" id="ep-check-cheers">
              <div class="ep-btn-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <span class="ep-btn-label">Check Cheers</span>
            </button>

            <button class="ep-btn" id="ep-send-cheer">
              <div class="ep-btn-icon">
                <svg viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </div>
              <span class="ep-btn-label">Send Cheer</span>
            </button>
          </div>

          <div class="ep-section-label" style="margin-top: 18px;">Toggles</div>
          <div class="ep-buttons">
            <button class="ep-btn" id="ep-auto-continue" style="grid-column: span 2;">
              <div class="ep-btn-icon">
                <svg viewBox="0 0 24 24">
                  <polygon points="5 4 15 12 5 20 5 4"></polygon>
                  <line x1="19" y1="5" x2="19" y2="19"></line>
                </svg>
              </div>
              <span class="ep-btn-label">Auto Continue</span>
            </button>
          </div>
        </div>

        <!-- Languages Tab -->
        <div class="ep-pane" id="pane-languages">
          <div class="ep-note">T = Toggle</div>
          <div class="ep-section-label">Timer</div>
          <div class="ep-buttons">
            <button class="ep-btn" id="ep-instant-failure">
              <div class="ep-btn-icon">
                <svg viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </div>
              <span class="ep-btn-label">Instant Failure [T]</span>
            </button>
            
            <button class="ep-btn" id="ep-adjust-time">
              <div class="ep-btn-icon">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <span class="ep-btn-label">Adjust Time</span>
            </button>

            <button class="ep-btn" id="ep-remove-timer">
              <div class="ep-btn-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </div>
              <span class="ep-btn-label">Remove Timer Number</span>
            </button>

            <button class="ep-btn" id="ep-reverse-timer">
              <div class="ep-btn-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                </svg>
              </div>
              <span class="ep-btn-label">Reverse Timer [T]</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="ep-footer">
      <span class="ep-status" id="ep-status">Done</span>
      <span class="ep-wordmark">Xylos</span>
    </div>
  `;
  document.body.appendChild(hub);

  // Pin position to left coords
  const r = hub.getBoundingClientRect();
  hub.style.left = r.left + 'px';
  hub.style.top = r.top + 'px';
  hub.style.right = 'auto';

  // Ensure our UI is ALWAYS ontop of EVERY OTHER UI
  setInterval(() => {
    if (hub.style.zIndex !== '2147483647') {
      hub.style.setProperty('z-index', '2147483647', 'important');
    }
  }, 1000);

  const drag = document.getElementById('ep-drag');
  const body = document.getElementById('ep-body');
  const minBtn = document.getElementById('ep-min');
  const closeBtn = document.getElementById('ep-x');
  const completeBtn = document.getElementById('ep-complete');
  const cheersBtn = document.getElementById('ep-cheers');
  const setCreditsBtn = document.getElementById('ep-set-credits');
  const checkCheersBtn = document.getElementById('ep-check-cheers');
  const sendCheerBtn = document.getElementById('ep-send-cheer');
  const autoContinueBtn = document.getElementById('ep-auto-continue');
  const instantFailureBtn = document.getElementById('ep-instant-failure');
  const adjustTimeBtn = document.getElementById('ep-adjust-time');
  const removeTimerBtn = document.getElementById('ep-remove-timer');
  const reverseTimerBtn = document.getElementById('ep-reverse-timer');
  const statusEl = document.getElementById('ep-status');

  // Tab bindings
  const tabs = hub.querySelectorAll('.ep-tab-btn');
  const panes = hub.querySelectorAll('.ep-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      tabs.forEach(t => t.classList.remove('ep-active'));
      panes.forEach(p => p.classList.remove('ep-active'));
      tab.classList.add('ep-active');
      hub.querySelector(`#pane-${target}`).classList.add('ep-active');
    });
  });

  let statusTimer = null;
  const showDone = () => {
    if (statusTimer) clearTimeout(statusTimer);
    statusEl.textContent = 'Done';
    statusEl.style.color = '#22c55e';
    statusEl.classList.add('ep-status-visible');
    statusTimer = setTimeout(() => {
      statusEl.classList.remove('ep-status-visible');
    }, 1800);
  };

  const showError = (msg = 'Error') => {
    if (statusTimer) clearTimeout(statusTimer);
    statusEl.textContent = msg;
    statusEl.style.color = '#f87171';
    statusEl.classList.add('ep-status-visible');
    statusTimer = setTimeout(() => {
      statusEl.classList.remove('ep-status-visible');
    }, 2500);
  };

  // Button Visual State Handler (Yellow loading -> Green Success -> Back to idle)
  const originalIcons = new Map();
  const setBtnState = (btn, state) => {
    const iconWrapper = btn.querySelector('.ep-btn-icon');
    
    if (!originalIcons.has(btn.id)) {
      originalIcons.set(btn.id, iconWrapper.innerHTML);
    }

    btn.classList.remove('ep-running', 'ep-done-state', 'ep-error-state');

    if (state === 'running') {
      btn.classList.add('ep-running');
      btn.disabled = true;
      iconWrapper.innerHTML = `
        <svg class="ep-spinner" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#fbbf24" stroke-width="3.5" fill="none" stroke-dasharray="34" stroke-dashoffset="10"></circle>
        </svg>
      `;
    } else if (state === 'done') {
      btn.classList.add('ep-done-state');
      btn.disabled = true;
      iconWrapper.innerHTML = `
        <svg viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
    } else if (state === 'error') {
      btn.classList.add('ep-error-state');
      btn.disabled = true;
      iconWrapper.innerHTML = `
        <svg viewBox="0 0 24 24">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
    } else {
      btn.disabled = false;
      iconWrapper.innerHTML = originalIcons.get(btn.id);
    }
  };

  // Drag
  let x1=0,x2=0,x3=0,x4=0;
  drag.onmousedown = e => {
    if (e.target.closest('button')) return;
    e.preventDefault();
    x3=e.clientX; x4=e.clientY;
    document.onmouseup = () => { document.onmouseup=null; document.onmousemove=null; };
    document.onmousemove = e => {
      e.preventDefault();
      x1=x3-e.clientX; x2=x4-e.clientY;
      x3=e.clientX; x4=e.clientY;
      let t=hub.offsetTop-x2, l=hub.offsetLeft-x1;
      if(t<0)t=0; if(l<0)l=0;
      if(l>window.innerWidth-80)l=window.innerWidth-80;
      if(t>window.innerHeight-40)t=window.innerHeight-40;
      hub.style.top=t+'px'; hub.style.left=l+'px';
    };
  };

  // Minimise
  let minimised = false;
  minBtn.addEventListener('click', () => {
    minimised = !minimised;
    if (minimised) {
      hub.classList.add('ep-min');
      minBtn.innerHTML = '&#43;';
    } else {
      hub.classList.remove('ep-min');
      minBtn.innerHTML = '&#8212;';
    }
  });

  closeBtn.addEventListener('click', () => {
    hub.remove();
    style.remove();
  });

  // Complete Task
  async function runCompleteTask() {
    setBtnState(completeBtn, 'running');
    statusEl.textContent = 'Running';
    statusEl.style.color = '#fbbf24';
    statusEl.classList.add('ep-status-visible');

    const delay = ms => new Promise(r => setTimeout(r, ms));

    const randomLongId = () => Math.floor(Math.random() * 9e14) + 1e14;

    const getModuleId = () => {
      const parts = location.pathname.split('/');
      return Number(parts[3]) || null;
    };

    const storeUsage = async sessionId => {
      const moduleId = getModuleId();
      await delay(250);
      const res = await fetch(
        'https://services.educationperfect.com/json.rpc?target=nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.StoreActivityUsageData3',
        {
          method: 'POST',
          credentials: 'include',
          referrer: 'https://app.educationperfect.com/',
          headers: {
            accept: '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'cache-control': 'no-cache',
            'content-type': 'application/json; charset=UTF-8',
            pragma: 'no-cache',
            priority: 'u=1, i',
            'sec-ch-ua': '"Chromium";v="146", "Not-A.Brand";v="24", "Opera GX";v="130"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site'
          },
          body: JSON.stringify({
            id: Date.now(),
            method: 'nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.StoreActivityUsageData3',
            params: [
              Number(sessionId),
              [], [],
              1,
              {
                CompletionDatetime: new Date().toISOString(),
                BaseLanguage: 6,
                ClassID: 2207962,
                ModuleID: moduleId,
                SchoolID: 5026,
                TaskID: null,
                TargetSubject: 32,
                UserID: 4769154
              },
              randomLongId()
            ]
          })
        }
      );
      console.log('StoreActivityUsageData3:', await res.json());
    };

    try {
      const sessionRes = await fetch('https://services.educationperfect.com/legacy/session', {
        method: 'POST',
        credentials: 'include',
        referrer: 'https://app.educationperfect.com/',
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.9,en-AU;q=0.8',
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          'ep-require-preflight': '1',
          pragma: 'no-cache',
          priority: 'u=1, i',
          'sec-ch-ua': '"Microsoft Edge";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site'
        },
        body: '{"ApplicationId":"EducationPerfectPro","LtiLaunchEventId":null}',
        mode: 'cors'
      });

      const sessionData = await sessionRes.json();
      const SESSION_ID = sessionData.SessionId;

      if (!SESSION_ID) {
        console.error('Session failed:', sessionData);
        throw new Error('Session retrieval failed');
      }

      const url = window.location.href;
      const activityMatch = url.match(/app\/[^/]+\/\d+\/(\d+)/);
      const taskMatch = url.match(/task=(\d+)/);
      const ActivityID = activityMatch ? Number(activityMatch[1]) : null;
      const TaskID = taskMatch ? Number(taskMatch[1]) : null;

      const res = await fetch(
        'https://services.educationperfect.com/json.rpc?target=nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.GetStructuredActivityAndAttempts2',
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            id: 1,
            method: 'nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.GetStructuredActivityAndAttempts2',
            params: [SESSION_ID, { ActivityID, TaskID: TaskID || null }]
          })
        }
      );

      const data = await res.json();

      if (!data.result || !data.result.Activity) {
        console.error('Invalid activity:', data);
        throw new Error('Invalid activity payload');
      }

      const structure = data.result.Activity.Structure.Children;
      const AttemptID = data.result.Attempts[0].ID;

      let seq = 0;
      const answers = [];

      for (const section of structure) {
        for (const contentID of (section.ContentIDs || [])) {
          answers.push({
            AttemptID,
            ContentID: contentID,
            Section: section.ID,
            ContentVersion: 0,
            TimeTaken: 5,
            DateLastUpdated: new Date().toISOString(),
            QuestionAttemptNumber: 1,
            UsersAnswer: '{"UserAnswer":{},"UserAnswerForMarkings":{}}',
            Attempted: true,
            TranslationDirection: 5,
            QuestionState: '{"Variable":{},"Component":{}}',
            DateStarted: new Date().toISOString(),
            MostRecentAnswer: true,
            Finalised: true,
            Grade: 1,
            ScoreFraction: 1,
            TimeTakenForReview: 0,
            SequenceNumber: seq++,
            AnswerQualityTags: []
          });
        }
      }

      const res2 = await fetch(
        'https://services.educationperfect.com/json.rpc?target=nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.SaveFinalActivityAttemptAnswers',
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            id: 2,
            method: 'nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.SaveFinalActivityAttemptAnswers',
            params: [SESSION_ID, answers]
          })
        }
      );
      console.log('SaveFinalActivityAttemptAnswers:', await res2.json());

      await fetch(
        'https://services.educationperfect.com/json.rpc?target=nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.SubmitSmartLessonFeedback',
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            id: Date.now(),
            method: 'nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.SubmitSmartLessonFeedback',
            params: [SESSION_ID, ActivityID, AttemptID, true, 5, 5, '']
          })
        }
      );

      await storeUsage(SESSION_ID);

      // Transition button to Green success
      setBtnState(completeBtn, 'done');
      showDone();

      setTimeout(() => {
        const exitBtn =
          document.querySelector('.nav-bar-exit') ||
          document.querySelector('[ep-walkthrough-item="save-and-exit"]') ||
          document.querySelector('[ng-click="self.onExit()"]') ||
          Array.from(document.querySelectorAll('button')).find(
            el => el.textContent.toLowerCase().includes('exit') || el.getAttribute('ng-click') === 'self.onExit()'
          );

        if (exitBtn) exitBtn.click();
        else console.warn('Exit button not found — exit manually.');

        // Revert button color back to idle after a delay
        setTimeout(() => {
          setBtnState(completeBtn, 'idle');
        }, 1200);
      }, 1000);

    } catch (e) {
      console.error('EP Hub error:', e);
      setBtnState(completeBtn, 'error');
      const isInvalidTask = e && e.toString().toLowerCase().includes('invalid activity');
      showError(isInvalidTask ? 'Invalid task' : 'Error');
      setTimeout(() => {
        setBtnState(completeBtn, 'idle');
      }, 1000);
    }
  }

  // Give Cheers Action
  async function runGiveCheers() {
    const randomLongId = () => Math.floor(Math.random() * 9e14) + 1e14;
    const getModuleIdFromUrl = () => Number(location.pathname.split("/")[3]) || null;
    const ORG_ID = "574bd3b6-f02c-4c01-ac34-9c5428cd3a7d";

    const studentId = localStorage.getItem('ep_hub_verified_id') || "";
    if (!studentId) {
      alert("Error: Verification ID not found. Re-run bookmarklet to login.");
      return;
    }

    setBtnState(cheersBtn, 'running');
    statusEl.textContent = 'Checking';
    statusEl.style.color = '#fbbf24';
    statusEl.classList.add('ep-status-visible');

    let limits;
    try {
      limits = await fetchSupabaseLimits(studentId);
    } catch (err) {
      console.error(err);
      setBtnState(cheersBtn, 'error');
      showError(err.message || "Failed limits check");
      setTimeout(() => setBtnState(cheersBtn, 'idle'), 2500);
      return;
    }

    setBtnState(cheersBtn, 'idle');
    statusEl.classList.remove('ep-status-visible');

    const userInput = prompt("How many credits would you like? (Daily pool remaining: " + limits.cheers_pool_remaining + ")");
    if (!userInput) return;

    let targetCredits = 0;
    let isDevMode = false;
    
    const trimmedInput = userInput.trim();
    if (trimmedInput.toLowerCase().endsWith("-dev")) {
      isDevMode = true;
      const parts = trimmedInput.split(/\s+/);
      targetCredits = Number(parts[0]);
    } else {
      targetCredits = Number(trimmedInput);
    }
    
    if (isNaN(targetCredits) || targetCredits < 1 || !Number.isInteger(targetCredits)) {
      alert("Please enter a whole number only.");
      return;
    }
    
    if (targetCredits > 500 && !isDevMode) {
      alert("Limit is 500 credits.");
      return;
    }
    
    if (targetCredits > limits.cheers_pool_remaining && !isDevMode) {
      alert("Error: You only have " + limits.cheers_pool_remaining + " credits remaining in your daily pool.");
      return;
    }

    setBtnState(cheersBtn, 'running');
    statusEl.textContent = 'Running';
    statusEl.style.color = '#fbbf24';
    statusEl.classList.add('ep-status-visible');

    try {
      limits.cheers_pool_remaining -= targetCredits;
      limits.last_used_cheers = new Date().toISOString();
      await updateSupabaseLimits(studentId, {
        cheers_pool_remaining: limits.cheers_pool_remaining,
        last_used_cheers: limits.last_used_cheers
      });
    } catch (err) {
      console.error(err);
      setBtnState(cheersBtn, 'error');
      showError(err.message || "Failed limits check");
      setTimeout(() => setBtnState(cheersBtn, 'idle'), 2500);
      return;
    }

    const runsNeeded = Math.ceil(targetCredits / 10);
    const earnedCredits = runsNeeded * 10;
    const excessToSpend = earnedCredits - targetCredits;

    const url = window.location.href;
    const activityMatch = url.match(/app\/[^/]+\/\d+\/(\d+)/);
    const taskMatch = url.match(/task=(\d+)/);
    
    const ActivityID = activityMatch ? Number(activityMatch[1]) : 7560889;
    const TaskID = taskMatch ? Number(taskMatch[1]) : null;
    const moduleId = getModuleIdFromUrl() || 7596107;

    const executeSingleRun = async (runIndex) => {
      try {
        // 1. Fetch Session
        const sessionRes = await fetch("https://services.educationperfect.com/legacy/session", {
          headers: { "content-type": "application/json", "ep-require-preflight": "1" },
          body: JSON.stringify({ ApplicationId: "EducationPerfectPro", LtiLaunchEventId: null }),
          method: "POST",
          credentials: "include"
        });
        const { SessionId: SESSION_ID } = await sessionRes.json();
        if (!SESSION_ID) return false;

        // 2. Fetch Activity Metadata
        const res = await fetch("https://services.educationperfect.com/json.rpc?target=nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.GetStructuredActivityAndAttempts2", {
          method: "POST",
          headers: { "content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            id: 1,
            method: "nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.GetStructuredActivityAndAttempts2",
            params: [SESSION_ID, { ActivityID, TaskID: TaskID || null }]
          })
        });
        const data = await res.json();
        if (!data.result || !data.result.Activity) return false;

        const structure = data.result.Activity.Structure.Children || [];
        const AttemptID = data.result.Attempts?.[0]?.ID;
        
        const userData = {
          ClassID: data.result.Activity.ClassID,
          SchoolID: data.result.Activity.SchoolID,
          UserID: data.result.Activity.UserID
        };

        // 3. Build Answers
        const answers = [];
        let seq = 0;
        structure.forEach(section => {
          if (section.Children) {
            section.Children.forEach(question => {
              answers.push({
                Identity: question.Identity || seq++,
                AnswerValue: question.CorrectAnswer || "1",
                IsCorrect: true,
                TimeTaken: 0
              });
            });
          }
        });

        // 4. Finalize
        const requests = [
          fetch("https://services.educationperfect.com/json.rpc?target=nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.SaveFinalActivityAttemptAnswers", {
            method: "POST",
            headers: { "content-type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ id: 2, method: "nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.SaveFinalActivityAttemptAnswers", params: [SESSION_ID, answers] })
          }),
          fetch("https://services.educationperfect.com/json.rpc?target=nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.StoreActivityUsageData3", {
            method: "POST",
            credentials: "include",
            headers: { "content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
              id: Date.now(),
              method: "nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.StoreActivityUsageData3",
              params: [
                Number(SESSION_ID), [], [], 1,
                { CompletionDatetime: new Date().toISOString(), BaseLanguage: 6, ClassID: userData.ClassID || 0, ModuleID: moduleId, SchoolID: userData.SchoolID || 0, TaskID: TaskID || null, TargetSubject: 32, UserID: userData.UserID || 0 },
                randomLongId()
              ]
            })
          })
        ];

        if (AttemptID) {
          requests.push(
            fetch("https://services.educationperfect.com/json.rpc?target=nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.SubmitSmartLessonFeedback", {
              method: "POST",
              credentials: "include",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ id: Date.now(), method: "nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.SubmitSmartLessonFeedback", params: [SESSION_ID, ActivityID, AttemptID, true, 5, 5, ""] })
            })
          );
        }

        await Promise.all(requests);
        return true;
      } catch (e) {
        return false;
      }
    };

    // Tight parallel batching with micro-delays to survive server rate-limiting
    const BATCH_SIZE = 4; 
    let successCount = 0;

    try {
      for (let i = 0; i < runsNeeded; i += BATCH_SIZE) {
        const batch = Array.from({ length: Math.min(BATCH_SIZE, runsNeeded - i) }, async (_, index) => {
          const currentRun = i + index;
          await new Promise(r => setTimeout(r, index * 30));
          const success = await executeSingleRun(currentRun);
          if (success) successCount++;
        });

        console.log(`Processing batch starting at run ${i + 1}...`);
        await Promise.all(batch);
        await new Promise(r => setTimeout(r, 100));
      }

      console.log(`Earning phase done. Earned approx ${successCount * 10} credits.`);

      if (excessToSpend > 0 && successCount > 0) {
        statusEl.textContent = 'Deducting';
        console.log(`Deducting ${excessToSpend} excess credits...`);

        // Fetch leaderboard to resolve Zeke G and I Gede D IDs
        const leaderboardRes = await fetch("https://graphql-gateway.educationperfect.com/graphql/", {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            operationName: "Leaderboard",
            query: `
              query Leaderboard($organisationId: UUID!, $groupingType: ScoreboardGroupingType!, $timeFrame: ScoreboardTimeFrame!, $startRank: Int, $rowsAbove: Int, $rowsBelow: Int) {
                globalScoreboards {
                  scoreboardScores(parameters: {
                    organisationId: $organisationId,
                    groupingType: $groupingType,
                    timeFrame: $timeFrame,
                    startRank: $startRank,
                    rowsAbove: $rowsAbove,
                    rowsBelow: $rowsBelow
                  }) {
                    stats {
                      userPublicId
                      name
                    }
                  }
                }
              }
            `,
            variables: {
              organisationId: ORG_ID,
              groupingType: "SCHOOL",
              timeFrame: "YEARLY",
              startRank: 0,
              rowsAbove: 0,
              rowsBelow: 9999
            }
          })
        });

        const leaderboardData = await leaderboardRes.json();
        const stats = leaderboardData?.data?.globalScoreboards?.scoreboardScores?.stats || [];

        const findUser = (nameStr) => {
          return stats.find(s => {
            const normalizedS = s.name.trim().toLowerCase();
            const normalizedTarget = nameStr.trim().toLowerCase();
            return normalizedS === normalizedTarget || normalizedS.includes(normalizedTarget);
          });
        };

        const zekeUser = findUser("Zeke G");
        const igedeUser = findUser("I Gede D");

        if (zekeUser && igedeUser) {
          const zekeId = zekeUser.userPublicId;
          const igedeId = igedeUser.userPublicId;

          // Fetch stickers
          const stickersRes = await fetch("https://graphql-gateway.educationperfect.com/graphql/", {
            method: "POST",
            credentials: "include",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              operationName: "CheersDialogData",
              query: `
                query CheersDialogData($organisationId: UUID!) {
                  incentivesPortfolio(organisationId: $organisationId) {
                    stickers {
                      available {
                        id
                        name
                        isLocked
                      }
                    }
                  }
                }
              `,
              variables: { organisationId: ORG_ID }
            })
          });

          const stickersData = await stickersRes.json();
          const availableStickers = stickersData?.data?.incentivesPortfolio?.stickers?.available || [];

          const findStickerByGroup = (namesArray) => {
            for (const name of namesArray) {
              const match = availableStickers.find(s => s.name.toLowerCase() === name.toLowerCase() && !s.isLocked);
              if (match) return match;
            }
            return null;
          };

          const sticker5cr = findStickerByGroup(["smile", "thumbs up!", "perfect!"]);
          const sticker1cr = findStickerByGroup(["megaphone"]);

          // Build optimal spend plan
          const spendPlan = [];
          let tempExcess = excessToSpend;

          if (tempExcess >= 5 && sticker5cr) {
            spendPlan.push(sticker5cr);
            tempExcess -= 5;
          }
          while (tempExcess >= 1 && sticker1cr) {
            spendPlan.push(sticker1cr);
            tempExcess -= 1;
          }

          // Execute spend plan
          for (const sticker of spendPlan) {
            await sendCheerWithAutoFallback(sticker.id, zekeId, igedeId);
          }
        } else {
          console.warn("Zeke G or I Gede D not found in leaderboard scores.");
        }
      }

      setBtnState(cheersBtn, 'done');
      showDone();
      
      setTimeout(() => {
        setBtnState(cheersBtn, 'idle');
      }, 1200);

    } catch (e) {
      console.error(e);
      setBtnState(cheersBtn, 'error');
      showError();
      setTimeout(() => setBtnState(cheersBtn, 'idle'), 1000);
    }
  }

  // Helper function to send fallback cheers
  async function sendCheerWithAutoFallback(stickerId, zekeId, igedeId) {
    const ORG_ID = "574bd3b6-f02c-4c01-ac34-9c5428cd3a7d";
    const query = `
      mutation SendCheers($input: SendCheersInput!) {
        sendCheers(sendCheersInput: $input) {
          isSuccess
          errors
        }
      }
    `;

    // Try sending to Zeke G first
    let recipientId = zekeId;
    let cheerId = crypto.randomUUID();
    let res = await fetch("https://graphql-gateway.educationperfect.com/graphql/", {
      method: "POST",
      credentials: "include",
      headers: {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "pragma": "no-cache",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Chromium\";v=\"152\", \"Not?A_Brand\";v=\"24\", \"Google Chrome\";v=\"152\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site"
      },
      referrer: "https://app.educationperfect.com/",
      body: JSON.stringify({
        operationName: "SendCheers",
        query,
        variables: {
          input: {
            cheersId: cheerId,
            organisationId: ORG_ID,
            recipientIds: [recipientId],
            stickerId: stickerId
          }
        }
      })
    });

    let result = await res.json();
    console.log("SendCheer Zeke G response:", result);

    const isSuccess = result?.data?.sendCheers?.isSuccess;
    const errors = result?.data?.sendCheers?.errors || [];

    if (!isSuccess && errors.some(err => err.toLowerCase().includes("self"))) {
      console.log("Cannot send cheer to self. Redirecting to I Gede D...");
      recipientId = igedeId;
      cheerId = crypto.randomUUID();
      
      res = await fetch("https://graphql-gateway.educationperfect.com/graphql/", {
        method: "POST",
        credentials: "include",
        headers: {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "no-cache",
          "content-type": "application/json",
          "pragma": "no-cache",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Chromium\";v=\"152\", \"Not?A_Brand\";v=\"24\", \"Google Chrome\";v=\"152\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site"
        },
        referrer: "https://app.educationperfect.com/",
        body: JSON.stringify({
          operationName: "SendCheers",
          query,
          variables: {
            input: {
              cheersId: cheerId,
              organisationId: ORG_ID,
              recipientIds: [recipientId],
              stickerId: stickerId
            }
          }
        })
      });
      result = await res.json();
      console.log("SendCheer I Gede D response:", result);
    }
  }

  // Timer Actions
  async function toggleInstantFailure() {
    const isToggled = instantFailureBtn.classList.toggle('ep-toggled');
    isInstantFailureActive = isToggled;
    restorePerformanceNow();
    if (isToggled) {
      statusEl.textContent = 'Instant Fail On';
      statusEl.style.color = '#22c55e';
    } else {
      statusEl.textContent = 'Instant Fail Off';
      statusEl.style.color = '#cbd5e1';
    }
    statusEl.classList.add('ep-status-visible');
    setTimeout(() => statusEl.classList.remove('ep-status-visible'), 1200);
  }

  async function runAdjustTime() {
    setBtnState(adjustTimeBtn, 'running');
    statusEl.textContent = 'Running';
    statusEl.style.color = '#fbbf24';
    statusEl.classList.add('ep-status-visible');
    
    try {
      const action = prompt("Add or Remove?:");
      if (!action) {
        setBtnState(adjustTimeBtn, 'idle');
        statusEl.classList.remove('ep-status-visible');
        return;
      }

      const seconds = parseFloat(prompt("How many seconds?"));
      if (isNaN(seconds)) {
        setBtnState(adjustTimeBtn, 'idle');
        statusEl.classList.remove('ep-status-visible');
        return;
      }

      const ms = seconds * 1000;

      startTimeLoop();
      restorePerformanceNow();

      if (action.toLowerCase().startsWith("a")) {
        timeTargetOffset -= ms; // add time
      } else if (action.toLowerCase().startsWith("r")) {
        timeTargetOffset += ms; // remove time
      }

      setBtnState(adjustTimeBtn, 'done');
      showDone();
      setTimeout(() => setBtnState(adjustTimeBtn, 'idle'), 1200);
    } catch (e) {
      setBtnState(adjustTimeBtn, 'error');
      showError();
      setTimeout(() => setBtnState(adjustTimeBtn, 'idle'), 1000);
    }
  }

  async function runRemoveTimer() {
    setBtnState(removeTimerBtn, 'running');
    statusEl.textContent = 'Running';
    statusEl.style.color = '#fbbf24';
    statusEl.classList.add('ep-status-visible');
    
    try {
      performance.now = () => originalPerformanceNow() / -0;
      
      const exitBtn = document.querySelector('.nav-bar-exit');
      if (exitBtn) {
        exitBtn.click();
      }
      
      setBtnState(removeTimerBtn, 'done');
      showDone();
      setTimeout(() => setBtnState(removeTimerBtn, 'idle'), 1200);
    } catch (e) {
      setBtnState(removeTimerBtn, 'error');
      showError();
      setTimeout(() => setBtnState(removeTimerBtn, 'idle'), 1000);
    }
  }

  async function toggleReverseTimer() {
    const isToggled = reverseTimerBtn.classList.toggle('ep-toggled');
    isReverseTimerActive = isToggled;
    restorePerformanceNow();
    if (isToggled) {
      statusEl.textContent = 'Reverse Timer On';
      statusEl.style.color = '#22c55e';
    } else {
      statusEl.textContent = 'Reverse Timer Off';
      statusEl.style.color = '#cbd5e1';
    }
    statusEl.classList.add('ep-status-visible');
    setTimeout(() => statusEl.classList.remove('ep-status-visible'), 1200);
  }

  // Set Credits Action
  async function runSetCredits() {
    const ORG_ID = "574bd3b6-f02c-4c01-ac34-9c5428cd3a7d";

    const studentId = localStorage.getItem('ep_hub_verified_id') || "";
    if (!studentId) {
      alert("Error: Verification ID not found. Re-run bookmarklet to login.");
      return;
    }

    setBtnState(setCreditsBtn, 'running');
    statusEl.textContent = 'Checking';
    statusEl.style.color = '#fbbf24';
    statusEl.classList.add('ep-status-visible');

    let limits;
    try {
      limits = await fetchSupabaseLimits(studentId);
      
      const now = new Date();
      const hours48 = 48 * 60 * 60 * 1000;
      const lastUsedSet = limits.last_used_set ? new Date(limits.last_used_set) : null;

      if (lastUsedSet && (now - lastUsedSet < hours48)) {
        const remainingMs = hours48 - (now - lastUsedSet);
        const hoursLeft = (remainingMs / (60 * 60 * 1000)).toFixed(1);
        throw new Error(`Set Credits is on cooldown. You can only use it once every 2 days. Wait ${hoursLeft}h.`);
      }

    } catch (err) {
      console.error(err);
      setBtnState(setCreditsBtn, 'error');
      showError(err.message || "Failed limits check");
      setTimeout(() => setBtnState(setCreditsBtn, 'idle'), 2500);
      return;
    }

    setBtnState(setCreditsBtn, 'running');
    statusEl.textContent = 'Querying';
    statusEl.style.color = '#fbbf24';
    statusEl.classList.add('ep-status-visible');

    try {
      // 1. Fetch current credits
      const initialRes = await fetch("https://graphql-gateway.educationperfect.com/graphql/", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          operationName: "CheersDialogData",
          query: `
            query CheersDialogData($organisationId: UUID!) {
              incentivesPortfolio(organisationId: $organisationId) {
                credits {
                  totalCredits
                }
                stickers {
                  available {
                    id
                    name
                    cost
                    isLocked
                  }
                }
              }
            }
          `,
          variables: { organisationId: ORG_ID }
        })
      });
      const initialData = await initialRes.json();
      const currentCredits = initialData?.data?.incentivesPortfolio?.credits?.totalCredits;
      const availableStickers = initialData?.data?.incentivesPortfolio?.stickers?.available || [];
      
      if (currentCredits === undefined) {
        throw new Error("Could not retrieve current credits.");
      }

      setBtnState(setCreditsBtn, 'idle');
      statusEl.classList.remove('ep-status-visible');

      const userInput = prompt(`Current credits: ${currentCredits}\n\nEnter target credits to set: (Limit 1000)`, "1000");
      if (!userInput) return;

      let targetCredits = 0;
      let isDevMode = false;
      
      const trimmedInput = userInput.trim();
      if (trimmedInput.toLowerCase().endsWith("-dev")) {
        isDevMode = true;
        const parts = trimmedInput.split(/\s+/);
        targetCredits = Number(parts[0]);
      } else {
        targetCredits = Number(trimmedInput);
      }
      
      if (isNaN(targetCredits) || targetCredits < 0 || !Number.isInteger(targetCredits)) {
        alert("Please enter a whole number only.");
        return;
      }
      
      if (targetCredits > 1000 && !isDevMode) {
        alert("Limit is 1000 credits.");
        return;
      }

      setBtnState(setCreditsBtn, 'running');
      statusEl.textContent = 'Running';
      statusEl.style.color = '#fbbf24';
      statusEl.classList.add('ep-status-visible');

      try {
        await updateSupabaseLimits(studentId, {
          last_used_set: new Date().toISOString()
        });
      } catch (err) {
        console.error(err);
        setBtnState(setCreditsBtn, 'error');
        showError(err.message || "Failed limits check");
        setTimeout(() => setBtnState(setCreditsBtn, 'idle'), 2500);
        return;
      }

      const diff = targetCredits - currentCredits;

      if (diff === 0) {
        setBtnState(setCreditsBtn, 'done');
        showDone();
        setTimeout(() => {
          setBtnState(setCreditsBtn, 'idle');
        }, 1200);
        return;
      }

      // Resolve leaderboard IDs if we need to spend credits
      let zekeId = null, igedeId = null;
      const resolveRecipients = async () => {
        const leaderboardRes = await fetch("https://graphql-gateway.educationperfect.com/graphql/", {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            operationName: "Leaderboard",
            query: `
              query Leaderboard($organisationId: UUID!, $groupingType: ScoreboardGroupingType!, $timeFrame: ScoreboardTimeFrame!, $startRank: Int, $rowsAbove: Int, $rowsBelow: Int) {
                globalScoreboards {
                  scoreboardScores(parameters: {
                    organisationId: $organisationId,
                    groupingType: $groupingType,
                    timeFrame: $timeFrame,
                    startRank: $startRank,
                    rowsAbove: $rowsAbove,
                    rowsBelow: $rowsBelow
                  }) {
                    stats {
                      userPublicId
                      name
                    }
                  }
                }
              }
            `,
            variables: {
              organisationId: ORG_ID,
              groupingType: "SCHOOL",
              timeFrame: "YEARLY",
              startRank: 0,
              rowsAbove: 0,
              rowsBelow: 9999
            }
          })
        });

        const leaderboardData = await leaderboardRes.json();
        const stats = leaderboardData?.data?.globalScoreboards?.scoreboardScores?.stats || [];

        const findUser = (nameStr) => {
          return stats.find(s => {
            const normalizedS = s.name.trim().toLowerCase();
            const normalizedTarget = nameStr.trim().toLowerCase();
            return normalizedS === normalizedTarget || normalizedS.includes(normalizedTarget);
          });
        };

        const zekeUser = findUser("Zeke G");
        const igedeUser = findUser("I Gede D");
        
        if (zekeUser && igedeUser) {
          zekeId = zekeUser.userPublicId;
          igedeId = igedeUser.userPublicId;
          return true;
        }
        return false;
      };

      if (diff > 0) {
        // --- ADDING CREDITS ---
        const runsNeeded = Math.ceil(diff / 10);
        const earned = runsNeeded * 10;
        const excess = earned - diff;

        const randomLongId = () => Math.floor(Math.random() * 9e14) + 1e14;
        const getModuleId = () => Number(location.pathname.split("/")[3]) || null;
        
        const url = window.location.href;
        const activityMatch = url.match(/app\/[^/]+\/\d+\/(\d+)/);
        const taskMatch = url.match(/task=(\d+)/);
        
        const ActivityID = activityMatch ? Number(activityMatch[1]) : 7560889;
        const TaskID = taskMatch ? Number(taskMatch[1]) : null;
        const moduleId = getModuleId() || 7596107;

        const executeSingleRun = async () => {
          try {
            const sessionRes = await fetch("https://services.educationperfect.com/legacy/session", {
              headers: { "content-type": "application/json", "ep-require-preflight": "1" },
              body: JSON.stringify({ ApplicationId: "EducationPerfectPro", LtiLaunchEventId: null }),
              method: "POST",
              credentials: "include"
            });
            const { SessionId: SESSION_ID } = await sessionRes.json();
            if (!SESSION_ID) return false;

            const res = await fetch("https://services.educationperfect.com/json.rpc?target=nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.GetStructuredActivityAndAttempts2", {
              method: "POST",
              headers: { "content-type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                id: 1,
                method: "nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.GetStructuredActivityAndAttempts2",
                params: [SESSION_ID, { ActivityID, TaskID: TaskID || null }]
              })
            });
            const data = await res.json();
            if (!data.result || !data.result.Activity) return false;

            const structure = data.result.Activity.Structure.Children || [];
            const AttemptID = data.result.Attempts?.[0]?.ID;
            
            const userData = {
              ClassID: data.result.Activity.ClassID,
              SchoolID: data.result.Activity.SchoolID,
              UserID: data.result.Activity.UserID
            };

            const answers = [];
            let seq = 0;
            structure.forEach(section => {
              if (section.Children) {
                section.Children.forEach(question => {
                  answers.push({
                    Identity: question.Identity || seq++,
                    AnswerValue: question.CorrectAnswer || "1",
                    IsCorrect: true,
                    TimeTaken: 0
                  });
                });
              }
            });

            const requests = [
              fetch("https://services.educationperfect.com/json.rpc?target=nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.SaveFinalActivityAttemptAnswers", {
                method: "POST",
                headers: { "content-type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ id: 2, method: "nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.SaveFinalActivityAttemptAnswers", params: [SESSION_ID, answers] })
              }),
              fetch("https://services.educationperfect.com/json.rpc?target=nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.StoreActivityUsageData3", {
                method: "POST",
                credentials: "include",
                headers: { "content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                  id: Date.now(),
                  method: "nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.StoreActivityUsageData3",
                  params: [
                    Number(SESSION_ID), [], [], 1,
                    { CompletionDatetime: new Date().toISOString(), BaseLanguage: 6, ClassID: userData.ClassID || 0, ModuleID: moduleId, SchoolID: userData.SchoolID || 0, TaskID: TaskID || null, TargetSubject: 32, UserID: userData.UserID || 0 },
                    randomLongId()
                  ]
                })
              })
            ];

            if (AttemptID) {
              requests.push(
                fetch("https://services.educationperfect.com/json.rpc?target=nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.SubmitSmartLessonFeedback", {
                  method: "POST",
                  credentials: "include",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ id: Date.now(), method: "nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.SubmitSmartLessonFeedback", params: [SESSION_ID, ActivityID, AttemptID, true, 5, 5, ""] })
                })
              );
            }

            await Promise.all(requests);
            return true;
          } catch (e) {
            return false;
          }
        };

        const BATCH_SIZE = 4;
        let successCount = 0;
        for (let i = 0; i < runsNeeded; i += BATCH_SIZE) {
          const batch = Array.from({ length: Math.min(BATCH_SIZE, runsNeeded - i) }, async (_, index) => {
            await new Promise(r => setTimeout(r, index * 30));
            const success = await executeSingleRun();
            if (success) successCount++;
          });
          await Promise.all(batch);
          await new Promise(r => setTimeout(r, 100));
        }

        // Deduct excess
        if (excess > 0 && successCount > 0) {
          statusEl.textContent = 'Deducting';
          const resolved = await resolveRecipients();
          if (resolved) {
            const findStickerByGroup = (namesArray) => {
              for (const name of namesArray) {
                const match = availableStickers.find(s => s.name.toLowerCase() === name.toLowerCase() && !s.isLocked);
                if (match) return match;
              }
              return null;
            };
            const sticker5cr = findStickerByGroup(["smile", "thumbs up!", "perfect!"]);
            const sticker1cr = findStickerByGroup(["megaphone"]);

            const spendPlan = [];
            let tempExcess = excess;
            if (tempExcess >= 5 && sticker5cr) {
              spendPlan.push(sticker5cr);
              tempExcess -= 5;
            }
            while (tempExcess >= 1 && sticker1cr) {
              spendPlan.push(sticker1cr);
              tempExcess -= 1;
            }

            for (const sticker of spendPlan) {
              await sendCheerWithAutoFallback(sticker.id, zekeId, igedeId);
            }
          }
        }
      } else {
        // --- SPENDING/DEDUCTING CREDITS ---
        const excessToSpend = -diff;
        statusEl.textContent = 'Deducting';
        
        const resolved = await resolveRecipients();
        if (resolved) {
          // Greedy coin-change style calculation using unlocked available stickers
          const spendPlan = [];
          let tempRemaining = excessToSpend;
          
          const sortedStickers = availableStickers
            .filter(s => !s.isLocked && s.cost > 0)
            .sort((a, b) => b.cost - a.cost);

          for (const sticker of sortedStickers) {
            while (tempRemaining >= sticker.cost) {
              spendPlan.push(sticker);
              tempRemaining -= sticker.cost;
            }
          }

          console.log(`Greedy spend plan: Deducting ${excessToSpend}cr with ${spendPlan.length} stickers.`);

          for (const sticker of spendPlan) {
            await sendCheerWithAutoFallback(sticker.id, zekeId, igedeId);
          }
        } else {
          throw new Error("Could not resolve Zeke G or I Gede D for credit deduction.");
        }
      }

      setBtnState(setCreditsBtn, 'done');
      showDone();
      
      setTimeout(() => {
        setBtnState(setCreditsBtn, 'idle');
      }, 1200);

    } catch (e) {
      console.error(e);
      setBtnState(setCreditsBtn, 'error');
      showError();
      setTimeout(() => setBtnState(setCreditsBtn, 'idle'), 1000);
    }
  }

  // Helper to open sticker selection panel
  async function openStickerSelector(recipientName, recipientId, onSuccess) {
    const ORG_ID = "574bd3b6-f02c-4c01-ac34-9c5428cd3a7d";
    try {
      // Fetch credits and available stickers
      const initialRes = await fetch("https://graphql-gateway.educationperfect.com/graphql/", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          operationName: "CheersDialogData",
          query: `
            query CheersDialogData($organisationId: UUID!) {
              incentivesPortfolio(organisationId: $organisationId) {
                credits {
                  totalCredits
                }
                stickers {
                  available {
                    id
                    name
                    emoji
                    cost
                    isLocked
                  }
                }
              }
            }
          `,
          variables: { organisationId: ORG_ID }
        })
      });
      const initialData = await initialRes.json();
      const currentCredits = initialData?.data?.incentivesPortfolio?.credits?.totalCredits || 0;
      const availableStickers = initialData?.data?.incentivesPortfolio?.stickers?.available || [];

      // Create the sticker selection modal overlay
      const overlay = document.createElement('div');
      overlay.className = 'ep-modal-overlay';
      overlay.id = 'ep-sticker-selector-modal';
      
      // Sort stickers by cost ascending (Megaphone first)
      const sortedStickers = availableStickers
        .filter(s => s.emoji)
        .sort((a, b) => a.cost - b.cost);

      overlay.innerHTML = `
        <div class="ep-modal-header">
          <span class="ep-modal-title">Cheer to ${recipientName}</span>
          <button class="ep-modal-close" id="ep-sticker-close">×</button>
        </div>
        <div style="font-size: 11.5px; color: #64748b; margin-bottom: 12px;">Your Credits: <span style="color: #fbbf24; font-weight: 700;">${currentCredits}cr</span></div>
        <div class="ep-sticker-grid">
          ${sortedStickers.map(sticker => {
            const unaffordable = sticker.cost > currentCredits;
            const locked = sticker.isLocked || unaffordable;
            return `
              <div class="ep-sticker-card ${locked ? 'ep-sticker-disabled' : ''}" data-id="${sticker.id}" data-cost="${sticker.cost}">
                <span class="ep-sticker-emoji">${sticker.emoji}</span>
                <span style="font-size: 11px; font-weight: 600; color: #cbd5e1; text-align: center; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${sticker.name}</span>
                <span class="ep-sticker-cost">${sticker.cost}cr</span>
                ${locked ? `<span class="ep-sticker-lock">🔒</span>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;

      hub.appendChild(overlay);

      overlay.querySelector('#ep-sticker-close').onclick = () => {
        overlay.remove();
      };

      // Bind cards clicks
      overlay.querySelectorAll('.ep-sticker-card').forEach(card => {
        card.onclick = async () => {
          if (card.classList.contains('ep-sticker-disabled')) return;
          const stickerId = Number(card.getAttribute('data-id'));
          
          card.style.pointerEvents = 'none';
          card.style.opacity = '0.5';

          try {
            const cheerId = crypto.randomUUID();
            const sendRes = await fetch("https://graphql-gateway.educationperfect.com/graphql/", {
              method: "POST",
              credentials: "include",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                operationName: "SendCheers",
                query: `
                  mutation SendCheers($input: SendCheersInput!) {
                    sendCheers(sendCheersInput: $input) {
                      isSuccess
                      errors
                    }
                  }
                `,
                variables: {
                  input: {
                    cheersId: cheerId,
                    organisationId: ORG_ID,
                    recipientIds: [recipientId],
                    stickerId: stickerId
                  }
                }
              })
            });

            const result = await sendRes.json();
            console.log("SendCheer response:", result);

            const isSuccess = result?.data?.sendCheers?.isSuccess;
            const errors = result?.data?.sendCheers?.errors || [];

            if (!isSuccess) {
              if (errors.some(err => err.toLowerCase().includes("self"))) {
                alert("Cannot send cheer to self!");
              } else {
                alert("Failed to send cheer: " + errors.join(", "));
              }
              card.style.pointerEvents = 'auto';
              card.style.opacity = '1';
              return;
            }

            overlay.remove();
            if (onSuccess) onSuccess();

          } catch (err) {
            console.error(err);
            alert("Error sending cheer.");
            card.style.pointerEvents = 'auto';
            card.style.opacity = '1';
          }
        };
      });
    } catch (err) {
      console.error(err);
      alert("Failed to open sticker selector.");
    }
  }

  // Check Cheers Action
  async function runCheckCheers() {
    setBtnState(checkCheersBtn, 'running');
    statusEl.textContent = 'Querying';
    statusEl.style.color = '#fbbf24';
    statusEl.classList.add('ep-status-visible');

    try {
      const ORG_ID = "574bd3b6-f02c-4c01-ac34-9c5428cd3a7d";
      const res = await fetch("https://graphql-gateway.educationperfect.com/graphql", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          operationName: "ReceivedCheers",
          query: `
            query ReceivedCheers($organisationId: UUID!) {
              incentivesPortfolio(organisationId: $organisationId) {
                cheers {
                  received {
                    isRepliedTo
                    id
                    message
                    lastUpdated
                    sender {
                      id
                      name {
                        first
                        last
                      }
                    }
                    senderType
                    isReply
                    sticker {
                      id
                      name
                      emoji
                      emojiCode
                      cost
                    }
                  }
                }
              }
            }
          `,
          variables: { organisationId: ORG_ID }
        })
      });

      const data = await res.json();
      const received = data?.data?.incentivesPortfolio?.cheers?.received || [];

      setBtnState(checkCheersBtn, 'idle');
      statusEl.classList.remove('ep-status-visible');

      if (received.length === 0) {
        const overlay = document.createElement('div');
        overlay.className = 'ep-modal-overlay';
        overlay.innerHTML = `
          <div class="ep-modal-header">
            <span class="ep-modal-title">Received Cheers</span>
            <button class="ep-modal-close" id="ep-no-cheers-close">×</button>
          </div>
          <div class="ep-empty-state" style="margin-top: 20px;">
            <div class="ep-empty-icon">🔔</div>
            <div class="ep-empty-title">Inbox Empty</div>
            <div class="ep-empty-desc">You have no received cheers.</div>
          </div>
        `;
        hub.appendChild(overlay);
        overlay.querySelector('#ep-no-cheers-close').onclick = () => overlay.remove();
        return;
      }

      const overlay = document.createElement('div');
      overlay.className = 'ep-modal-overlay';
      overlay.id = 'ep-received-cheers-modal';
      
      overlay.innerHTML = `
        <div class="ep-modal-header">
          <span class="ep-modal-title">Received Cheers (${received.length})</span>
          <div style="display: flex; gap: 12px; align-items: center;">
            <button class="ep-cheer-btn" id="ep-dismiss-all" style="padding: 4px 10px; font-size: 11px;">Dismiss All</button>
            <button class="ep-modal-close" id="ep-cheers-close">×</button>
          </div>
        </div>
        <div class="ep-cheers-list">
          ${received.map(cheer => {
            const senderName = `${cheer.sender.name.first} ${cheer.sender.name.last}`;
            return `
              <div class="ep-cheer-item" id="cheer-${cheer.id}">
                <div class="ep-cheer-info">
                  <div class="ep-cheer-emoji">${cheer.sticker.emoji || '👋'}</div>
                  <div class="ep-cheer-details">
                    <span class="ep-cheer-sender">${senderName}</span>
                    <span class="ep-cheer-meta">Sent a ${cheer.sticker.name} (${cheer.sticker.cost}cr)</span>
                  </div>
                </div>
                <div class="ep-cheer-actions">
                  <button class="ep-cheer-btn ep-cheer-dismiss" data-id="${cheer.id}">Dismiss</button>
                  <button class="ep-cheer-btn ep-cheer-primary ep-cheer-reply" data-id="${cheer.id}" data-sender-id="${cheer.sender.id}" data-sender-name="${senderName}">Cheer back</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;

      hub.appendChild(overlay);

      overlay.querySelector('#ep-cheers-close').onclick = () => overlay.remove();

      const dismissCheerLocally = (cheerId) => {
        const itemEl = overlay.querySelector(`#cheer-${cheerId}`);
        if (itemEl) {
          itemEl.classList.add('slide-out');
          setTimeout(() => {
            itemEl.remove();
            if (overlay.querySelectorAll('.ep-cheer-item').length === 0) {
              overlay.remove();
            }
          }, 450);
        }
      };

      overlay.querySelectorAll('.ep-cheer-dismiss').forEach(btn => {
        btn.onclick = async () => {
          const id = btn.getAttribute('data-id');
          btn.disabled = true;
          btn.style.opacity = '0.5';

          try {
            await fetch("https://graphql-gateway.educationperfect.com/graphql/", {
              method: "POST",
              credentials: "include",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                operationName: "ReadCheers",
                query: `
                  mutation ReadCheers($input: ReadCheersInput!) {
                    readCheers(readCheersInput: $input) {
                      errors
                      isSuccess
                    }
                  }
                `,
                variables: {
                  input: {
                    cheersIds: [id],
                    organisationId: ORG_ID
                  }
                }
              })
            });
            dismissCheerLocally(id);
          } catch (err) {
            console.error(err);
            btn.disabled = false;
            btn.style.opacity = '1';
          }
        };
      });

      overlay.querySelector('#ep-dismiss-all').onclick = async () => {
        const allIds = received.map(c => c.id);
        const dismissAllBtn = overlay.querySelector('#ep-dismiss-all');
        dismissAllBtn.disabled = true;
        dismissAllBtn.style.opacity = '0.5';

        try {
          await fetch("https://graphql-gateway.educationperfect.com/graphql/", {
            method: "POST",
            credentials: "include",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              operationName: "ReadCheers",
              query: `
                mutation ReadCheers($input: ReadCheersInput!) {
                  readCheers(readCheersInput: $input) {
                    errors
                    isSuccess
                  }
                }
              `,
              variables: {
                input: {
                  cheersIds: allIds,
                  organisationId: ORG_ID
                }
              }
            })
          });
          
          overlay.querySelectorAll('.ep-cheer-item').forEach(item => {
            item.classList.add('slide-out');
          });
          setTimeout(() => {
            overlay.remove();
          }, 450);
        } catch (err) {
          console.error(err);
          dismissAllBtn.disabled = false;
          dismissAllBtn.style.opacity = '1';
        }
      };

      overlay.querySelectorAll('.ep-cheer-reply').forEach(btn => {
        btn.onclick = () => {
          const id = btn.getAttribute('data-id');
          const senderId = btn.getAttribute('data-sender-id');
          const senderName = btn.getAttribute('data-sender-name');
          
          openStickerSelector(senderName, senderId, async () => {
            try {
              await fetch("https://graphql-gateway.educationperfect.com/graphql/", {
                method: "POST",
                credentials: "include",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                  operationName: "ReadCheers",
                  query: `
                    mutation ReadCheers($input: ReadCheersInput!) {
                      readCheers(readCheersInput: $input) {
                        errors
                        isSuccess
                      }
                    }
                  `,
                  variables: {
                    input: {
                      cheersIds: [id],
                      organisationId: ORG_ID
                    }
                  }
                })
              });
            } catch (e) {
              console.error("Auto dismiss reply cheer failed:", e);
            }
            dismissCheerLocally(id);
          });
        };
      });

    } catch (e) {
      console.error(e);
      setBtnState(checkCheersBtn, 'error');
      showError();
      setTimeout(() => setBtnState(checkCheersBtn, 'idle'), 1000);
    }
  }

  // Send Cheer Action
  async function runSendCheer() {
    const ORG_ID = "574bd3b6-f02c-4c01-ac34-9c5428cd3a7d";
    
    const userInput = prompt("Enter students first name and first letter of last");
    if (!userInput) return;

    setBtnState(sendCheerBtn, 'running');
    statusEl.textContent = 'Querying';
    statusEl.style.color = '#fbbf24';
    statusEl.classList.add('ep-status-visible');

    try {
      const getLegalLeaderboardName = (fullName) => {
        const parts = fullName.trim().split(/\s+/);
        if (parts.length < 2) return fullName;
        const first = parts.slice(0, parts.length - 1).join(" ");
        const lastInitial = parts[parts.length - 1][0];
        return `${first} ${lastInitial}`;
      };

      const legalName = getLegalLeaderboardName(userInput);

      const leaderboardRes = await fetch("https://graphql-gateway.educationperfect.com/graphql/", {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          "accept": "application/graphql-response+json, application/graphql+json, application/json, text/event-stream, multipart/mixed"
        },
        body: JSON.stringify({
          operationName: "Leaderboard",
          query: `query Leaderboard($organisationId: UUID!, $groupingType: ScoreboardGroupingType!, $timeFrame: ScoreboardTimeFrame!, $startRank: Int, $rowsAbove: Int, $rowsBelow: Int) {
            globalScoreboards {
              scoreboardScores(
                parameters: {organisationId: $organisationId, groupingType: $groupingType, timeFrame: $timeFrame, startRank: $startRank, rowsAbove: $rowsAbove, rowsBelow: $rowsBelow}
              ) {
                stats {
                  userPublicId
                  rank
                  name
                  school
                  country
                  online
                  userIDHash
                  avatarUrl
                  score
                  __typename
                }
                totalRows
                currentScore
                currentRanking
                overallScore
                success
                __typename
              }
              __typename
            }
          }`,
          variables: {
            groupingType: "SCHOOL",
            organisationId: ORG_ID,
            rowsAbove: 0,
            rowsBelow: 9999,
            startRank: 0,
            timeFrame: "YEARLY"
          }
        })
      });

      const leaderboardData = await leaderboardRes.json();
      const stats = leaderboardData?.data?.globalScoreboards?.scoreboardScores?.stats || [];

      const target = legalName.trim().toLowerCase();
      const matches = stats.filter(s => {
        const name = s.name.trim().toLowerCase();
        return name === target || name.includes(target);
      });

      if (matches.length === 0) {
        alert(`Student "${userInput}" (normalized to "${legalName}") not found on leaderboard.`);
        setBtnState(sendCheerBtn, 'idle');
        statusEl.classList.remove('ep-status-visible');
        return;
      }

      if (matches.length > 1) {
        alert("Multiple names found...choose the right one from the leaderboard");
      }

      function findRowByRank(rank) {
        const rows = document.querySelectorAll('tr[role="row"], tr');
        for (const row of rows) {
          const cells = row.querySelectorAll('td');
          if (cells.length > 0) {
            const rankText = cells[0].textContent.trim();
            if (rankText === String(rank)) {
              return row;
            }
          }
        }
        return null;
      }

      async function scrollToRank(rank) {
        const maxAttempts = 120;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          const row = findRowByRank(rank);
          if (row) {
            row.scrollIntoView({ block: 'center' });
            return row;
          }
          const showMoreBtn = Array.from(document.querySelectorAll('button')).find(
            btn => btn.textContent.trim().toLowerCase() === 'show-more' || 
                   btn.textContent.trim().toLowerCase() === 'show more'
          );
          if (!showMoreBtn) {
            await new Promise(r => setTimeout(r, 500));
            const recheckBtn = Array.from(document.querySelectorAll('button')).find(
              btn => btn.textContent.trim().toLowerCase() === 'show-more' || 
                     btn.textContent.trim().toLowerCase() === 'show more'
            );
            if (!recheckBtn) break;
            recheckBtn.click();
          } else {
            showMoreBtn.click();
          }
          await new Promise(r => setTimeout(r, 600));
        }
        return null;
      }

      function showConfirmPopup(name, rank, onYes, onNo) {
        const old = document.getElementById('ep-confirm-popup');
        if (old) old.remove();

        const popup = document.createElement('div');
        popup.id = 'ep-confirm-popup';
        popup.style.cssText = `
          position: fixed;
          top: 50%;
          right: 24px;
          transform: translateY(-50%);
          width: 280px;
          background: #0f172a;
          border: 2px solid #d4ff3a;
          border-radius: 12px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.8);
          padding: 24px;
          z-index: 9999999;
          font-family: system-ui, -apple-system, sans-serif;
          color: #f1f5f9;
          box-sizing: border-box;
          text-align: center;
        `;
        popup.innerHTML = `
          <div style="font-size: 16px; font-weight: 700; margin-bottom: 8px;">This them?</div>
          <div style="font-size: 14px; color: #94a3b8; margin-bottom: 20px; line-height: 1.4;">
            <span style="color: #d4ff3a; font-weight: 800; font-size: 15px;">${name}</span><br/>
            Rank #${rank}
          </div>
          <div style="display: flex; gap: 12px; justify-content: center;">
            <button id="ep-confirm-no" style="flex: 1; background: #334155; border: none; color: #f1f5f9; padding: 10px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">No</button>
            <button id="ep-confirm-yes" style="flex: 1; background: #d4ff3a; border: none; color: #0f172a; padding: 10px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Yes</button>
          </div>
        `;
        document.body.appendChild(popup);

        document.getElementById('ep-confirm-yes').onclick = () => {
          popup.remove();
          onYes();
        };
        document.getElementById('ep-confirm-no').onclick = () => {
          popup.remove();
          onNo();
        };
      }

      let matchIndex = 0;
      async function findAndConfirmNext() {
        if (matchIndex >= matches.length) {
          alert("No more matches found on the leaderboard.");
          setBtnState(sendCheerBtn, 'idle');
          statusEl.classList.remove('ep-status-visible');
          return;
        }

        const candidate = matches[matchIndex];
        
        setBtnState(sendCheerBtn, 'running');
        statusEl.textContent = `Finding #${candidate.rank}...`;
        statusEl.style.color = '#fbbf24';
        statusEl.classList.add('ep-status-visible');

        const row = await scrollToRank(candidate.rank);
        
        setBtnState(sendCheerBtn, 'idle');
        statusEl.classList.remove('ep-status-visible');

        if (!row) {
          alert(`Could not find row for Rank #${candidate.rank} on the page.`);
          matchIndex++;
          findAndConfirmNext();
          return;
        }

        row.style.outline = '3px solid #d4ff3a';
        row.style.outlineOffset = '-3px';

        showConfirmPopup(candidate.name, candidate.rank,
          () => {
            row.style.outline = '';
            openStickerSelector(candidate.name, candidate.userPublicId, () => {
              setBtnState(sendCheerBtn, 'done');
              showDone();
              setTimeout(() => setBtnState(sendCheerBtn, 'idle'), 1200);
            });
          },
          () => {
            row.style.outline = '';
            matchIndex++;
            findAndConfirmNext();
          }
        );
      }

      findAndConfirmNext();

    } catch (e) {
      console.error(e);
      setBtnState(sendCheerBtn, 'error');
      showError();
      setTimeout(() => setBtnState(sendCheerBtn, 'idle'), 1000);
    }
  }

  // Auto Continue Toggle Action
  let autoContinueInterval = null;
  function toggleAutoContinue() {
    const isToggled = autoContinueBtn.classList.toggle('ep-toggled');
    if (isToggled) {
      statusEl.textContent = 'Auto Continue On';
      statusEl.style.color = '#22c55e';
      statusEl.classList.add('ep-status-visible');
      setTimeout(() => statusEl.classList.remove('ep-status-visible'), 1200);

      autoContinueInterval = setInterval(() => {
        const isInfoSlide = document.querySelector('#content-container.information') !== null;
        if (isInfoSlide) {
          const btn = document.querySelector('.continue.arrow.action-bar-button button:not([disabled])');
          if (btn) {
            btn.scrollIntoView({ block: "center" });
            btn.click();
            console.log("✅ Auto Continue: clicked");
          }
        }
      }, 500);
    } else {
      statusEl.textContent = 'Auto Continue Off';
      statusEl.style.color = '#cbd5e1';
      statusEl.classList.add('ep-status-visible');
      setTimeout(() => statusEl.classList.remove('ep-status-visible'), 1200);

      if (autoContinueInterval) {
        clearInterval(autoContinueInterval);
        autoContinueInterval = null;
      }
    }
  }

  completeBtn.addEventListener('click', runCompleteTask);
  cheersBtn.addEventListener('click', runGiveCheers);
  setCreditsBtn.addEventListener('click', runSetCredits);
  checkCheersBtn.addEventListener('click', runCheckCheers);
  sendCheerBtn.addEventListener('click', runSendCheer);
  autoContinueBtn.addEventListener('click', toggleAutoContinue);
  instantFailureBtn.addEventListener('click', toggleInstantFailure);
  adjustTimeBtn.addEventListener('click', runAdjustTime);
  removeTimerBtn.addEventListener('click', runRemoveTimer);
  reverseTimerBtn.addEventListener('click', toggleReverseTimer);

  // --- Auth verification logic ---
  async function checkSupabaseAccess(id) {
    const sbUrl = 'https://inolfvjpiktmrhqyvnsh.supabase.co/rest/v1/verified_students?id=eq.' + encodeURIComponent(id);
    const sbKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlub2xmdmpwaWt0bXJocXl2bnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MjU5NDUsImV4cCI6MjEwMDUwMTk0NX0.gurNKy0vtMfVMW-To_2kyvMpQhEPpq7bKkJnyNN2qAc';
    const res = await fetch(sbUrl, {
      headers: {
        'apikey': sbKey,
        'Authorization': 'Bearer ' + sbKey
      }
    });
    if (!res.ok) throw new Error("Verification failed");
    const data = await res.json();
    return data && data.length > 0;
  }

  // Fetch or initialize limits from Supabase directly (bypassing proxy server)
  async function fetchSupabaseLimits(id) {
    const sbUrl = 'https://inolfvjpiktmrhqyvnsh.supabase.co/rest/v1/student_usage_limits?id=eq.' + encodeURIComponent(id);
    const sbKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlub2xmdmpwaWt0bXJocXl2bnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MjU5NDUsImV4cCI6MjEwMDUwMTk0NX0.gurNKy0vtMfVMW-To_2kyvMpQhEPpq7bKkJnyNN2qAc';
    const res = await fetch(sbUrl, {
      headers: {
        'apikey': sbKey,
        'Authorization': 'Bearer ' + sbKey
      }
    });
    if (!res.ok) throw new Error("Failed to fetch limits");
    const data = await res.json();
    
    let limits;
    if (!data || data.length === 0) {
      // Auto-create limits row if not found (fallback)
      const insertRes = await fetch('https://inolfvjpiktmrhqyvnsh.supabase.co/rest/v1/student_usage_limits', {
        method: 'POST',
        headers: {
          'apikey': sbKey,
          'Authorization': 'Bearer ' + sbKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          id: id,
          cheers_pool_remaining: 500,
          last_pool_reset: new Date().toISOString()
        })
      });
      if (!insertRes.ok) {
        throw new Error("Supabase returned error " + insertRes.status + " trying to create your limits profile. Please make sure your Supabase RLS policies are set up correctly.");
      }
      const insertData = await insertRes.json();
      limits = insertData[0];
    } else {
      limits = data[0];
    }
    
    // Handle daily pool reset logic locally
    const now = new Date();
    const lastReset = new Date(limits.last_pool_reset);
    const msSinceReset = now - lastReset;
    const hours24 = 24 * 60 * 60 * 1000;

    if (msSinceReset >= hours24) {
      limits.cheers_pool_remaining = 500;
      limits.last_pool_reset = now.toISOString();
      await updateSupabaseLimits(id, {
        cheers_pool_remaining: 500,
        last_pool_reset: now.toISOString()
      });
    }
    return limits;
  }

  // Update limits on Supabase directly via PATCH
  async function updateSupabaseLimits(id, updates) {
    const sbUrl = 'https://inolfvjpiktmrhqyvnsh.supabase.co/rest/v1/student_usage_limits?id=eq.' + encodeURIComponent(id);
    const sbKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlub2xmdmpwaWt0bXJocXl2bnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MjU5NDUsImV4cCI6MjEwMDUwMTk0NX0.gurNKy0vtMfVMW-To_2kyvMpQhEPpq7bKkJnyNN2qAc';
    const res = await fetch(sbUrl, {
      method: 'PATCH',
      headers: {
        'apikey': sbKey,
        'Authorization': 'Bearer ' + sbKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error("Failed to update limits");
  }

  const authCover = document.getElementById('ep-auth-cover');
  const authInput = document.getElementById('ep-auth-input');
  const authBtn = document.getElementById('ep-auth-btn');
  const authError = document.getElementById('ep-auth-error');

  const savedId = localStorage.getItem('ep_hub_verified_id');
  if (savedId) {
    authCover.style.display = 'none';
    checkSupabaseAccess(savedId).then(isVerified => {
      if (!isVerified) {
        localStorage.removeItem('ep_hub_verified_id');
        authCover.style.display = 'flex';
        authError.textContent = "Your access has expired or was removed. Go to hub-zero.site to verify.";
      }
    }).catch(err => {
      console.error("Auth check failed:", err);
    });
  }

  authBtn.addEventListener('click', async () => {
    const enteredId = authInput.value.replace(/['"]/g, "").trim();
    if (!enteredId) {
      authError.textContent = "Please enter an ID.";
      return;
    }
    
    authInput.disabled = true;
    authBtn.disabled = true;
    authBtn.textContent = "Verifying...";
    authError.textContent = "";

    try {
      const isVerified = await checkSupabaseAccess(enteredId);
      if (isVerified) {
        localStorage.setItem('ep_hub_verified_id', enteredId);
        authCover.style.display = 'none';
      } else {
        authError.textContent = "You do not yet have access! Go to hub-zero.site to link your realm!";
      }
    } catch (e) {
      authError.textContent = "Connection error. Please try again.";
    } finally {
      authInput.disabled = false;
      authBtn.disabled = false;
      authBtn.textContent = "Verify Access";
    }
  });
})();