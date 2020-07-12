const fetch = require("node-fetch");
const qs = require("query-string");

const { BASECAMP_CLIENT_ID, BASECAMP_CLIENT_SECRET } = process.env;

async function refreshToken(tokenInfo) {
  const params = qs.stringify({
    type: 'refresh',
    refresh_token: tokenInfo.refresh_token,
    client_id: BASECAMP_CLIENT_ID,
    client_secret: BASECAMP_CLIENT_SECRET
  });

  const res = await fetch(`https://launchpad.37signals.com/authorization/token?${params}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      }
    });

  const response = await res.json();

  return response;
}

module.exports = refreshToken;
