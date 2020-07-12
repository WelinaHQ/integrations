const fetch = require("node-fetch");
const getProjectPeople = require("./get-project-people");

async function removeFromProject(metadata, { email }) {
  console.log('removeFromProject', email);
  const people = await getProjectPeople(metadata);
  const person = people.find(p => p.email_address === email);
  console.log('person', person);
  
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
      "User-Agent": "Welina Integration (matthieu@welina.io)",
      Authorization: `Bearer ${metadata.basecampTokenInfo.access_token}`
    },
    body: JSON.stringify(data)
  });

  const response = await res.json();
  console.log("response", response);

  return response;
}

module.exports = removeFromProject;
