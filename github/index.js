const { htm, withUiHook } = require("@welina/integration-utils");
const completeOAuthProcess = require("./lib/complete-oauth");
const getGitHubUser = require("./lib/get-user");

const { ROOT_URL } = process.env;

const resolvers = {
  disconnect: async ({ welinaClient }) => {
    delete metadata.githubTokenInfo;
    await welinaClient.setMetadata(metadata);
  }
};

module.exports = withUiHook(async options => {
  const { payload, welinaClient } = options;
  const { action, clientState } = payload;

  if (action) {
    const resolver = resolvers[action];

    if (resolver) {
      return await resolver({ welinaClient, payload });
    }

    throw new Error(`Sorry, resolver ${action} does not exist.`)
  }

  const metadata = (await welinaClient.getMetadata()) || {};

  if (!metadata.githubTokenInfo && payload.query && payload.query.code) {
    await completeOAuthProcess({
      code: payload.query.code,
      welinaClient,
      metadata
    });
  }

  if (metadata.githubTokenInfo) {
    const githubUser = await getGitHubUser(metadata.githubTokenInfo);
    return htm`
			<Page>
				<P>Connected with GitHub user:
					<Link target="_blank" href=${"https://github.com/" +
            githubUser.login}>${githubUser.name || githubUser.login}</Link>
				</P>
				<Box><Img src=${githubUser["avatar_url"]} width="64"/></Box>
				<Button small action="disconnect">Disconnect</Button>
			</Page>
		`;
  }

  const connectUrl = `${ROOT_URL}/connect?next=${encodeURIComponent(
    payload.installationUrl
  )}`;

  return htm`
    <Page>
     <Link href=${connectUrl}>Connect With GitHub</Link>
    </Page>
  `;
});
