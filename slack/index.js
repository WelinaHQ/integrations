const { htm, withUiHook } = require("@welina/integration-utils");

const actions = {
  submitInviteLink: async ({ welinaClient, payload }) => {
    console.log("submitInviteLink", payload);
    const { clientState } = payload;
    console.log("clientState", clientState);
    const metadata = await welinaClient.getMetadata();
    metadata.invitationLink = clientState.invitationLink;
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
  const { action } = payload;

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

  if (metadata.invitationLink) {
    return htm`
      <Page>
        <P>Slack invitation link: ${metadata.invitationLink}</P>
      </Page>
		`;
  }

  return htm`
    <Page>
      <P>Slack Invitation Link:</P>
      <Box>
       <Input name="invitationLink" placeholder="Ex: https://join.slack.com/t/workspace/shared_invite/code" />
      </Box>
      <Button action="submitInviteLink" invert>Submit</Button>
    </Page>
  `;
});
