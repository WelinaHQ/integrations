const fetch = require("node-fetch");

async function addToProject(metadata, { name, email, title, company }) {
  const url = `https://3.basecampapi.com/${metadata.account.id}/projects/${metadata.project}/people/users.json`;
  console.log("url", url);
  const data = {
    create: [
      {
        name,
        email_address: email,
        title,
        company_name: company
      }
    ]
  };
  console.log('data', data);

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      Accept: "application/json",
      "User-Agent": "Welina (matthieu@welina.io)",
      Authorization: `Bearer ${metadata.basecampTokenInfo.access_token}`
    },
    body: JSON.stringify(data)
  });

  const response = await res.json();
  console.log("response", response);

  return response;
}

module.exports = addToProject;
