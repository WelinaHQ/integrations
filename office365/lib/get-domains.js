const fetch = require("node-fetch");

async function getDomains(tokenInfo) {
  const res = await fetch(`https://graph.microsoft.com/v1.0/domains`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Authorization": `Bearer ${tokenInfo.access_token}`
    }
  });

  const response = await res.json();
  console.log('response', response);

  return response.value;
}

module.exports = getDomains;
