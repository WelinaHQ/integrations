const fetch = require("node-fetch");
const getProjectPeople = require("./get-project-people");

async function removeFromProject(metadata, { email }) {

  const people = await getProjectPeople(metadata);
  console.log('people', people);
  const person = people.find(p => p.email_address === email);
  
  const url = `https://3.basecampapi.com/${metadata.account.id}/projects/${metadata.project}/people/users.json`;
  console.log("url", url);
  const data = {
    revoke: [person.id]
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

module.exports = removeFromProject;
