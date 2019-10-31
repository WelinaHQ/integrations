const { htm, withUiHook } = require("@welina/integration-utils");
const client = require("@sendgrid/client");

const actions = {
  submitApiKey: async ({ welinaClient, payload }) => {
    console.log("payload", payload);
    const { clientState } = payload;
    console.log("clientState", clientState);
    const metadata = await welinaClient.getMetadata();
    metadata.apiKey = clientState.apiKey;
    await welinaClient.setMetadata(metadata);
  },
  disconnect: async ({ welinaClient }) => {
    const metadata = await welinaClient.getMetadata();
    delete metadata.githubTokenInfo;
    await welinaClient.setMetadata(metadata);
  }
};

module.exports = withUiHook(async options => {
  const { payload, welinaClient } = options;
  const { action, clientState } = payload;

  if (action) {
    const resolver = actions[action];

    if (resolver) {
      await resolver({ welinaClient, payload });
    } else {
      throw new Error(`Sorry, resolver ${action} does not exist.`);
    }
  }

  const metadata = await welinaClient.getMetadata();
  console.log("metadata", metadata);

  if (metadata.apiKey) {
    client.setApiKey(metadata.apiKey);
    const request = {
      method: "GET",
      url: "/v3/user/email"
    };
    const [_, body] = await client.request(request);

    return htm`
      <Page>
        <P>Connected with Sendgrid user: ${body.email}</P>
        <P>
          Those variables can be used inside your templates:
          <ul>
            <li>first_name</ul>
            <li>ending_date</ul>
            <li>personal_email</ul>
            <li>professional_email</ul>
            <li>starting_date</ul>
            <li>last_name</ul>
            <li>github_username</ul>
            <li>linkedin_username</ul>
            <li>organisation_id</ul>
          </ul>
        </P>
      </Page>
		`;
  }

  return htm`
    <Page>
      <P>Your Sendgrid api key:</P>
      <Box>
        <Input name="apiKey" placeholder="api key" />
      </Box>
      <Button action="submitApiKey" invert>Submit</Button>
    </Page>
  `;
});
