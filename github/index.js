const { htm, withUiHook } = require("@welina/integration-utils");
const qs = require("querystring");

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, ROOT_URL } = process.env;

async function completeOAuthProcess(code) {
  const url = `https://github.com/login/oauth/access_token`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json"
    },
    body: qs.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code
    })
  });

  if (response.status !== 200) {
    throw new Error(
      `Invalid status code on GitHub token fetching: ${
        response.status
      } error: ${await response.text()}`
    );
  }

  const tokenInfo = await response.json();
  if (tokenInfo.error) {
    throw new Error(`GitHub OAuth issue: ${tokenInfo.error_description}`);
  }

  return tokenInfo;
}

const resolvers = {
  connect: async ({ welinaClient, payload }) => {
    const code = payload.query.code;
    const tokenInfo = completeOAuthProcess(code);
    welinaClient.udpateMetaData({ tokenInfo });
  },
  onFirstStartingDay: ({}) => {
    // Hook
  },
  onDepartureDay: ({}) => {
    // Hook
  }
};

module.exports = withUiHook(async options => {
  console.log("options", options);
  const { payload, welinaClient } = options;
  const { action, clientState } = payload;

  console.log("action", action);
  console.log("clientState", clientState);

  const resolver = resolvers[action];

  if (resolver) {
    return await resolver({ welinaClient, payload });
  }

  const connectUrl = `https://connect-with-github}`;
  return htm`
    <Page>
     <Link href=${connectUrl}>Connect With GitHub</Link>
    </Page>
  `;
});
