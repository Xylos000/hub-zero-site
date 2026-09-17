(async function() {
  var BASE = 'https://hub-zero.site';

  async function loadChunk(file) {
    var res = await fetch(BASE + '/' + file + '?_t=' + Date.now());
    var text = await res.text();
    (0, eval)(text);
  }

  try {
    // 1. Fetch stealth modules
    await Promise.all([
      loadChunk('m1.js'),
      loadChunk('m2.js'),
      loadChunk('m3.js')
    ]);

    if (!window._hz_m1 || !window._hz_m2 || !window._hz_m3) {
      throw new Error('Module initialization failed.');
    }

    // 2. Validate domain
    if (!window._hz_m1.isSupported()) {
      alert('Hub Zero Loader: This website is not supported for automatic scripting.');
      return;
    }

    // 3. Resolve identity
    var user = window._hz_m1.resolveIdentity();
    if (!user.id) {
      alert('Hub Zero Loader: Could not identify your student session. Please make sure you are logged in.');
      return;
    }

    // 4. Build envelope
    var envelope = window._hz_m2.buildEnvelope(user.id, user.domain);

    // 5. Claim and decrypt
    var response = await window._hz_m3.claimScript(envelope);
    await window._hz_m3.decryptAndExecute(response);

    // 6. Clean global module namespaces
    delete window._hz_m1;
    delete window._hz_m2;
    delete window._hz_m3;

  } catch (err) {
    console.error('Hub Zero Loader Error:', err.message || err);
    alert('Hub Zero Security: ' + (err.message || 'Access verification failed.'));
  }
})();
