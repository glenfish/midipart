// disable.js

document.body.innerHTML = `
  <div style="padding:2rem;font-family:sans-serif;color:#fff;background:#111;text-align:center">
    <h1>🔒 This tool is no longer available</h1>
    <p>If you believe this is an error, please contact support.</p>
  </div>
`;

console.warn("🚫 App disabled by remote check.");
window.stop?.(); // Stops further script execution (best effort)
