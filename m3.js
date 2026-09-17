// ─── Module 3: Network Dispatcher & In-Memory Decryption ───
window._hz_m3 = (function() {
  var SB_URL = 'https://inolfvjpiktmrhqyvnsh.supabase.co';
  var SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlub2xmdmpwaWt0bXJocXl2bnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MjU5NDUsImV4cCI6MjEwMDUwMTk0NX0.gurNKy0vtMfVMW-To_2kyvMpQhEPpq7bKkJnyNN2qAc';

  async function claimScript(envelope) {
    var res = await fetch(SB_URL + '/rest/v1/rpc/claim_secure_script', {
      method: 'POST',
      headers: {
        'apikey': SB_ANON,
        'Authorization': 'Bearer ' + SB_ANON,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(envelope)
    });

    if (!res.ok) {
      var err = await res.text();
      throw new Error('Claim failed: ' + err);
    }

    var json = await res.json();
    if (!json.success) {
      throw new Error(json.error || 'Access denied by security gateway.');
    }

    return json;
  }

  async function decryptAndExecute(payloadWrapper) {
    var payloadObj = typeof payloadWrapper.payload === 'string' ? JSON.parse(payloadWrapper.payload) : payloadWrapper.payload;
    var ivHex = payloadObj.iv;
    var dataHex = payloadObj.data;
    var tagHex = payloadObj.tag;

    var salt = new TextEncoder().encode('hub_zero_vault_salt_2026');
    var pass = new TextEncoder().encode('089091');

    var keyMaterial = await crypto.subtle.importKey(
      'raw',
      pass,
      'PBKDF2',
      false,
      ['deriveKey']
    );

    var derivedKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    function hexToBytes(hex) {
      var bytes = new Uint8Array(hex.length / 2);
      for (var i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
      }
      return bytes;
    }

    var ivBytes = hexToBytes(ivHex);
    var combinedCipher = hexToBytes(dataHex + tagHex);

    var decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivBytes },
      derivedKey,
      combinedCipher
    );

    var code = new TextDecoder().decode(decryptedBuffer);

    // True in-memory direct execution
    window._hz_vault_authorized = true;
    try {
      (0, eval)(code);
    } finally {
      delete window._hz_vault_authorized;
    }

    // Wipe memory traces
    code = null;
    decryptedBuffer = null;
    combinedCipher = null;
  }

  return {
    claimScript: claimScript,
    decryptAndExecute: decryptAndExecute
  };
})();
