const fetch = require("node-fetch");

async function getProjects(metadata) {
  const res = await fetch(`https://3.basecampapi.com/${metadata.account.id}/projects.json`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "User-Agent": "Welina (matthieu@welina.io)",
      "Authorization": `Bearer ${metadata.basecampTokenInfo.access_token}`
    }
  });

  const response = await res.json();
  console.log('response', response);

  return response;
}

module.exports = getProjects;
