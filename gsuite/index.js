const { htm, withUiHook } = require("@welina/integration-utils");
const completeOAuthProcess = require("./lib/complete-oauth");
const getDomains = require("./lib/get-domains");

const { ROOT_URL } = process.env;

const actions = {
  disconnect: async ({ welinaClient }) => {
    const metadata = await welinaClient.getMetadata();
    delete metadata.githubTokenInfo;
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

  if (!metadata.googleTokenInfo && payload.query && payload.query.code) {
    await completeOAuthProcess({
      code: payload.query.code,
      welinaClient,
      metadata
    });
  }

  if (metadata.googleTokenInfo) {
    const domains = await getDomains(metadata.googleTokenInfo);
    return htm`
      <Page>
        <P>Connected domain${domains.length > 1 ? "s" : ""}:</P>
        <ul>
          ${domains.map(
            domain => htm`
            <li>${domain.domainName}</li>
          `
          )}
        </ul>
      </Page>
		`;
  }

  const connectUrl = `${ROOT_URL}/connect?next=${encodeURIComponent(
    payload.installationUrl
  )}`;

  return htm`
    <Page>
     <Link href=${connectUrl}>Connect With Google</Link>
    </Page>
  `;
});
