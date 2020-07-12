const fetch = require("node-fetch");
const qs = require("query-string");
const getAuthorizations = require("./get-authorizations");

const { ROOT_URL, BASECAMP_CLIENT_ID, BASECAMP_CLIENT_SECRET } = process.env;

async function completeOAuthProcess({ code, welinaClient, metadata }) {
  const params = qs.stringify({
    type: 'web_server',
    client_id: BASECAMP_CLIENT_ID,
    client_secret: BASECAMP_CLIENT_SECRET,
    redirect_uri: `${ROOT_URL}/callback`,
    code
  });

  const url = `https://launchpad.37signals.com/authorization/token?${params}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
      }
    });

    const response = await res.json();
    console.log('response', response);
  
    if (!response.access_token) {
      throw new Error(`Invalid status code on basecamp token fetching`);
    }

    metadata.basecampTokenInfo = response;
    const authorizations = await getAuthorizations(metadata.basecampTokenInfo);
    console.log('authorizations', authorizations);
    const account = authorizations.accounts[authorizations.accounts.length - 1];
    metadata.account = account;
    await welinaClient.setMetadata(metadata);
  } catch(error) {
    console.log('error', error)
    throw error;
  }
}

module.exports = completeOAuthProcess;
