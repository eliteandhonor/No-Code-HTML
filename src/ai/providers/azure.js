(function (global) {
  const ENDPOINT = 'https://ominisender.com/wp-json/azurechat/v1/completions';

  async function send(payload) {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Server responded with status ' + response.status);
    }
    return response.json();
  }

  global.aiProviders = global.aiProviders || {};
  global.aiProviders.azure = { send };
})(typeof window !== 'undefined' ? window : globalThis);
