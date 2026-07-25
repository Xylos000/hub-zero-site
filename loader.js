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
    return;
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

  var isEP = href.indexOf('educationperfect.com') !== -1;

  if (isEP) {
    if (window.fetch) {
      window.fetch(scriptSrc)
        .then(function(r) { return r.text(); })
        .then(function(code) { eval(code); })
        .catch(function(err) { console.error('Hub Zero Loader: Failed to load EP script.', err); });
    } else {
      // Fallback
      var script = document.createElement('script');
      script.src = scriptSrc;
      document.body.appendChild(script);
    }
  } else {
    var script = document.createElement('script');
    script.src = scriptSrc;
    document.body.appendChild(script);
  }
})();
