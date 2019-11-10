const fetch = require("node-fetch");

async function removeFromOrganisation(metadata, { email }) {
  console.log("removeFromOrganisation", email);

  const url = `https://graph.microsoft.com/v1.0/users/${email}`;
  console.log("url", url);

  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${metadata.office365TokenInfo.access_token}`
    }
  });

  console.log('res', res, res.status);

  if (res.status === 204) {
    return {};
  } else if (res.status !== 204) {
    throw new Error(`Error deleting user with email: ${email}`);
  }

  const response = await res.json();
  return res.json();
}

module.exports = removeFromOrganisation;
