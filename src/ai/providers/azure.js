(function (global) {
  const ENDPOINT = 'https://ominisender.com/wp-json/azurechat/v1/completions';

  async function send(payload) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error('Server responded with status ' + response.status);
      }
      return response.json();
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  global.aiProviders = global.aiProviders || {};
  global.aiProviders.azure = { send };
})(typeof window !== 'undefined' ? window : globalThis);
