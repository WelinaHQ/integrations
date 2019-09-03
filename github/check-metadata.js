const { htm, withUiHook } = require("@welina/integration-utils");
const getGitHubTeams = require("./lib/github/get-teams");


module.exports = withUiHook(async ({ payload, welinaClient }) => {
  const { clientState = {} } = payload;

  const metadata = (await welinaClient.getMetadata()) || {};
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

  clientState.test = "wahoo";

  return htm`
    <Page>
      <P>In which github team would you like to add those members?</P>
      <Select
        name="team"
        value="${clientState.teamId}"
        placeholder="Select a github team"
      >
      ${options.map(option => htm`
        <option value="${option.id}">${option.label}</option>
      `)}
      </Select>
      <Button action="submit">Submit</Button>
    </Page>
  `;
});
