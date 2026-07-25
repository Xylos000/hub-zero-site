(function() {
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

  var script = document.createElement('script');
  script.src = scriptSrc;
  document.body.appendChild(script);
})();
