const { htm, withUiHook } = require("@welina/integration-utils");
const getGitHubTeams = require("../../lib/get-teams");

module.exports = withUiHook(async ({ payload, welinaClient }) => {
  const { clientState = {} } = payload;

  const metadata = (await welinaClient.getMetadata()) || {};

  if (!metadata.googleTokenInfo) {
    return htm`
      <Page>
        <Link href="https://welina.io/integrations/github">Configuration needed</Link>
      </Page>
    `;
  }

  return htm`
    <Page>
      <Button action="submit">Submit</Button>
    </Page>
  `;
});
