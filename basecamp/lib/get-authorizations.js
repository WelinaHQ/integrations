const fetch = require("node-fetch");

async function getAuthorizations(tokenInfo) {
  const res = await fetch(`https://launchpad.37signals.com/authorization.json`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "User-Agent": "Welina Integration (matthieu@welina.io)",
      "Authorization": `Bearer ${tokenInfo.access_token}`
    }
  });

  const response = await res.json();

  return response;
}

module.exports = getAuthorizations;

