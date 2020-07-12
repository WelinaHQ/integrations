const fetch = require("node-fetch");
const qs = require("query-string");

const { BASECAMP_CLIENT_ID, BASECAMP_CLIENT_SECRET } = process.env;

async function refreshAndSaveToken(refreshToken, { welinaClient, metadata }) {
  const params = qs.stringify({
    type: 'refresh',
    refresh_token: refreshToken,
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

  if (response.access_token) {
    const newMetadata = {
      ...metadata,
      basecampTokenInfo: {
        ...(metadata.basecampTokenInfo || {}),
        access_token: response.access_token,
      },
    };

    await welinaClient.setMetadata(newMetadata);
    return newMetadata;
  }

  return metadata;
}

module.exports = refreshAndSaveToken;
