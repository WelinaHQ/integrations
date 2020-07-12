const { htm, withUiHook } = require('@welina/integration-utils');
const completeOAuthProcess = require('./lib/complete-oauth');
const getAuthorizations = require('./lib/get-authorizations');
const refreshToken = require('./lib/refresh-token');

const { ROOT_URL } = process.env;

const actions = {
  disconnect: async ({ welinaClient }) => {
    const metadata = await welinaClient.getMetadata();
    delete metadata.basecampTokenInfo;
    await welinaClient.setMetadata(metadata);
  },
};

module.exports = withUiHook(async (options) => {
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

  if (!metadata.basecampTokenInfo && payload.query && payload.query.code) {
    await completeOAuthProcess({
      code: payload.query.code,
      welinaClient,
      metadata,
    });
  }

  if (metadata.basecampTokenInfo) {
    let authorizations = await getAuthorizations(metadata.basecampTokenInfo);
    if (authorizations && authorizations.error) {
      const refreshRes = await refreshToken(metadata.basecampTokenInfo);

      if (refreshRes.access_token) {
        const newMetadata = {
          ...metadata,
          basecampTokenInfo: {
            ...(metadata.basecampTokenInfo || {}),
            access_token: refreshRes.access_token,
          },
        };
        authorizations = await getAuthorizations(newMetadata.basecampTokenInfo);
        await welinaClient.setMetadata(newMetadata);
      }
    }
    return htm`
      <Page>
        <P>Connected with user: ${authorizations.identity.email_address}</P>
        <P>Authorized account: ${metadata.account.name} (${metadata.account.id})</P>
      </Page>
		`;
  }

  const connectUrl = `${ROOT_URL}/connect?next=${encodeURIComponent(
    payload.installationUrl
  )}`;

  return htm`
    <Page>
      <Button as="a" variant="blue" href=${connectUrl}>Connect With Basecamp</Link>
    </Page>
  `;
});
