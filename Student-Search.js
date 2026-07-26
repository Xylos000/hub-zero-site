javascript:(async function(){

  if(document.getElementById('_rss_root')){
    document.getElementById('_rss_root').remove();
    return;
  }

  // Get externalId and clean it
  let studentId = '';
  if (window.schoolboxUser && window.schoolboxUser.externalId) {
    studentId = String(window.schoolboxUser.externalId).replace(/['"]/g, "").trim();
  }

  if (!studentId) {
    alert("Error! Could not find your student ID. Please make sure you are logged in on the realm portal.");
    return;
  }

  // Verify against Supabase
  try {
    const sbUrl = 'https://inolfvjpiktmrhqyvnsh.supabase.co/rest/v1/verified_students?id=eq.' + encodeURIComponent(studentId);
    const sbKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlub2xmdmpwaWt0bXJocXl2bnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MjU5NDUsImV4cCI6MjEwMDUwMTk0NX0.gurNKy0vtMfVMW-To_2kyvMpQhEPpq7bKkJnyNN2qAc';
    const response = await fetch(sbUrl, {
      headers: {
        'apikey': sbKey,
        'Authorization': 'Bearer ' + sbKey
      }
    });
    
    if (!response.ok) {
      throw new Error("Supabase request failed: " + response.statusText);
    }
    
    const data = await response.json();
    if (!data || data.length === 0) {
      alert("Error! Your ID is not whitelisted. Go to Hub-Zero.site and complete the realm link to verify your ID");
      return;
    }
  } catch (error) {
    console.error("Supabase verification error:", error);
    alert("Error checking access status! Please try again later or contact support.");
    return;
  }

  const GITHUB_URL='https://raw.githubusercontent.com/Xylos000/Data/refs/heads/main/realm_students.txt';
  const DROPBOX_CONFIG={
    refreshToken:'TswY5VPKPZIAAAAAAAAAAexX6b7MNjI2vs73jevAw8ISqzSDtfz2Xand1JTjF4jP',
    appKey:'r9qwbhnn0w8cka7',
    appSecret:'zyr8py0krtvc7qh',
    folderPath:'/Apps/Realm Student Search/School Photos'
  };
  const YEAR_MAP={26:'Year 12',27:'Year 11',28:'Year 10',29:'Year 9',30:'Year 8',31:'Year 7',32:'Year 6',33:'Year 5'};
  const EXCLUDE=['mr ','mrs ','miss ','ms ','dr '];

  /* ── Icons ──────────────────────────────────────── */
  const IC_DL=`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
  const IC_EM=`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;
  const IC_MS=`<svg width="16" height="16" viewBox="0 0 23 23"><rect x="0" y="0" width="10.5" height="10.5" rx="1.5" fill="currentColor"/><rect x="12.5" y="0" width="10.5" height="10.5" rx="1.5" fill="currentColor"/><rect x="0" y="12.5" width="10.5" height="10.5" rx="1.5" fill="currentColor"/><rect x="12.5" y="12.5" width="10.5" height="10.5" rx="1.5" fill="currentColor"/></svg>`;
  const IC_PR=`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
  const IC_CH=`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
  const IC_SH=`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
  const IC_GRP=`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
  const IC_RL=`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`;
  const IC_IM=`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M17 14h6"/><path d="M20 11v6"/></svg>`;

  /* ── Styles ─────────────────────────────────────── */
  const S=document.createElement('style');
  S.id='_rss_styles';
  S.textContent=`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

    /* ═══ ROOT ═══════════════════════════════════ */
    #_rss_root {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 920px; height: 80vh; max-height: 80vh;
      background: #070a13;
      border-radius: 16px;
      box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05), 0 24px 64px rgba(0, 0, 0, 0.6);
      z-index: 2147483647;
      display: flex;
      font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      overflow: hidden; color: #cbd5e1; -webkit-font-smoothing: antialiased;
    }
    :where(#_rss_root), :where(#_rss_root) * {
      box-sizing: border-box;
      margin: 0; padding: 0;
    }

    #_rss_root.minimised {
      height: 56px; max-height: 56px; width: 220px;
    }
    #_rss_root.minimised #_rss_main {
      display: none !important;
    }
    #_rss_root.minimised #_rss_sidebar {
      height: 100%; border-right: none;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
    #_rss_root.minimised ._rss_sidebar_brand {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      padding: 0;
      border-bottom: none;
      cursor: pointer;
    }
    #_rss_root.minimised ._rss_sidebar_nav,
    #_rss_root.minimised ._rss_sidebar_footer {
      display: none !important;
    }

    /* ═══ SIDEBAR ════════════════════════════════ */
    #_rss_sidebar {
      width: 220px;
      background: #0b0f19;
      border-right: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      height: 100%;
      cursor: grab;
      user-select: none;
    }
    #_rss_sidebar:active { cursor: grabbing; }
    
    ._rss_sidebar_brand {
      padding: 20px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    ._rss_brand_title {
      font-size: 14px;
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.2px;
    }
    ._rss_brand_v {
      color: #6366f1;
    }
    ._rss_brand_sub {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.4);
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    ._rss_sidebar_nav {
      flex: 1;
      padding: 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    
    /* Navigation link overrides */
    ._rss_sidebar_nav ._rss_mode_tab {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      height: 38px;
      padding: 0 12px;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: #94a3b8;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      text-align: left;
      transition: all 0.15s ease;
    }
    ._rss_sidebar_nav ._rss_mode_tab svg {
      width: 16px;
      height: 16px;
      stroke-width: 2.2px;
      transition: transform 0.15s;
    }
    ._rss_sidebar_nav ._rss_mode_tab:hover {
      background: rgba(255, 255, 255, 0.03);
      color: #fff;
    }
    ._rss_sidebar_nav ._rss_mode_tab.active {
      background: rgba(99, 102, 241, 0.1);
      color: #818cf8;
      border: 1px solid rgba(99, 102, 241, 0.15);
    }
    ._rss_sidebar_nav ._rss_mode_tab.active svg {
      stroke: #818cf8;
    }

    ._rss_sidebar_footer {
      padding: 16px 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    #_rss_status_container {
      display: flex;
      align-items: center;
      padding: 4px 8px;
    }
    #_rss_status {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.5);
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #_rss_clearbtn {
      height: 32px;
      width: 32px;
      padding: 0;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #ef4444;
      font-size: 14px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      display: none;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }
    #_rss_clearbtn:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.35);
      color: #fca5a5;
    }
    ._rss_footer_btn {
      width: 100%;
      height: 30px;
      padding: 0 10px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      background: rgba(255, 255, 255, 0.02);
      color: #cbd5e1;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.12s;
    }
    ._rss_footer_btn:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
      border-color: rgba(255, 255, 255, 0.12);
    }
    ._rss_footer_btn svg {
      width: 12px;
      height: 12px;
    }
    ._rss_refresh_link {
      width: 100%;
      height: 30px;
      padding: 0 10px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.04);
      background: rgba(255, 255, 255, 0.01);
      color: rgba(255, 255, 255, 0.4);
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.15s ease;
    }
    ._rss_refresh_link:hover {
      background: rgba(99, 102, 241, 0.08);
      border-color: rgba(99, 102, 241, 0.2);
      color: #818cf8;
    }
    ._rss_refresh_link svg {
      width: 12px;
      height: 12px;
    }

    /* ═══ MAIN CONTENT PANE ══════════════════════ */
    #_rss_main {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #070a13;
    }
    
    #_rss_main_header {
      height: 56px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      flex-shrink: 0;
    }
    #_rss_main_title {
      font-size: 15px;
      font-weight: 700;
      color: #fff;
    }
    
    ._rss_header_actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    ._rss_primary_btn {
      height: 32px;
      padding: 0 14px;
      background: #6366f1;
      border: 1px solid #4f46e5;
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }
    ._rss_primary_btn:hover {
      background: #4f46e5;
    }
    ._rss_primary_btn svg {
      width: 12px;
      height: 12px;
    }
    
    ._rss_secondary_btn {
      height: 32px;
      padding: 0 14px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #cbd5e1;
      font-size: 12px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      transition: all 0.15s ease;
    }
    ._rss_secondary_btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      border-color: rgba(255, 255, 255, 0.18);
    }
    
    ._rss_win_controls {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-left: 8px;
    }
    ._rss_win_btn {
      width: 28px;
      height: 28px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.4);
      font-size: 16px;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.12s;
    }
    ._rss_win_btn:hover {
      background: rgba(255, 255, 255, 0.06);
      color: #fff;
    }
    #_rss_close:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #fca5a5;
    }

    /* ═══ BODY ═══════════════════════════════════ */
    #_rss_body {
      overflow-y: auto;
      flex: 1;
      padding: 0 20px 20px;
    }
    #_rss_body::-webkit-scrollbar {
      width: 6px;
    }
    #_rss_body::-webkit-scrollbar-track {
      background: transparent;
    }
    #_rss_body::-webkit-scrollbar-thumb {
      background: #1f2937;
      border-radius: 3px;
    }
    #_rss_body::-webkit-scrollbar-thumb:hover {
      background: #374151;
    }

    /* ── Inner panel behind cards ─────────── */
    #_rss_inner {
      background: #0c101d;
      border: 1px solid rgba(255,255,255,0.04);
      border-radius: 12px;
      padding: 20px;
      min-height: 100px;
      margin-top: 16px;
    }

    /* ═══ STATES ═════════════════════════════════ */
    #_rss_loading, #_rss_yg_loading {
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 70px 20px;
      gap: 14px;
    }
    ._rss_spinner {
      width: 26px;
      height: 26px;
      border: 2.5px solid #1f2937;
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: _rss_spin 0.65s linear infinite;
    }
    @keyframes _rss_spin {
      to { transform: rotate(360deg); }
    }
    #_rss_loading p, #_rss_yg_loading p {
      font-size: 13px;
      color: #64748b;
    }
    #_rss_empty, #_rss_yg_empty {
      display: none;
      text-align: center;
      padding: 70px 20px;
      font-size: 14px;
      color: #64748b;
    }
    #_rss_hint, #_rss_yg_hint {
      font-size: 13px;
      color: #64748b;
      text-align: center;
      padding: 60px 20px;
      line-height: 1.5;
    }

    /* ═══ RESULT CARDS (SEARCH) ══════════════════ */
    #_rss_current_list {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 10px;
    }
    ._rss_inactive_card {
      border-color: rgba(239, 68, 68, 0.1) !important;
    }
    ._rss_yg_inactive_badge {
      position: absolute;
      top: 6px;
      right: 6px;
      background: rgba(239, 68, 68, 0.85);
      color: #fff;
      font-size: 8px;
      font-weight: 800;
      padding: 2px 5px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    /* ── Avatar Loading State ───────────────────── */
    @keyframes shimmer-pulse {
      0%, 100% { background-color: #1a2333; }
      50% { background-color: #27354e; }
    }
    ._rss_loading_avatar {
      animation: shimmer-pulse 1.2s ease-in-out infinite;
      position: relative;
    }
    ._rss_loading_avatar::after {
      content: '';
      position: absolute;
      top: calc(50% - 10px);
      left: calc(50% - 10px);
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: _rss_spin 0.65s linear infinite;
      z-index: 2;
    }
    ._rss_photo_failed {
      border-color: rgba(239, 68, 68, 0.3) !important;
      background: rgba(239, 68, 68, 0.04) !important;
    }

    /* ── Animated Name ──────────────────────────── */
    .animated-name {
      background: linear-gradient(90deg, #ec4899, #a855f7, #3b82f6, #ec4899);
      background-size: 200% auto;
      color: transparent;
      -webkit-background-clip: text;
      background-clip: text;
      animation: text-rainbow 4s linear infinite;
      font-weight: 800 !important;
    }

    /* ── Disabled / Soon ───────────────────────── */
    ._rss_soon,
    ._rss_soon:hover {
      color: rgba(255,255,255,0.15) !important;
      cursor: not-allowed !important;
      background: none !important;
      border-color: transparent !important;
    }
    ._rss_soon .ic {
      color: rgba(255,255,255,0.1) !important;
    }

    /* ═══ PROFILE CARD DETAILS ═══════════════════ */
    ._rss_profile_container {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 24px;
      background: #111625;
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 12px;
      padding: 24px;
      margin-top: 10px;
    }
    ._rss_profile_left {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    ._rss_profile_avatar_container {
      width: 200px;
      height: 224px;
      border-radius: 8px;
      background: #1f2937;
      border: 1px solid rgba(255, 255, 255, 0.06);
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }
    ._rss_profile_avatar_container img,
    ._rss_profile_avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 50% 20%;
      display: block;
    }
    ._rss_profile_avatar_fallback {
      font-size: 36px;
      font-weight: 700;
      color: #94a3b8;
    }
    ._rss_profile_right {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      min-width: 0;
    }
    ._rss_profile_name {
      font-size: 22px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 4px;
      letter-spacing: -0.3px;
    }
    ._rss_profile_badge_row {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }
    ._rss_profile_badge {
      padding: 3px 8px;
      border-radius: 5px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    ._rss_profile_badge.active {
      background: rgba(16, 185, 129, 0.1);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.15);
    }
    ._rss_profile_badge.inactive {
      background: rgba(239, 68, 68, 0.1);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.15);
    }
    ._rss_view_profile_link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 8px;
      border-radius: 5px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      background: rgba(99, 102, 241, 0.1);
      color: #818cf8;
      border: 1px solid rgba(99, 102, 241, 0.15);
      text-decoration: none;
      transition: all 0.15s ease;
      line-height: 1;
    }
    ._rss_view_profile_link:hover {
      background: rgba(99, 102, 241, 0.2);
      color: #a5b4fc;
      border-color: rgba(99, 102, 241, 0.3);
    }
    ._rss_view_profile_link svg {
      width: 12px;
      height: 12px;
      stroke: currentColor;
    }
    ._rss_profile_info_grid {
      display: grid;
      grid-template-columns: 90px 1fr;
      gap: 10px 16px;
      font-size: 13px;
      color: #cbd5e1;
      margin-bottom: 24px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 8px;
      padding: 14px;
    }
    ._rss_profile_info_label {
      color: #64748b;
      font-weight: 600;
    }
    ._rss_profile_info_value {
      font-weight: 500;
      word-break: break-all;
    }
    ._rss_profile_actions {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    ._rss_profile_action_btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 0 16px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      color: #cbd5e1;
      height: 38px;
    }
    ._rss_profile_action_btn:hover:not(:disabled) {
      background: rgba(99, 102, 241, 0.12);
      border-color: rgba(99, 102, 241, 0.25);
      color: #fff;
    }
    ._rss_profile_action_btn:disabled {
      opacity: 0.25;
      cursor: not-allowed;
    }
    ._rss_profile_action_btn .ic {
      display: inline-flex;
      align-items: center;
      color: #94a3b8;
    }

    /* ═══ YEAR GROUP BROWSE ══════════════════════ */
    #_rss_yg_view {
      margin-top: 16px;
      background: #0c101d;
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 12px;
      padding: 20px;
    }
    #_rss_yg_selector {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 20px;
      justify-content: center;
    }
    ._rss_yg_btn {
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid rgba(255,255,255,0.05);
      background: #111625;
      font-size: 12px;
      font-weight: 600;
      color: #94a3b8;
      cursor: pointer;
      transition: all 0.12s ease;
    }
    ._rss_yg_btn:hover {
      background: rgba(255,255,255,0.04);
      color: #fff;
      border-color: rgba(255,255,255,0.1);
    }
    ._rss_yg_btn.active {
      background: #6366f1;
      color: #fff;
      border-color: #4f46e5;
    }
    #_rss_yg_search_container {
      margin-bottom: 16px;
      position: relative;
    }
    #_rss_yg_search_input {
      width: 100% !important;
      padding: 8px 12px !important;
      padding-left: 36px !important;
      font-size: 13px !important;
      border: 1px solid rgba(255,255,255,0.06) !important;
      border-radius: 8px !important;
      outline: none !important;
      transition: all 0.15s ease !important;
      background: #111625 !important;
      color: #fff !important;
      box-shadow: none !important;
    }
    #_rss_yg_search_input:focus {
      background: #151b2e !important;
      border-color: #6366f1 !important;
      box-shadow: none !important;
    }
    ._rss_yg_search_icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #64748b;
      display: flex;
      align-items: center;
      pointer-events: none;
    }

    /* ═══ COMPACT CARD (4-COL GRID) ═══════════════ */
    ._rss_yg_grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 10px;
    }
    ._rss_yg_card {
      background: #111625;
      border: 1px solid rgba(255,255,255,0.04);
      border-radius: 10px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
      min-height: 180px;
    }
    ._rss_yg_card:hover {
      transform: translateY(-2px);
      border-color: rgba(99, 102, 241, 0.25);
      box-shadow: 0 8px 24px rgba(0,0,0,0.35);
    }
    ._rss_yg_avatar {
      width: 100%;
      aspect-ratio: 112 / 126;
      border-radius: 6px;
      background: #1f2937;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      font-size: 18px;
      font-weight: 700;
      border: 1px solid rgba(255,255,255,0.05);
      flex-shrink: 0;
      overflow: hidden;
      position: relative;
    }
    ._rss_yg_avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 50% 20%;
      border-radius: 4px;
    }
    ._rss_yg_name {
      font-size: 12px;
      font-weight: 700;
      color: #cbd5e1;
      line-height: 1.4;
      margin-bottom: 2px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      height: 34px;
      width: 100%;
    }
    ._rss_yg_id {
      font-size: 10px;
      font-weight: 600;
      color: #64748b;
    }

    /* ═══ LIGHTBOX ═══════════════════════════════ */
    #_rss_lightbox {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      z-index: 2147483647;
      display: none;
      align-items: center;
      justify-content: center;
      opacity: 0;
      user-select: none;
    }
    #_rss_lightbox.active {
      display: flex;
      opacity: 1;
    }
    #_rss_lightbox_img_container {
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      scrollbar-width: none;
    }
    #_rss_lightbox_img {
      max-width: 100%;
      max-height: 85vh;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 24px 64px rgba(0,0,0,0.7);
    }
    #_rss_lightbox_caption {
      position: absolute;
      bottom: 30px;
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      background: rgba(15, 23, 42, 0.7);
      padding: 8px 16px;
      border-radius: 20px;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.08);
      pointer-events: none;
    }
    #_rss_lightbox_close {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #fff;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    #_rss_lightbox_close:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: scale(1.1);
    }

    /* ═══ EMAIL COMPOSER MODAL ══════════════════ */
    #_rss_email_modal {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(8px);
      z-index: 2147483647;
      display: none;
      align-items: center;
      justify-content: center;
    }
    ._rss_email_container {
      width: 440px;
      background: #0b0f19;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
      font-family: 'Outfit', 'Inter', sans-serif;
      color: #cbd5e1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    ._rss_email_header {
      padding: 12px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    ._rss_email_title {
      font-size: 14px;
      font-weight: 700;
      color: #fff;
    }
    ._rss_email_close_btn {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.4);
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.15s;
    }
    ._rss_email_close_btn:hover {
      color: #f87171;
    }
    ._rss_email_body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    ._rss_email_field_group {
      all: unset !important;
      display: flex !important;
      align-items: center !important;
      gap: 12px !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }
    ._rss_email_field_label {
      all: unset !important;
      width: 32px !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      color: #64748b !important;
      flex-shrink: 0 !important;
    }
    ._rss_email_section_label {
      all: unset !important;
      font-size: 12px !important;
      font-weight: 600 !important;
      color: #64748b !important;
      margin-bottom: 4px !important;
      display: block !important;
    }
    ._rss_email_field_input_wrapper {
      all: unset !important;
      flex: 1 !important;
      display: flex !important;
      align-items: center !important;
      flex-wrap: wrap !important;
      gap: 6px !important;
      background: #111625 !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      border-radius: 6px !important;
      padding: 6px 10px !important;
      min-height: 32px !important;
      box-sizing: border-box !important;
    }
    ._rss_email_field_input_wrapper:focus-within {
      border-color: #6366f1 !important;
    }
    ._rss_email_tag {
      all: unset !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 4px !important;
      background: rgba(99, 102, 241, 0.1) !important;
      color: #818cf8 !important;
      border: 1px solid rgba(99, 102, 241, 0.15) !important;
      padding: 2px 6px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      font-weight: 600 !important;
      white-space: nowrap !important;
      line-height: 1 !important;
      box-sizing: border-box !important;
    }
    ._rss_email_tag_close {
      all: unset !important;
      background: none !important;
      border: none !important;
      color: #818cf8 !important;
      cursor: pointer !important;
      font-size: 10px !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 0 !important;
      margin-left: 4px !important;
      line-height: 1 !important;
      width: 12px !important;
      height: 12px !important;
      border-radius: 50% !important;
      transition: background 0.12s !important;
    }
    ._rss_email_tag_close:hover {
      background: rgba(239, 68, 68, 0.2) !important;
      color: #ef4444 !important;
    }
    ._rss_email_field_plus {
      all: unset !important;
      background: rgba(255, 255, 255, 0.04) !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      color: #cbd5e1 !important;
      width: 32px !important;
      height: 32px !important;
      border-radius: 6px !important;
      cursor: pointer !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 16px !important;
      font-weight: 500 !important;
      transition: all 0.15s !important;
      box-sizing: border-box !important;
      flex-shrink: 0 !important;
    }
    ._rss_email_field_plus:hover {
      background: rgba(99, 102, 241, 0.15) !important;
      border-color: rgba(99, 102, 241, 0.35) !important;
      color: #fff !important;
    }
    ._rss_email_input {
      all: unset !important;
      background: transparent !important;
      border: none !important;
      color: #fff !important;
      font-family: inherit !important;
      font-size: 13px !important;
      outline: none !important;
      flex: 1 !important;
      min-width: 80px !important;
      padding: 0 !important;
      margin: 0 !important;
      box-shadow: none !important;
      height: 20px !important;
    }
    ._rss_email_subject_input {
      background: #111625 !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      border-radius: 6px !important;
      color: #fff !important;
      font-family: inherit !important;
      font-size: 13px !important;
      padding: 8px 12px !important;
      outline: none !important;
      width: 100% !important;
      box-shadow: none !important;
      box-sizing: border-box !important;
    }
    ._rss_email_subject_input:focus {
      border-color: #6366f1 !important;
    }
    ._rss_email_textarea {
      background: #111625 !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      border-radius: 6px !important;
      color: #fff !important;
      font-family: inherit !important;
      font-size: 13px !important;
      padding: 10px 12px !important;
      outline: none !important;
      width: 100% !important;
      min-height: 100px;
      resize: vertical;
      box-shadow: none !important;
      box-sizing: border-box !important;
    }
    ._rss_email_textarea:focus {
      border-color: #6366f1 !important;
    }
    ._rss_email_footer {
      padding: 10px 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    /* ═══ TINY EMAIL SEARCH POPUP ═══════════════ */
    #_rss_email_search_popup {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.6);
      z-index: 2147483647;
      display: none;
      align-items: center;
      justify-content: center;
    }
    ._rss_tiny_search_container {
      width: 420px;
      background: #070a13;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      max-height: 400px;
      overflow: hidden;
    }
    ._rss_tiny_search_header {
      padding: 12px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    ._rss_tiny_search_input {
      flex: 1;
      background: #111625 !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      border-radius: 6px !important;
      color: #fff !important;
      font-family: inherit !important;
      font-size: 13px !important;
      padding: 8px 12px !important;
      outline: none !important;
      box-shadow: none !important;
    }
    ._rss_tiny_search_input:focus {
      border-color: #6366f1 !important;
    }
    ._rss_tiny_search_close {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      padding: 0;
    }
    ._rss_tiny_search_close:hover {
      color: #fff;
    }
    ._rss_tiny_search_results {
      flex: 1;
      overflow-y: auto;
      padding: 6px 0;
    }
    ._rss_tiny_search_row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      cursor: pointer;
      transition: background 0.12s;
    }
    ._rss_tiny_search_row:hover {
      background: rgba(255, 255, 255, 0.04);
    }
    ._rss_tiny_avatar_circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #1f2937;
      border: 1px solid rgba(255, 255, 255, 0.06);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      color: #cbd5e1;
      flex-shrink: 0;
    }
    ._rss_tiny_avatar_circle img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    ._rss_tiny_name {
      font-size: 13.5px;
      font-weight: 600;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /* ═══ LOCK OVERLAY ══════════════════════════ */
    #_rss_lock_overlay {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(11, 15, 25, 0.7);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 2147483640;
      display: none;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 12px;
      color: #fff;
      font-family: inherit;
    }
    #_rss_lock_overlay.active {
      display: flex;
    }
    ._rss_lock_icon {
      color: #6366f1;
      animation: pulse-lock 2s infinite ease-in-out;
    }
    ._rss_lock_text {
      font-size: 13px;
      font-weight: 700;
      color: #94a3b8;
      text-align: center;
      padding: 0 20px;
      line-height: 1.5;
    }
    @keyframes pulse-lock {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.1); opacity: 1; }
    }
  `;
  document.head.appendChild(S);

  /* ── Panel HTML ─────────────────────────────────── */
  const root=document.createElement('div');
  root.id='_rss_root';
  root.innerHTML=`
    <div id="_rss_sidebar">
      <div class="_rss_sidebar_brand">
        <span class="_rss_brand_title">Student Searcher <span class="_rss_brand_v">V1</span></span>
        <span class="_rss_brand_sub">- Xylos</span>
      </div>
      
      <div class="_rss_sidebar_nav">
        <button class="_rss_mode_tab active" data-mode="search">${IC_SH} Search</button>
        <button class="_rss_mode_tab" data-mode="year">${IC_GRP} Year Groups</button>
      </div>
      
      <div class="_rss_sidebar_footer">
        <div id="_rss_status_container">
          <span id="_rss_status">Ready</span>
        </div>
        <button id="_rss_reload_failed" class="_rss_footer_btn" style="display:none; color:#ef4444;">${IC_RL} Reload Failed</button>
        <button id="_rss_refresh" class="_rss_refresh_link" title="Refresh Data">${IC_RL} Refresh Cache</button>
      </div>
    </div>
    
    <div id="_rss_main">
      <div id="_rss_main_header">
        <span id="_rss_main_title">Search</span>
        <div class="_rss_header_actions">
          <button id="_rss_clearbtn" title="Clear Search" style="display:none;">✕</button>
          <button id="_rss_newbtn" class="_rss_primary_btn">${IC_SH} New Search</button>
          <div class="_rss_win_controls">
            <button class="_rss_win_btn" id="_rss_min" title="Minimise">&#8722;</button>
            <button class="_rss_win_btn" id="_rss_close" title="Close">&#215;</button>
          </div>
        </div>
      </div>
      
      <div id="_rss_body">
        <!-- Search View Container -->
        <div id="_rss_search_view">
          <div id="_rss_inner">
            <div id="_rss_loading"><div class="_rss_spinner"></div><p>Loading...</p></div>
            <div id="_rss_hint">Click New Search to get started.</div>
            <div id="_rss_search_query_display" style="display:none; font-size:13px; color:#64748b; margin-bottom:12px; font-weight:600;"></div>
            <div id="_rss_current_list"></div>
            <div id="_rss_empty">No results found.</div>
          </div>
        </div>
        
        <!-- Year Group View Container -->
        <div id="_rss_yg_view" style="display:none;">
          <div id="_rss_yg_selector"></div>
          <div id="_rss_yg_search_container" style="display:none;">
            <span class="_rss_yg_search_icon">${IC_SH}</span>
            <input type="text" id="_rss_yg_search_input" placeholder="Search year group" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"/>
          </div>
          <div id="_rss_yg_hint">Select a year group above to start browsing.</div>
          <div id="_rss_yg_loading">
            <div class="_rss_spinner"></div>
            <p>Hang tight, collecting data...</p>
          </div>
          <div id="_rss_yg_empty">No students found in this year group.</div>
          <div id="_rss_yg_grid" class="_rss_yg_grid"></div>
        </div>
        
        <!-- Profile View Container -->
        <div id="_rss_profile_view" style="display:none;">
          <button id="_rss_profile_back" class="_rss_secondary_btn" style="margin-top: 16px; margin-bottom: 8px; display: inline-flex; align-items: center; gap: 6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back
          </button>
          <div id="_rss_profile_card_container"></div>
        </div>
      </div>
    </div>
    <div id="_rss_lock_overlay">
      <svg class="_rss_lock_icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
      <div class="_rss_lock_text">Interface Locked<br><span style="font-size: 11px; font-weight: 500; color: #64748b;">Please close Developer Tools to unlock</span></div>
    </div>
  `;
  document.body.appendChild(root);

  /* ── Lightbox Overlay ───────────────────────────── */
  const lightbox = document.createElement('div');
  lightbox.id = '_rss_lightbox';
  lightbox.innerHTML = `
    <button id="_rss_lightbox_close" title="Close"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
    <div id="_rss_lightbox_img_container">
      <img id="_rss_lightbox_img" src="" alt="Maximised Student Photo" />
    </div>
    <div id="_rss_lightbox_caption"></div>
  `;
  document.body.appendChild(lightbox);

  const lbImg = lightbox.querySelector('#_rss_lightbox_img');
  const lbContainer = lightbox.querySelector('#_rss_lightbox_img_container');
  const lbCaption = lightbox.querySelector('#_rss_lightbox_caption');
  const lbClose = lightbox.querySelector('#_rss_lightbox_close');

  function openLightbox(url, name) {
    lbImg.src = url;
    lbImg.classList.remove('zoomed');
    lbContainer.classList.remove('zoomed');
    lbCaption.textContent = name;
    lightbox.style.display = 'flex';
    lightbox.offsetHeight; // trigger reflow
    lightbox.classList.add('active');
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    setTimeout(() => {
      if (!lightbox.classList.contains('active')) {
        lightbox.style.display = 'none';
        lbImg.src = '';
        lbImg.classList.remove('zoomed');
        lbContainer.classList.remove('zoomed');
      }
    }, 250);
  }

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lbContainer) {
      closeLightbox();
    }
  });

  lbImg.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  /* ── Drag ───────────────────────────────────────── */
  let dx=0,dy=0,dragging=false;
  const handleDragStart = e => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    dragging = true;
    const r = root.getBoundingClientRect();
    root.style.left = r.left + 'px';
    root.style.top = r.top + 'px';
    root.style.transform = 'none';
    dx = e.clientX - r.left;
    dy = e.clientY - r.top;
    e.preventDefault();
  };
  const sidebar = root.querySelector('#_rss_sidebar');
  const header = root.querySelector('#_rss_main_header');
  if (sidebar) {
    sidebar.addEventListener('mousedown', handleDragStart);
    sidebar.addEventListener('click', () => {
      if (root.classList.contains('minimised')) {
        root.classList.remove('minimised');
      }
    });
  }
  if (header) header.addEventListener('mousedown', handleDragStart);

  document.addEventListener('mousemove',e=>{if(!dragging)return;root.style.left=(e.clientX-dx)+'px';root.style.top=(e.clientY-dy)+'px';});
  document.addEventListener('mouseup',()=>dragging=false);
  root.querySelector('#_rss_min').addEventListener('click',()=>root.classList.toggle('minimised'));
  root.querySelector('#_rss_close').addEventListener('click',()=>{
    root.remove();
    S.remove();
    const lb = document.getElementById('_rss_lightbox');
    if (lb) lb.remove();
  });
  root.querySelector('#_rss_profile_back').addEventListener('click', () => {
    setMode(previousMode);
  });

  /* ── Email Composer Overlay ─────────────────────── */
  const emailModal = document.createElement('div');
  emailModal.id = '_rss_email_modal';
  emailModal.style.display = 'none';
  emailModal.innerHTML = `
    <div class="_rss_email_container">
      <div class="_rss_email_header">
        <span class="_rss_email_title">Compose Email</span>
        <button id="_rss_email_close" class="_rss_email_close_btn" title="Close Composer">✕</button>
      </div>
      <div class="_rss_email_body">
        <div class="_rss_email_field_group">
          <span class="_rss_email_field_label">To</span>
          <div id="_rss_email_to_wrapper" class="_rss_email_field_input_wrapper"></div>
          <button class="_rss_email_field_plus" data-field="to" title="Add Recipient">+</button>
        </div>
        <div class="_rss_email_field_group">
          <span class="_rss_email_field_label">Cc</span>
          <div id="_rss_email_cc_wrapper" class="_rss_email_field_input_wrapper"></div>
          <button class="_rss_email_field_plus" data-field="cc" title="Add CC">+</button>
        </div>
        <div class="_rss_email_field_group">
          <span class="_rss_email_field_label">Bcc</span>
          <div id="_rss_email_bcc_wrapper" class="_rss_email_field_input_wrapper"></div>
          <button class="_rss_email_field_plus" data-field="bcc" title="Add BCC">+</button>
        </div>
        <div style="display:flex; flex-direction:column;">
          <span class="_rss_email_section_label">Subject</span>
          <input type="text" id="_rss_email_subject" class="_rss_email_subject_input" placeholder="Enter subject line..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"/>
        </div>
        <div style="display:flex; flex-direction:column; flex:1;">
          <span class="_rss_email_section_label">Message</span>
          <textarea id="_rss_email_body_text" class="_rss_email_textarea" placeholder="Type your message here..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
        </div>
      </div>
      <div class="_rss_email_footer">
        <button id="_rss_email_cancel_btn" class="_rss_secondary_btn">Cancel</button>
        <button id="_rss_email_send_btn" class="_rss_primary_btn">Send</button>
      </div>
    </div>
  `;
  document.body.appendChild(emailModal);

  /* ── Tiny Email Search Popup ────────────────────── */
  const emailSearchPopup = document.createElement('div');
  emailSearchPopup.id = '_rss_email_search_popup';
  emailSearchPopup.style.display = 'none';
  emailSearchPopup.innerHTML = `
    <div class="_rss_tiny_search_container">
      <div class="_rss_tiny_search_header">
        <input type="text" class="_rss_tiny_search_input" placeholder="Search student name..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"/>
        <button id="_rss_tiny_search_close" class="_rss_tiny_search_close" title="Close Search">✕</button>
      </div>
      <div class="_rss_tiny_search_results"></div>
    </div>
  `;
  document.body.appendChild(emailSearchPopup);

  let activeEmailField = 'to';
  let currentEmailModalStudent = null;
  const emailLists = { to: [], cc: [], bcc: [] };

  function renderEmailTags() {
    ['to', 'cc', 'bcc'].forEach(field => {
      const wrapper = emailModal.querySelector(`#_rss_email_${field}_wrapper`);
      wrapper.innerHTML = '';
      
      emailLists[field].forEach((item, idx) => {
        const tag = document.createElement('span');
        tag.className = '_rss_email_tag';
        tag.title = item.email;
        tag.innerHTML = `${item.name} <button class="_rss_email_tag_close" data-field="${field}" data-idx="${idx}">✕</button>`;
        wrapper.appendChild(tag);
      });
      
      const input = document.createElement('input');
      input.type = 'text';
      input.className = '_rss_email_input';
      input.placeholder = emailLists[field].length === 0 ? `Add email...` : '';
      input.setAttribute('autocomplete', 'off');
      input.setAttribute('autocorrect', 'off');
      input.setAttribute('autocapitalize', 'off');
      input.setAttribute('spellcheck', 'false');
      
      const convertToTag = () => {
        const val = input.value.trim().replace(/[,;]/g, '');
        if (val) {
          const foundStudent = Object.values(studentData || {}).find(s => s.email.toLowerCase() === val.toLowerCase());
          const record = foundStudent 
            ? { name: foundStudent.name, email: foundStudent.email }
            : { name: val, email: val };
          
          if (!emailLists[field].some(x => x.email.toLowerCase() === record.email.toLowerCase())) {
            emailLists[field].push(record);
            renderEmailTags();
          }
        }
      };
      
      input.addEventListener('keydown', (e) => {
        if (e.key === ',' || e.key === ';' || e.key === 'Enter') {
          e.preventDefault();
          convertToTag();
        } else if (e.key === 'Backspace' && input.value === '') {
          if (emailLists[field].length > 0) {
            emailLists[field].pop();
            renderEmailTags();
          }
        }
      });
      
      input.addEventListener('blur', convertToTag);
      wrapper.appendChild(input);
    });
    
    emailModal.querySelectorAll('._rss_email_tag_close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const field = btn.dataset.field;
        const idx = parseInt(btn.dataset.idx);
        emailLists[field].splice(idx, 1);
        renderEmailTags();
      });
    });
  }

  function openEmailModal(student) {
    currentEmailModalStudent = student;
    emailLists.to = [{ name: student.name, email: student.email }];
    emailLists.cc = [];
    emailLists.bcc = [];
    
    emailModal.querySelector('#_rss_email_subject').value = '';
    emailModal.querySelector('#_rss_email_body_text').value = '';
    
    renderEmailTags();
    emailModal.style.display = 'flex';
  }

  function closeEmailModal() {
    emailModal.style.display = 'none';
  }

  function openTinySearch() {
    const input = emailSearchPopup.querySelector('._rss_tiny_search_input');
    const results = emailSearchPopup.querySelector('._rss_tiny_search_results');
    
    input.value = '';
    results.innerHTML = '';
    
    emailSearchPopup.style.display = 'flex';
    input.focus();
    
    renderTinySearchResults('');
  }

  function closeTinySearch() {
    emailSearchPopup.style.display = 'none';
  }

  async function renderTinySearchResults(query) {
    const results = emailSearchPopup.querySelector('._rss_tiny_search_results');
    results.innerHTML = '';
    
    if (!studentData) return;
    
    const q = query.trim().toLowerCase();
    const students = Object.values(studentData);
    
    const activeYear = currentEmailModalStudent ? currentEmailModalStudent.year : null;
    const filtered = q === '' 
      ? students.filter(s => activeYear ? s.year === activeYear : true).slice(0, 30)
      : students.filter(s => s.name.toLowerCase().includes(q));
      
    filtered.forEach(student => {
      const row = document.createElement('div');
      row.className = '_rss_tiny_search_row';
      
      const initials = student.name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase();
      
      const avatarCircle = document.createElement('div');
      avatarCircle.className = '_rss_tiny_avatar_circle';
      avatarCircle.innerHTML = initials;
      
      const path = findPhoto(student.name);
      const cachedUrl = path ? photoCache[path] : null;
      if (cachedUrl) {
        avatarCircle.innerHTML = `<img src="${cachedUrl}" alt="${student.name}" />`;
      }
      
      const nameEl = document.createElement('div');
      nameEl.className = '_rss_tiny_name';
      nameEl.textContent = student.name;
      
      row.appendChild(avatarCircle);
      row.appendChild(nameEl);
      
      row.addEventListener('click', () => {
        if (!emailLists[activeEmailField].some(x => x.email.toLowerCase() === student.email.toLowerCase())) {
          emailLists[activeEmailField].push({ name: student.name, email: student.email });
          renderEmailTags();
        }
        closeTinySearch();
      });
      
      results.appendChild(row);
    });
  }

  emailModal.querySelector('#_rss_email_close').addEventListener('click', closeEmailModal);
  emailModal.querySelector('#_rss_email_cancel_btn').addEventListener('click', closeEmailModal);
  
  emailModal.querySelector('#_rss_email_send_btn').addEventListener('click', () => {
    const toEmails = emailLists.to.map(x => x.email).join(', ');
    const ccEmails = emailLists.cc.map(x => x.email).join(', ');
    const bccEmails = emailLists.bcc.map(x => x.email).join(', ');
    const subject = emailModal.querySelector('#_rss_email_subject').value.trim();
    const bodyText = emailModal.querySelector('#_rss_email_body_text').value.trim();
    
    if (emailLists.to.length === 0) {
      alert('Please specify at least one recipient in the "To" field.');
      return;
    }

    const sendBtn = emailModal.querySelector('#_rss_email_send_btn');
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';

    const htmlMessage = `<p>${bodyText.replace(/\n/g, '<br>')}</p>`;
    const formData = new FormData();
    formData.append("to", toEmails);
    formData.append("cc", ccEmails);
    formData.append("bcc", bccEmails);
    formData.append("subject", subject || 'No Subject');
    formData.append("message", htmlMessage);

    fetch("https://realm.stpatricks.qld.edu.au/mail/send",{method:"POST",body:formData,credentials:"include"})
    .then(res => {
      if (res.ok) {
        alert('Email sent successfully!');
        closeEmailModal();
      } else {
        alert('Failed to send email.');
      }
    })
    .catch(err => {
      console.error('Send mail error', err);
      alert('Failed to send email: ' + err.message);
    })
    .finally(() => {
      sendBtn.disabled = false;
      sendBtn.textContent = 'Send';
    });
  });

  emailModal.querySelectorAll('._rss_email_field_plus').forEach(btn => {
    btn.addEventListener('click', () => {
      activeEmailField = btn.dataset.field;
      openTinySearch();
    });
  });

  emailSearchPopup.querySelector('#_rss_tiny_search_close').addEventListener('click', closeTinySearch);
  emailSearchPopup.querySelector('._rss_tiny_search_input').addEventListener('input', (e) => {
    renderTinySearchResults(e.target.value);
  });

  root.querySelector('#_rss_refresh').addEventListener('click', async () => {
    studentData = null;
    dropboxToken = null;
    dropboxFiles = null;
    for (const key in photoCache) {
      delete photoCache[key];
    }

    const status = root.querySelector('#_rss_status');
    const isShowingResults = root.querySelector('#_rss_hint').style.display === 'none';

    if (currentMode === 'search') {
      if (isShowingResults && lastSearchTerm) {
        await runSearch(lastSearchTerm);
      } else {
        status.textContent = 'Refreshing...';
        try {
          await ensureDataLoaded();
          status.textContent = 'Ready';
        } catch (err) {
          status.textContent = 'Error: ' + (err.message || err);
        }
      }
    } else {
      if (selectedYearCode) {
        const activeBtn = ygSelector.querySelector(`._rss_yg_btn[data-code="${selectedYearCode}"]`);
        if (activeBtn) {
          activeBtn.click();
        }
      } else {
        status.textContent = 'Refreshing...';
        try {
          await ensureDataLoaded();
          status.textContent = 'Ready';
        } catch (err) {
          status.textContent = 'Error: ' + (err.message || err);
        }
      }
    }
  });

  root.querySelector('#_rss_reload_failed').addEventListener('click', () => retryAllFailed());

  async function retryAllFailed() {
    const allIndicators = root.querySelectorAll('._rss_photo_failed');
    if (!allIndicators.length) return;

    const failedContainers = [];
    allIndicators.forEach(container => {
      failedContainers.push(container);
    });
    if (!failedContainers.length) return;

    const btn = root.querySelector('#_rss_reload_failed');
    btn.style.opacity = '0.5';
    btn.disabled = true;

    // Run sequentially with a small delay to prevent rate-limiting Dropbox
    for (const container of failedContainers) {
      const studentId = container.dataset.studentId;
      const student = yearStudentsResolved.find(r => r.student.id === studentId)?.student 
                      || Object.values(studentData).find(s => s.id === studentId);
      if (!student) continue;

      const isGrid = container.classList.contains('_rss_yg_avatar');
      const cardOrGrid = isGrid ? container.closest('._rss_yg_card') : container.closest('._rss_profile_container');
      await handleManualReload(student, container, cardOrGrid);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    btn.style.opacity = '1';
    btn.disabled = false;
    updateReloadFailedVisibility();
  }

  /* ── Data Layer ─────────────────────────────────── */
  let studentData=null,dropboxToken=null,dropboxFiles=null;
  const photoCache={};
  let lastSearchTerm='';

  function updateReloadFailedVisibility() {
    const btn = root.querySelector('#_rss_reload_failed');
    if (!btn) return;
    const hasFailed = root.querySelector('._rss_photo_failed') !== null;
    btn.style.display = hasFailed ? 'flex' : 'none';
  }
  function impersonateStudent(studentName, photoUrl) {
    document.querySelectorAll('img').forEach(img => {
      if (!img.src.includes('portrait.php') && !img.dataset.rssImpersonated) return;
      img.dataset.rssImpersonated = 'true';
      img.src = photoUrl;
      if (img.getAttribute('srcset')) img.setAttribute('srcset', `${photoUrl} 200w, ${photoUrl} 500w`);
      img.style.objectFit = 'cover';
      img.style.objectPosition = '50% 65%';
      img.style.borderRadius = '0px';
    });
    
    const h1 =
      document.querySelector('div[data-collapsable="true"] .small-12.columns h1') ||
      document.querySelector('div[data-collapsable="true"] h1');
    if (h1) {
      const m = (h1.textContent || '').trim().match(/^(Good\s+\w+)\s*,/i);
      h1.innerHTML = `${m ? m[1] : 'Good Day'}, <strong> ${studentName}</strong>`;
    }
    
    const sep = document.querySelector('#account-content ul.profile-options li.separator');
    if (sep) sep.textContent = studentName;
    
    const anchor = document.querySelector('#profile-drop');
    if (anchor) anchor.setAttribute('title', studentName);

    const el = document.createElement('div');
    el.textContent = '✓ Done';
    el.style.cssText = 'position:fixed;top:24px;right:24px;background:#111;color:#fff;padding:12px 22px;border-radius:8px;font-size:15px;font-weight:600;z-index:2147483647;opacity:1;transition:opacity 0.6s;font-family:system-ui,sans-serif;';
    document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 700); }, 1800);

    // Silent Realm logout to apply impersonation on next page load
    try {
      const w = window.open('about:blank');
      if (w) {
        w.document.write('<iframe src="https://realm.stpatricks.qld.edu.au/logout" style="display:none"></iframe>');
        setTimeout(() => { w.close(); }, 75);
      }
    } catch (e) { console.warn('Silent logout failed', e); }
  }

  async function handleManualReload(student, avatarContainer, cardOrGridCard) {
    try {
      const path = findPhoto(student.name);
      if (!path) return;
      delete photoCache[path];
      
      avatarContainer.classList.remove('_rss_photo_failed');
      const url = await getUrlWithRetry(dropboxToken, path);
      if (url) {
        const isGrid = avatarContainer.classList.contains('_rss_yg_avatar');
        if (isGrid) {
          const nameEl = cardOrGridCard.querySelector('._rss_yg_name');
          if (nameEl) nameEl.classList.add('animated-name');
          loadImageWithRetry(avatarContainer, url, student.name, true);
          const record = yearStudentsResolved.find(r => r.student.id === student.id);
          if (record) record.photoUrl = url;
        } else {
          // Profile Details Page
          const nameEl = cardOrGridCard.querySelector('._rss_profile_name');
          if (nameEl) nameEl.classList.add('animated-name');
          loadImageWithRetry(avatarContainer, url, student.name, false, (resolvedUrl) => {
            const dlBtn = cardOrGridCard.querySelector('[data-a="dl"]');
            if (dlBtn) {
              dlBtn.disabled = false;
              dlBtn.classList.remove('_rss_soon');
              const newDlBtn = dlBtn.cloneNode(true);
              dlBtn.replaceWith(newDlBtn);
              newDlBtn.addEventListener('click', () => {
                const a = document.createElement('a'); a.href = resolvedUrl;
                a.download = `${student.name.replace(/ /g, '_')}.jpg`; a.target = '_blank';
                document.body.appendChild(a); a.click(); document.body.removeChild(a);
              });
            }
            const impBtn = cardOrGridCard.querySelector('[data-a="impersonate"]');
            if (impBtn) {
              impBtn.disabled = false;
              impBtn.classList.remove('_rss_soon');
              const newImpBtn = impBtn.cloneNode(true);
              impBtn.replaceWith(newImpBtn);
              newImpBtn.addEventListener('click', () => {
                impersonateStudent(student.name, resolvedUrl);
              });
            }
          });
        }
      }
    } catch (err) {
      console.error('Reload failed', err);
    } finally {
      updateReloadFailedVisibility();
    }
  }

  async function loadData(){
    const r=await fetch(GITHUB_URL);if(!r.ok)throw new Error('Failed to load student data');
    const map={};(await r.text()).split('\n').forEach(line=>{
      const m=line.trim().match(/^\[(.+)\]\s*-\s*(\d+)\s*-\s*(\d+)\s*-\s*(\S+)$/);if(!m)return;
      const name=m[1].trim(),id=m[2].trim(),year=parseInt(m[3]),email=m[4].trim();
      if(EXCLUDE.some(p=>name.toLowerCase().startsWith(p)))return;
      map[name.toLowerCase()]={name,id,year,email,yearLabel:YEAR_MAP[year]||`Code ${year}`};
    });return map;
  }
  async function getToken(){
    const r=await fetch('https://api.dropboxapi.com/oauth2/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:new URLSearchParams({grant_type:'refresh_token',refresh_token:DROPBOX_CONFIG.refreshToken,client_id:DROPBOX_CONFIG.appKey,client_secret:DROPBOX_CONFIG.appSecret})});
    const d=await r.json();if(!d.access_token)throw new Error('Auth failed');return d.access_token;
  }
  async function loadFileList(token){
    const map={};let cursor=null,hasMore=true;
    while(hasMore){const url=cursor?'https://api.dropboxapi.com/2/files/list_folder/continue':'https://api.dropboxapi.com/2/files/list_folder';
      const r=await fetch(url,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},
        body:JSON.stringify(cursor?{cursor}:{path:DROPBOX_CONFIG.folderPath,recursive:false,limit:2000})});
      const d=await r.json();if(!r.ok)throw new Error('list_folder failed');
      for(const e of d.entries||[]){if(e['.tag']!=='file'||!/\.(jpe?g|png)$/i.test(e.name))continue;
        map[e.name.replace(/\.(jpe?g|png)$/i,'').replace(/_/g,' ').toLowerCase().trim()]=e.path_display;}
      hasMore=!!d.has_more;cursor=d.cursor;}return map;
  }
  function findPhoto(name){
    const norm=name.toLowerCase().trim();if(dropboxFiles[norm])return dropboxFiles[norm];
    const words=norm.split(' ');for(const[k,p]of Object.entries(dropboxFiles)){if(words.every(w=>k.includes(w)))return p;}return null;
  }
  async function getUrl(token,path,signal){
    if(photoCache[path]) return photoCache[path];
    let url=null;
    try {
      const lr=await fetch('https://api.dropboxapi.com/2/sharing/list_shared_links',{
        method:'POST',
        headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type':'application/json'
        },
        body:JSON.stringify({path,direct_only:true}),
        signal
      });
      if(lr.ok){
        const ld=await lr.json();
        if(ld.links&&ld.links[0]){
          url=ld.links[0].url;
        }
      }
    } catch(e) {
      if (e.name === 'AbortError') throw e;
      console.warn('Error checking existing shared links', e);
    }
    if(!url){
      try {
        const cr=await fetch('https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings',{
          method:'POST',
          headers:{
            'Authorization':`Bearer ${token}`,
            'Content-Type':'application/json'
          },
          body:JSON.stringify({path,settings:{requested_visibility:'public'}}),
          signal
        });
        if(cr.ok){
          const cd=await cr.json();
          if(cd.url) url = cd.url;
        } else {
          try {
            const cd=await cr.json();
            if(cd.error?.['.tag']==='shared_link_already_exists'||cr.status===409){
              const lr=await fetch('https://api.dropboxapi.com/2/sharing/list_shared_links',{
                method:'POST',
                headers:{
                  'Authorization':`Bearer ${token}`,
                  'Content-Type':'application/json'
                },
                body:JSON.stringify({path,direct_only:true}),
                signal
              });
              if(lr.ok){
                const ld=await lr.json();
                url = ld.links?.[0]?.url||null;
              }
            }
          } catch(e){
            if (e.name === 'AbortError') throw e;
          }
        }
      } catch(e) {
        if (e.name === 'AbortError') throw e;
      }
    }
    if(url) {
      url = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
      if (url.includes('dl=0')) {
        url = url.replace('dl=0', 'raw=1');
      } else if (!url.includes('raw=1')) {
        url += (url.includes('?') ? '&' : '?') + 'raw=1';
      }
      photoCache[path]=url;
    }
    return url;
  }

  async function getUrlWithRetry(token,path,retries=3,signal){
    for(let i=0;i<retries;i++){
      try {
        if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
        const result = await getUrl(token,path,signal);
        if (result) return result;
        // null result — retry after backoff
        if(i===retries-1) return null;
        await new Promise((resolve, reject)=>{
          const t = setTimeout(resolve, 800 * (i+1));
          if (signal) {
            signal.addEventListener('abort', () => {
              clearTimeout(t);
              reject(new DOMException('Aborted', 'AbortError'));
            });
          }
        });
      } catch(err) {
        if (err.name === 'AbortError') throw err;
        if(i===retries-1) throw err;
        await new Promise((resolve, reject)=>{
          const t = setTimeout(resolve, 800 * (i+1));
          if (signal) {
            signal.addEventListener('abort', () => {
              clearTimeout(t);
              reject(new DOMException('Aborted', 'AbortError'));
            });
          }
        });
      }
    }
  }

  function parseQuery(raw){
    let term=raw.trim().toLowerCase();
    const lr=/\s*-\s*last\s*$/i;
    const lastMode=lr.test(term);
    if(lastMode)term=term.replace(lr,'').trim();
    
    const exactMode=term.endsWith('-');
    if(exactMode)term=term.slice(0,-1).trim();
    
    return{term,lastMode,exactMode};
  }
  function matches(nameLower,term,lastMode,exactMode){
    const parts = nameLower.split(' ');
    if (!lastMode) {
      if (exactMode) {
        return parts[0] === term;
      } else {
        return nameLower.startsWith(term);
      }
    } else {
      if (parts.length < 2) return false;
      const subWords = parts.slice(1);
      if (exactMode) {
        return subWords.some(w => w === term);
      } else {
        for (let i = 0; i < subWords.length; i++) {
          if (subWords.slice(i).join(' ').startsWith(term)) return true;
        }
        return false;
      }
    }
  }

  async function ensureDataLoaded(){
    if(studentData && dropboxToken && dropboxFiles) return;
    const status=root.querySelector('#_rss_status');
    status.textContent='Initialising...';
    [studentData,dropboxToken]=await Promise.all([loadData(),getToken()]);
    status.textContent='Loading photos...';
    dropboxFiles=await loadFileList(dropboxToken);
    status.textContent='Ready';
  }

  /* ── Image Loader with Retry ─────────────────────── */
  function loadImageWithRetry(container, src, studentName, isYearGroup, onLoadedSuccess) {
    const initials = studentName.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase();
    
    container.classList.add('_rss_loading_avatar');
    container.classList.remove('_rss_photo_failed');
    container.innerHTML = '';
    
    const img = document.createElement('img');
    if (!isYearGroup) img.className = '_rss_avatar';
    img.alt = studentName;
    img.style.cursor = isYearGroup ? 'default' : 'pointer';
    img.style.display = 'none'; // Hide until loaded
    container.appendChild(img);
    
    let retries = 0;
    const maxRetries = 3;
    const retryDelays = [1500, 3000, 6000];

    img.onload = () => {
      container.classList.remove('_rss_loading_avatar');
      container.innerHTML = '';
      img.style.display = isYearGroup ? '' : 'block';
      container.appendChild(img);
      
      if (!isYearGroup) {
        img.addEventListener('click', () => {
          openLightbox(src, studentName);
        });
      }
      if (onLoadedSuccess) onLoadedSuccess(src);
      updateReloadFailedVisibility();
    };

    img.onerror = () => {
      if (retries < maxRetries && !src.startsWith('blob:')) {
        const delay = retryDelays[retries];
        retries++;
        setTimeout(() => {
          const buster = `t_rss=${Date.now()}`;
          img.src = src + (src.includes('?') ? '&' : '?') + buster;
        }, delay);
      } else {
        container.classList.remove('_rss_loading_avatar');
        container.classList.add('_rss_photo_failed');
        container.innerHTML = isYearGroup ? `${initials}` : `<div class="_rss_avatar_fallback">${initials}</div>`;
        console.warn(`Failed to load image for ${studentName} after ${maxRetries} retries.`);
        img.remove();
        updateReloadFailedVisibility();
      }
    };

    img.src = src;
  }

  let previousMode = 'search';

  function createGridCard(student, photoUrl, isInactive, hideYearLabel) {
    const card = document.createElement('div');
    card.className = '_rss_yg_card';
    if (isInactive) card.classList.add('_rss_inactive_card');
    
    const initials = student.name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase();

    const avatarEl = document.createElement('div');
    avatarEl.className = '_rss_yg_avatar';
    avatarEl.dataset.studentName = student.name;
    avatarEl.dataset.studentId = student.id;

    if (photoUrl && photoUrl !== 'none') {
      loadImageWithRetry(avatarEl, photoUrl, student.name, true);
    } else if (photoUrl === 'none') {
      avatarEl.innerHTML = `${initials}`;
    } else {
      avatarEl.classList.add('_rss_loading_avatar');
      avatarEl.innerHTML = '';
    }

    const nameEl = document.createElement('div');
    nameEl.className = `_rss_yg_name${(photoUrl && photoUrl !== 'none') ? ' animated-name' : ''}`;
    nameEl.title = student.name;
    nameEl.textContent = student.name;

    const idEl = document.createElement('div');
    idEl.className = '_rss_yg_id';
    idEl.textContent = hideYearLabel ? `ID ${student.id}` : `${student.yearLabel} · ID ${student.id}`;

    card.appendChild(avatarEl);
    card.appendChild(nameEl);
    card.appendChild(idEl);

    if (isInactive) {
      const badge = document.createElement('div');
      badge.className = '_rss_yg_inactive_badge';
      badge.textContent = 'Inactive';
      card.appendChild(badge);
    }

    card.addEventListener('click', (e) => {
      if(currentLoadTimeoutId){
        clearTimeout(currentLoadTimeoutId);
        currentLoadTimeoutId=null;
      }
      showProfile(student, photoUrl, isInactive);
    });

    return card;
  }

  function showProfile(student, photoUrl, isInactive) {
    if (currentMode !== 'profile') {
      previousMode = currentMode;
    }
    setMode('profile');
    renderProfileCard(student, photoUrl, isInactive);
  }

  function renderProfileCard(student, photoUrl, isInactive) {
    const container = root.querySelector('#_rss_profile_card_container');
    container.innerHTML = '';

    const profileContainer = document.createElement('div');
    profileContainer.className = '_rss_profile_container';

    // Left Column: Avatar
    const leftCol = document.createElement('div');
    leftCol.className = '_rss_profile_left';

    const avatarContainer = document.createElement('div');
    avatarContainer.className = '_rss_profile_avatar_container';
    avatarContainer.dataset.studentId = student.id;
    avatarContainer.dataset.studentName = student.name;

    const initials = student.name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase();

    const enableActions = (resolvedUrl) => {
      const dlBtn = profileContainer.querySelector('[data-a="dl"]');
      if (dlBtn) {
        dlBtn.disabled = false;
        dlBtn.classList.remove('_rss_soon');
        const newDlBtn = dlBtn.cloneNode(true);
        dlBtn.replaceWith(newDlBtn);
        newDlBtn.addEventListener('click', () => {
          const downloadUrl = resolvedUrl.replace('raw=1', 'dl=1');
          const a = document.createElement('a'); a.href = downloadUrl;
          a.download = `${student.name.replace(/ /g, '_')}.jpg`; a.target = '_blank';
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
        });
      }
      const impersonateBtn = profileContainer.querySelector('[data-a="impersonate"]');
      if (impersonateBtn) {
        impersonateBtn.disabled = false;
        impersonateBtn.classList.remove('_rss_soon');
        const newImpBtn = impersonateBtn.cloneNode(true);
        impersonateBtn.replaceWith(newImpBtn);
        newImpBtn.addEventListener('click', () => {
          impersonateStudent(student.name, resolvedUrl);
        });
      }
    };

    if (photoUrl && photoUrl !== 'none') {
      loadImageWithRetry(avatarContainer, photoUrl, student.name, false, (resolvedUrl) => {
        enableActions(resolvedUrl);
      });
    } else {
      avatarContainer.innerHTML = `<div class="_rss_profile_avatar_fallback">${initials}</div>`;
    }

    leftCol.appendChild(avatarContainer);

    // Right Column: Info & Actions
    const rightCol = document.createElement('div');
    rightCol.className = '_rss_profile_right';

    // Name
    const nameEl = document.createElement('div');
    nameEl.className = `_rss_profile_name${(photoUrl && photoUrl !== 'none') ? ' animated-name' : ''}`;
    nameEl.textContent = student.name;
    rightCol.appendChild(nameEl);

    // Badge Row
    const badgeRow = document.createElement('div');
    badgeRow.className = '_rss_profile_badge_row';
    const statusBadge = document.createElement('span');
    if (isInactive) {
      statusBadge.className = '_rss_profile_badge inactive';
      statusBadge.textContent = 'No longer attending';
    } else {
      statusBadge.className = '_rss_profile_badge active';
      statusBadge.textContent = 'Active Student';
    }
    badgeRow.appendChild(statusBadge);
    
    // View Realm Profile Link
    const profileUrl=`https://realm.stpatricks.qld.edu.au/search/user/${student.id}`;
    const profileLink = document.createElement('a');
    profileLink.className = '_rss_view_profile_link';
    profileLink.href = profileUrl;
    profileLink.target = '_blank';
    profileLink.innerHTML = `${IC_PR} View Realm Profile`;
    badgeRow.appendChild(profileLink);

    rightCol.appendChild(badgeRow);

    // Info Grid
    const infoGrid = document.createElement('div');
    infoGrid.className = '_rss_profile_info_grid';
    infoGrid.innerHTML = `
      <div class="_rss_profile_info_label">Year Group</div>
      <div class="_rss_profile_info_value">${student.yearLabel}</div>
      <div class="_rss_profile_info_label">Student ID</div>
      <div class="_rss_profile_info_value">${student.id}</div>
      <div class="_rss_profile_info_label">Email</div>
      <div class="_rss_profile_info_value">${student.email}</div>
    `;
    rightCol.appendChild(infoGrid);

    // Actions
    const actionsGrid = document.createElement('div');
    actionsGrid.className = '_rss_profile_actions';
    actionsGrid.innerHTML = `
      <button class="_rss_profile_action_btn${(!photoUrl || photoUrl === 'none') ? ' _rss_soon' : ''}" data-a="dl"${(!photoUrl || photoUrl === 'none') ? ' disabled' : ''}>
        <span class="ic">${IC_DL}</span>
        <span class="lbl">Download Photo</span>
      </button>
      <button class="_rss_profile_action_btn${(!photoUrl || photoUrl === 'none') ? ' _rss_soon' : ''}" data-a="impersonate"${(!photoUrl || photoUrl === 'none') ? ' disabled' : ''}>
        <span class="ic">${IC_IM}</span>
        <span class="lbl">Impersonate</span>
      </button>
      <button class="_rss_profile_action_btn" data-a="email">
        <span class="ic">${IC_EM}</span>
        <span class="lbl">Send Email</span>
      </button>
      <button class="_rss_profile_action_btn" data-a="ms">
        <span class="ic">${IC_MS}</span>
        <span class="lbl">Microsoft 365</span>
      </button>
    `;

    // Event listeners
    if (photoUrl && photoUrl !== 'none') {
      const dlBtn = actionsGrid.querySelector('[data-a="dl"]');
      if (dlBtn) {
        dlBtn.addEventListener('click', () => {
          const downloadUrl = photoUrl.replace('raw=1', 'dl=1');
          const a = document.createElement('a'); a.href = downloadUrl;
          a.download = `${student.name.replace(/ /g, '_')}.jpg`; a.target = '_blank';
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
        });
      }
      const impersonateBtn = actionsGrid.querySelector('[data-a="impersonate"]');
      if (impersonateBtn) {
        impersonateBtn.addEventListener('click', () => {
          impersonateStudent(student.name, photoUrl);
        });
      }
    }

    actionsGrid.querySelector('[data-a="email"]').addEventListener('click', () => {
      openEmailModal(student);
    });

    actionsGrid.querySelector('[data-a="ms"]').addEventListener('click', () => {
      const targetUrl = "https://delve.office.com/?p=" + encodeURIComponent(student.email) + "&v=work";
      window.open(targetUrl, "_blank");
    });

    rightCol.appendChild(actionsGrid);

    profileContainer.appendChild(leftCol);
    profileContainer.appendChild(rightCol);
    container.appendChild(profileContainer);
  }

  /* ── Search ─────────────────────────────────────── */
  async function runSearch(raw){
    if(!raw||!raw.trim())return;
    setMode('search');
    lastSearchTerm = raw;
    const{term,lastMode,exactMode}=parseQuery(raw);
    const loading=root.querySelector('#_rss_loading'),status=root.querySelector('#_rss_status'),
      hint=root.querySelector('#_rss_hint'),
      curList=root.querySelector('#_rss_current_list'),
      empty=root.querySelector('#_rss_empty'),clearBtn=root.querySelector('#_rss_clearbtn'),
      queryDisplay=root.querySelector('#_rss_search_query_display');
    hint.style.display='none';curList.innerHTML='';
    if (queryDisplay) {
      queryDisplay.textContent = `Showing results for "${raw}"`;
      queryDisplay.style.display = 'block';
    }
    empty.style.display='none';loading.style.display='flex';
    status.textContent='Searching...';
    curList.style.display='grid';
    clearBtn.style.display='none';
    try{
      await ensureDataLoaded();
      const found=Object.values(studentData).filter(s=>matches(s.name.toLowerCase(),term,lastMode,exactMode));
      if(!found.length){
        loading.style.display='none';
        empty.style.display='block';
        status.textContent='No matches';
        status.dataset.lastSearchStatus = status.textContent;
        clearBtn.style.display='inline-flex';
        return;
      }
      const withPhotos=await Promise.all(found.map(async student=>{
        try{const path=findPhoto(student.name);const photoUrl=path?await getUrlWithRetry(dropboxToken,path):null;return{student,photoUrl};}
        catch{return{student,photoUrl:null};}
      }));
      const sort=(a,b)=>b.student.year-a.student.year;
      const active=withPhotos.filter(r=>r.photoUrl).sort(sort);
      loading.style.display='none';
      status.textContent=`${active.length} student${active.length!==1?'s':''} found`;
      status.dataset.lastSearchStatus = status.textContent;
      active.forEach(({student,photoUrl})=>{
        const card = createGridCard(student, photoUrl, false, false);
        curList.appendChild(card);
      });
      if(!active.length)empty.style.display='block';
      clearBtn.style.display='inline-flex';
    }catch(err){loading.style.display='none';status.textContent='Error: '+(err.message||err);status.dataset.lastSearchStatus = status.textContent;console.error(err);clearBtn.style.display='inline-flex';}
  }

  root.querySelector('#_rss_newbtn').addEventListener('click',()=>{
    const q=prompt('Enter student name:');if(q)runSearch(q);
  });

  root.querySelector('#_rss_clearbtn').addEventListener('click',()=>{
    root.querySelector('#_rss_current_list').innerHTML='';
    const queryDisplay=root.querySelector('#_rss_search_query_display');
    if (queryDisplay) {
      queryDisplay.style.display='none';
      queryDisplay.textContent='';
    }
    root.querySelector('#_rss_hint').style.display='block';
    root.querySelector('#_rss_empty').style.display='none';
    root.querySelector('#_rss_status').textContent='Ready';
    delete root.querySelector('#_rss_status').dataset.lastSearchStatus;
    root.querySelector('#_rss_clearbtn').style.display='none';
  });

  /* ── Mode Switching ──────────────────────────────── */
  let currentMode='search';

  function setMode(mode){
    currentMode=mode;
    root.querySelectorAll('._rss_mode_tab').forEach(btn=>{
      btn.classList.toggle('active', btn.dataset.mode===mode);
    });

    const searchView=root.querySelector('#_rss_search_view');
    const ygView=root.querySelector('#_rss_yg_view');
    const profileView=root.querySelector('#_rss_profile_view');
    const clearBtn=root.querySelector('#_rss_clearbtn');
    const status=root.querySelector('#_rss_status');
    const mainTitle=root.querySelector('#_rss_main_title');

    if(mode==='search'){
      searchView.style.display='block';
      ygView.style.display='none';
      if (profileView) profileView.style.display='none';
      if (mainTitle) mainTitle.textContent = 'Search';
      
      const isShowingResults = root.querySelector('#_rss_hint').style.display === 'none';
      clearBtn.style.display = isShowingResults ? 'inline-flex' : 'none';
      
      status.textContent = isShowingResults ? (status.dataset.lastSearchStatus || 'Ready') : 'Ready';
    } else if (mode==='year') {
      searchView.style.display='none';
      ygView.style.display='block';
      if (profileView) profileView.style.display='none';
      if (mainTitle) mainTitle.textContent = 'Year Group Browse';
      clearBtn.style.display='none';
      
      if(selectedYearCode && yearStudents && yearStudents.length > 0){
        status.textContent = `${yearStudents.length} student${yearStudents.length!==1?'s':''} found`;
        renderYearGroupGrid();
      } else {
        status.textContent = 'Ready';
        root.querySelector('#_rss_yg_hint').style.display='block';
        root.querySelector('#_rss_yg_search_container').style.display='none';
        root.querySelector('#_rss_yg_grid').innerHTML='';
        root.querySelector('#_rss_yg_empty').style.display='none';
      }
    } else if (mode==='profile') {
      searchView.style.display='none';
      ygView.style.display='none';
      if (profileView) profileView.style.display='block';
      if (mainTitle) mainTitle.textContent = 'Student Profile';
      clearBtn.style.display='none';
      status.textContent = 'Viewing Profile';
    }
  }

  root.querySelectorAll('._rss_mode_tab').forEach(tab=>{
    tab.addEventListener('click',()=>setMode(tab.dataset.mode));
  });

  /* ── Year Group Browse Implementation ────────────── */
  const YEARS=[
    {code:33, label:'Year 5'},
    {code:32, label:'Year 6'},
    {code:31, label:'Year 7'},
    {code:30, label:'Year 8'},
    {code:29, label:'Year 9'},
    {code:28, label:'Year 10'},
    {code:27, label:'Year 11'},
    {code:26, label:'Year 12'}
  ];

  let selectedYearCode=null;
  let yearStudents=[]; 
  let yearStudentsResolved=[]; 
  let currentLoadTimeoutId=null;
  let activeLoadController=null;

  const ygSelector=root.querySelector('#_rss_yg_selector');
  ygSelector.innerHTML=YEARS.map(y=>`<button class="_rss_yg_btn" data-code="${y.code}">${y.label}</button>`).join('');

  async function loadBatchOfStudents(students, signal) {
    return await Promise.all(students.map(async student => {
      try {
        const path = findPhoto(student.name);
        const photoUrl = path ? await getUrlWithRetry(dropboxToken, path, 3, signal) : null;
        return { student, photoUrl: photoUrl || 'none' };
      } catch(err) {
        if (err.name === 'AbortError') throw err;
        console.error('Failed photo load for student', student.name, err);
        return { student, photoUrl: 'none' };
      }
    }));
  }

  ygSelector.querySelectorAll('._rss_yg_btn').forEach(btn=>{
    btn.addEventListener('click',async()=>{
      if(currentLoadTimeoutId){
        clearTimeout(currentLoadTimeoutId);
        currentLoadTimeoutId=null;
      }

      if (activeLoadController) {
        activeLoadController.abort();
      }
      activeLoadController = new AbortController();
      const signal = activeLoadController.signal;

      ygSelector.querySelectorAll('._rss_yg_btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');

      selectedYearCode=parseInt(btn.dataset.code);
      const clickedYearCode=selectedYearCode;
      
      const ygLoading=root.querySelector('#_rss_yg_loading');
      const ygGrid=root.querySelector('#_rss_yg_grid');
      const ygEmpty=root.querySelector('#_rss_yg_empty');
      const ygHint=root.querySelector('#_rss_yg_hint');
      const ygSearchContainer=root.querySelector('#_rss_yg_search_container');
      const status=root.querySelector('#_rss_status');

      ygGrid.innerHTML='';
      ygEmpty.style.display='none';
      ygHint.style.display='none';
      ygSearchContainer.style.display='none';

      ygLoading.style.display='flex';
      status.textContent = 'Collecting year group...';

      try {
        await ensureDataLoaded();
        if(clickedYearCode !== selectedYearCode || signal.aborted) return;

        yearStudents=Object.values(studentData).filter(s=>s.year===selectedYearCode && !!findPhoto(s.name));
        yearStudents.sort((a,b)=>a.name.localeCompare(b.name));

        const count = yearStudents.length;
        if(count === 0){
          ygLoading.style.display='none';
          ygEmpty.style.display='block';
          status.textContent='0 students found';
          return;
        }

        // Load 10 at a time with a small cooldown. Wait for 40 (or all if < 40) before stopping the spinner.
        const resolvedFirst = [];
        const targetCount = Math.min(40, count);
        
        const progressText = ygLoading.querySelector('p');
        if (progressText) progressText.textContent = 'This may take a moment... 0%';

        for (let i = 0; i < targetCount; i += 10) {
          if (clickedYearCode !== selectedYearCode || signal.aborted) return;
          if (i > 0) {
            await new Promise((resolve, reject) => {
              const t = setTimeout(resolve, 400);
              signal.addEventListener('abort', () => {
                clearTimeout(t);
                reject(new DOMException('Aborted', 'AbortError'));
              });
            });
            if (clickedYearCode !== selectedYearCode || signal.aborted) return;
          }
          const batchStudents = yearStudents.slice(i, i + 10);
          const resolvedBatch = await loadBatchOfStudents(batchStudents, signal);
          resolvedFirst.push(...resolvedBatch);

          const pct = Math.round((resolvedFirst.length / targetCount) * 100);
          if (progressText) progressText.textContent = `This may take a moment... ${pct}%`;
        }

        if(clickedYearCode !== selectedYearCode || signal.aborted) return;

        yearStudentsResolved = [
          ...resolvedFirst,
          ...yearStudents.slice(resolvedFirst.length).map(s => ({ student: s, photoUrl: undefined }))
        ];

        ygLoading.style.display='none';
        ygSearchContainer.style.display='block';
        status.textContent = `${count} student${count!==1?'s':''} found`;

        renderYearGroupGrid();

        if (yearStudents.length > resolvedFirst.length) {
          currentLoadTimeoutId = setTimeout(() => {
            loadRemainingBatches(clickedYearCode, resolvedFirst.length, signal);
          }, 400);
        }

      } catch(err) {
        if (err.name === 'AbortError') return; // Silent abort
        ygLoading.style.display='none';
        status.textContent='Error: '+(err.message||err);
        console.error(err);
      }
    });
  });

  const ygSearchInput=root.querySelector('#_rss_yg_search_input');
  ygSearchInput.addEventListener('input',()=>renderYearGroupGrid());

  function renderYearGroupGrid(){
    const ygGrid=root.querySelector('#_rss_yg_grid');
    const ygEmpty=root.querySelector('#_rss_yg_empty');
    const query=ygSearchInput.value.trim().toLowerCase();

    const filtered=yearStudentsResolved.filter(({student})=>student.name.toLowerCase().includes(query));
    ygGrid.innerHTML='';

    if(filtered.length===0){
      ygEmpty.style.display='block';
      return;
    }
    ygEmpty.style.display='none';

    filtered.forEach(({student, photoUrl}) => {
      const card = createGridCard(student, photoUrl, false, true);
      ygGrid.appendChild(card);
    });
  }

  /* ── Background Batch Processing ───────────────────── */
  async function loadRemainingBatches(yearCode, startIndex, signal) {
    if (yearCode !== selectedYearCode || signal?.aborted) return;

    const batchSize = 10;
    const batch = yearStudents.slice(startIndex, startIndex + batchSize);
    if (batch.length === 0) return; 

    try {
      const resolvedBatch = await loadBatchOfStudents(batch, signal);

      if (yearCode !== selectedYearCode || signal?.aborted) return;

      resolvedBatch.forEach(({ student, photoUrl }) => {
        const idx = yearStudentsResolved.findIndex(r => r.student.id === student.id);
        if (idx !== -1) {
          yearStudentsResolved[idx].photoUrl = photoUrl;
        }
        
        const avatarEl = root.querySelector(`._rss_yg_avatar[data-student-name="${student.name.replace(/"/g, '\\"')}"]`);
        if (avatarEl) {
          avatarEl.classList.remove('_rss_loading_avatar');
          if (photoUrl && photoUrl !== 'none') {
            const ygCard = avatarEl.closest('._rss_yg_card');
            if (ygCard) {
              const nameEl = ygCard.querySelector('._rss_yg_name');
              if (nameEl) nameEl.classList.add('animated-name');
            }
            loadImageWithRetry(avatarEl, photoUrl, student.name, true);
          } else {
            const initials = student.name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase();
            avatarEl.innerHTML = `${initials}`;
          }
        }
      });

      if (startIndex + batchSize < yearStudents.length) {
        currentLoadTimeoutId = setTimeout(() => {
          loadRemainingBatches(yearCode, startIndex + batchSize, signal);
        }, 400);
      }
    } catch(err) {
      if (err.name === 'AbortError') return;
      console.error(err);
    }
  }

  /* ── DevTools Detection & Anti-Debugging ─────────── */
  // Block right-clicks to prevent "Inspect Element" via mouse menu (no reload)
  window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  window.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      window.location.reload();
    }
    // Ctrl+Shift+I / J / C (Windows/Linux)
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c' || e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
      e.preventDefault();
      window.location.reload();
    }
    // Cmd+Option+I / J / C (macOS)
    if (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c' || e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
      e.preventDefault();
      window.location.reload();
    }
  });

  // Dimension-based devtools detection (controls lock overlay blur instead of reload)
  function detectDevTools() {
    const threshold = 160;
    const isDevToolsOpen = (window.outerWidth - window.innerWidth > threshold) || 
                           (window.outerHeight - window.innerHeight > threshold);
    
    const overlay = root.querySelector('#_rss_lock_overlay');
    if (overlay) {
      if (isDevToolsOpen) {
        overlay.classList.add('active');
      } else {
        overlay.classList.remove('active');
      }
    }
  }

  // Set up resize listener and interval checks
  window.addEventListener('resize', detectDevTools);
  setInterval(detectDevTools, 300);
  detectDevTools();

  // Print updated console warning banner on startup
  console.clear();
  for (let i = 0; i < 100; i++) {
    console.log("%cCLOSE!", "font-size: 32px; font-weight: 900; color: #ef4444; font-family: sans-serif;");
  }

})();