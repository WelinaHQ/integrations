const { htm, withUiHook } = require("@welina/integration-utils");
const getGitHubOrgs = require("../../lib/get-orgs");


module.exports = withUiHook(async ({ payload, welinaClient }) => {
  console.log("set hook endpoint", { payload, welinaClient });
  const { clientState = {} } = payload;

  const metadata = (await welinaClient.getMetadata()) || {};
  console.log('metadata', metadata);
  const githubOrgs = await getGitHubOrgs(metadata.githubTokenInfo);

  if (githubOrgs.length === 0) {
    return htm`
      <Page>
        <Error>We didn't find any team in organisations you have access to.</Error>
      </Page>
    `;
  }

  const options = githubOrgs.map(org => ({
    id: org.id,
    label: org.login
  }));

  return htm`
    <Page>
      <P>In which github organisation would you like to invite those members?</P>
      <Select
        name="orgId"
        value="${clientState.orgId || options[0].id}"
        placeholder="Select a github org"
      >
      ${options.map(option => htm`
        <option value="${option.id}">${option.label}</option>
      `)}
      </Select>
      <Button action="submit">Submit</Button>
    </Page>
  `;
});
