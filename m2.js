// ─── Module 2: Cryptographic Envelope & Nonce Packager ───
window._hz_m2 = (function() {
  function generateNonce() {
    var arr = new Uint8Array(16);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(arr);
    } else {
      for (var i = 0; i < 16; i++) arr[i] = Math.floor(Math.random() * 256);
    }
    return Array.from(arr).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
  }

  function getTimestamp() {
    return Date.now();
  }

  function buildEnvelope(studentId, domain) {
    var nonce = generateNonce();
    var ts = getTimestamp();
    var rawSig = studentId + ':' + ts + ':' + nonce + ':' + domain;

    return {
      p_student_id: String(studentId),
      p_domain: String(domain),
      p_timestamp: ts,
      p_nonce: nonce,
      p_signature: rawSig
    };
  }

  return {
    generateNonce: generateNonce,
    getTimestamp: getTimestamp,
    buildEnvelope: buildEnvelope
  };
})();
