const { htm, withUiHook } = require("@welina/integration-utils");
const completeOAuthProcess = require("./lib/complete-oauth");
const getGitHubUser = require("./lib/get-user");

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

    throw new Error(`Sorry, resolver ${action} does not exist.`)
  }

  const metadata = await welinaClient.getMetadata();

  if (!metadata.githubTokenInfo && payload.query && payload.query.code) {
    await completeOAuthProcess({
      code: payload.query.code,
      welinaClient,
      metadata
    });
  }

  if (metadata.githubTokenInfo) {
    const githubUser = await getGitHubUser(metadata.githubTokenInfo);
    // <Img src=${githubUser["avatar_url"]} width="64"/>
    return htm`
			<Page>
				<P>Connected with Github user:</P>
        <P>
          <Link target="_blank" href=${"https://github.com/" + githubUser.login}>${githubUser.name || githubUser.login}</Link>
				</P>
				<Button variant="invert-red" action="disconnect">Disconnect</Button>
			</Page>
		`;
  }

  const connectUrl = `${ROOT_URL}/connect?next=${encodeURIComponent(
    payload.installationUrl
  )}`;

  return htm`
    <Page>
      <Button as="a" variant="blue" href=${connectUrl}>Connect With GitHub</Link>
    </Page>
  `;
});
