const { htm, withUiHook } = require("@welina/integration-utils");
const completeOAuthProcess = require("./lib/complete-oauth");
const getCurrentUser = require("./lib/get-current-user");
const refreshToken = require("./lib/refresh-token");

const { ROOT_URL } = process.env;

const actions = {
  disconnect: async ({ welinaClient }) => {
    const metadata = await welinaClient.getMetadata();
    delete metadata.office365TokenInfo;
    await welinaClient.setMetadata(metadata);
  }
};

module.exports = withUiHook(async options => {
  const { payload, welinaClient } = options;
  const { action } = payload;

  if (action) {
    const resolver = actions[action];

    if (resolver) {
      return await resolver({ welinaClient, payload });
    }

    throw new Error(`Sorry, resolver ${action} does not exist.`);
  }

  const metadata = await welinaClient.getMetadata();

  if (!metadata.office365TokenInfo && payload.query && payload.query.code) {
    await completeOAuthProcess({
      code: payload.query.code,
      welinaClient,
      metadata
    });
  }

  if (metadata.office365TokenInfo) {
    const profileRes = await getCurrentUser(metadata.office365TokenInfo);

    if (profileRes.error) {
      if (profileRes.error.message === "Access token has expired.") {
        const updatedData = await refreshToken({ welinaClient, metadata });
        profileRes = await getCurrentUser(metadata.office365TokenInfo);
  
        if (profileRes.error) {
          throw new Error(profileRes.error);
        }
      } else {
        throw new Error(profileRes.error);
      }
    }

    console.log('profileRes', profileRes);
    return htm`
      <Page>
        <P>Connected with user: ${profileRes.userPrincipalName}</P>
      </Page>
		`;
  }

  const connectUrl = `${ROOT_URL}/connect?next=${encodeURIComponent(
    payload.installationUrl
  )}`;

  return htm`
    <Page>
     <Link href=${connectUrl}>Connect With Office 365</Link>
    </Page>
  `;
});
