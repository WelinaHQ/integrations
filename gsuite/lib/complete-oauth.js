const { google } = require("googleapis");
const getDomains = require("./get-domains");

const { ROOT_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

async function completeOAuthProcess({ code, welinaClient, metadata }) {
  const auth = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    `${ROOT_URL}/callback`
  );

  try {
    const response = await auth.getToken(decodeURIComponent(code));

    if (!response.tokens) {
      throw new Error(`Invalid status code on google token fetching`);
    }


    metadata.googleTokenInfo = response.tokens;
    console.log('response.tokens', response.tokens);

    auth.setCredentials(metadata.googleTokenInfo);
    const domains = await getDomains(metadata.googleTokenInfo);
    metadata.domainName = domains[0].domainName;

    await welinaClient.setMetadata(metadata);
  } catch(error) {
    console.log('error', error)
    throw error;
  }
}

module.exports = completeOAuthProcess;
