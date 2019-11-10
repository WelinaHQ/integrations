const fetch = require("node-fetch");

async function inviteUser(metadata, { email }) {
  const url = `https://graph.microsoft.com/v1.0/invitations`;

  const data = {
    accountEnabled: true,
    displayName: "https://welina.io"
  };
  console.log("data", data);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${metadata.office365TokenInfo.access_token}`
    },
    body: JSON.stringify(data)
  });

  const response = await res.json();
  console.log("response", response);

  return response;
}

module.exports = inviteUser;
