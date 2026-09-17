// ─── Module 1: Environment & Identity Detection ───
window._hz_m1 = (function() {
  function getDomain() {
    return (window.location.hostname || '').toLowerCase();
  }

  function isSupported() {
    var d = getDomain();
    return d.indexOf('stpatricks.qld.edu.au') !== -1 || d.indexOf('educationperfect.com') !== -1;
  }

  function resolveIdentity() {
    var name = 'Unknown';
    var id = '';

    // 1. Schoolbox / Realm Detection
    if (window.schoolboxUser) {
      if (window.schoolboxUser.fullName) name = window.schoolboxUser.fullName;
      if (window.schoolboxUser.externalId) id = String(window.schoolboxUser.externalId);
    }
    
    // Check DOM meta / data attributes for Schoolbox
    if (!id) {
      var metaId = document.querySelector('meta[name="user-id"], meta[name="schoolbox-user"]');
      if (metaId && metaId.content) id = String(metaId.content);
    }

    // 2. Education Perfect Angular / UserService Detection
    if (!id) {
      try {
        var epInjector = window.angular && window.angular.element(document.body) && window.angular.element(document.body).injector();
        var epUser = epInjector && epInjector.get('UserService') && epInjector.get('UserService').currentUser;
        if (epUser) {
          if (epUser.name) name = epUser.name;
          if (epUser.id || epUser.externalId) id = String(epUser.id || epUser.externalId);
        }
      } catch (e) {}
    }

    // 3. Fallback to LocalStorage cache
    if (!id) {
      var cachedId = localStorage.getItem('ep_hub_verified_id') || localStorage.getItem('hz_student_id');
      if (cachedId) id = String(cachedId);
      var cachedName = localStorage.getItem('ep_hub_verified_name') || localStorage.getItem('hz_student_name');
      if (cachedName) name = String(cachedName);
    }

    return { id: id.trim(), name: name.trim(), domain: getDomain() };
  }

  return {
    getDomain: getDomain,
    isSupported: isSupported,
    resolveIdentity: resolveIdentity
  };
})();
