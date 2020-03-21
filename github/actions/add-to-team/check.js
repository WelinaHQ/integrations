const { htm, withUiHook } = require("@welina/integration-utils");
const getGitHubTeams = require("../../lib/get-teams");

module.exports = withUiHook(async ({ payload, welinaClient }) => {
  const { clientState = {} } = payload;

  console.log("welinaClient", welinaClient);

  const metadata = (await welinaClient.getMetadata()) || {};
  console.log("metadata", metadata);

  if (!metadata.githubTokenInfo) {
    return htm`
      <Page>
        <Link href="https://welina.io/integrations/github">Configuration needed</Link>
      </Page>
    `;
  }

  const githubTeams = await getGitHubTeams(metadata.githubTokenInfo);

  if (githubTeams.length === 0) {
    return htm`
      <Page>
        <Error>We didn't find any team in organizations you have access to.</Error>
      </Page>
    `;
  }

  const options = githubTeams.map(team => ({
    id: team.id,
    organizationId: team.organization.login,
    label: `${team.organization.login} > ${team.name}`
  }));

  return htm`
    <Page>
      <Text mb="4">In which github team would you like to add those employees?</Text>
      <Text mb="4"><strong>Warning:</strong> task will only work to employees having a github username!</Text>
      <Select
        name="team"
        value="${clientState.teamId || options[0].id}"
        placeholder="Select a github team"
      >
      ${options.map(
        option => htm`
        <Option value="${option.id}" label="${option.label}" />
      `
      )}
      </Select>
      <Button action="submit" mt="4">Submit</Button>
    </Page>
  `;
});
