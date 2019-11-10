const fetch = require("node-fetch");
const qs = require("query-string");

const { ROOT_URL, OFFICE_CLIENT_ID, OFFICE_CLIENT_SECRET } = process.env;

async function refreshToken({ welinaClient, metadata }) {
  const params = qs.stringify({
    client_id: OFFICE_CLIENT_ID,
    scope: "offline_access openid User.Read Directory.Read.All User.Invite.All User.ReadWrite.All",
    refresh_token: metadata.office365TokenInfo.refresh_token,
    redirect_uri: `${ROOT_URL}/callback`, 
    grant_type: "refresh_token",
    client_secret: OFFICE_CLIENT_SECRET
  });

  const url = `https://login.microsoftonline.com/common/oauth2/v2.0/token`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });

  const response = await res.json();
  console.log('response', response);

  if (!response.access_token) {
    throw new Error(`Error refreshing office365 token`);
  }

  metadata.office365TokenInfo = response;
  await welinaClient.setMetadata(metadata);
  return metadata;
}

module.exports = refreshToken;
