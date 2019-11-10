const fetch = require("node-fetch");

async function createUser(metadata, { email, firstName, lastName, password }) {
  const url = `https://graph.microsoft.com/v1.0/users`;

  const data = {
    accountEnabled: true,
    displayName: `${firstName} ${lastName}`,
    userPrincipalName: email,
    mailNickname: `${firstName}${lastName}`,
    passwordProfile: {
      forceChangePasswordNextSignIn: true,
      forceChangePasswordNextSignInWithMfa: false,
      password
    }
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

module.exports = createUser;
