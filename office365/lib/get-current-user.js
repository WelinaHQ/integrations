const fetch = require("node-fetch");

async function getAuthorizations(tokenInfo) {
  const res = await fetch(`https://graph.microsoft.com/v1.0/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Authorization": `Bearer ${tokenInfo.access_token}`
    }
  });

  const response = await res.json();
  console.log('response', response);

  return response;
}

module.exports = getAuthorizations;
