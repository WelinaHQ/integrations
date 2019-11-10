const fetch = require("node-fetch");
const qs = require("query-string");
// const getAuthorizations = require("./get-authorizations");

const { ROOT_URL, OFFICE_CLIENT_ID, OFFICE_CLIENT_SECRET } = process.env;

async function completeOAuthProcess({ code, welinaClient, metadata }) {
  console.log("completeOAuthProcess...", code);
  const params = qs.stringify({
    client_id: OFFICE_CLIENT_ID,
    scope: "offline_access openid User.Read Directory.Read.All User.Invite.All User.ReadWrite.All",
    code,
    redirect_uri: `${ROOT_URL}/callback`,
    grant_type: "authorization_code",
    client_secret: OFFICE_CLIENT_SECRET
  });

  const url = `https://login.microsoftonline.com/common/oauth2/v2.0/token`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params
    });

    const response = await res.json();
    console.log("completeOAuthProcess res", response);

    if (!response.access_token) {
      throw new Error(`Invalid status code on office365 token fetching`);
    }

    metadata.office365TokenInfo = response;
    // const authorizations = await getAuthorizations(metadata.office365TokenInfo);
    // console.log('authorizations', authorizations);
    // const account = authorizations.accounts[authorizations.accounts.length - 1];
    // metadata.account = account;
    await welinaClient.setMetadata(metadata);
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}

module.exports = completeOAuthProcess;
