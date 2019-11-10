const fetch = require("node-fetch");

async function getProjectPeople(metadata) {
  const url = `https://3.basecampapi.com/${metadata.account.id}/projects/${metadata.project}/people.json`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "User-Agent": "Welina (matthieu@welina.io)",
      "Authorization": `Bearer ${metadata.basecampTokenInfo.access_token}`
    }
  });

  const response = await res.json();

  return response;
}

module.exports = getProjectPeople;
