const fetch = require('node-fetch');

async function getGitHubUser(tokenInfo) {
  const url = `https://api.github.com/user`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenInfo["access_token"]}`
    }
  });

  return response.json();
}

module.exports = getGitHubUser;
