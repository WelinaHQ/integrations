const { htm, withUiHook } = require("@welina/integration-utils");
const getProjects = require("../../lib/get-projects");

module.exports = withUiHook(async ({ payload, welinaClient }) => {
  const { clientState = {} } = payload;

  const metadata = (await welinaClient.getMetadata()) || {};

  if (!metadata.basecampTokenInfo) {
    return htm`
      <Page>
        <Link href="https://welina.io/integrations/basecamp">Configuration needed</Link>
      </Page>
    `;
  }

  const basecampProject = await getProjects(metadata);

  const options = basecampProject.map(project => ({
    id: project.id,
    label: project.name
  }));

  return htm`
    <Page>
      <P>In which Basecamp project would you like to add those members?</P>
      <Select
        name="project"
        value="${clientState.projectId || options[0].id}"
        placeholder="Select a Basecamp project"
      >
      ${options.map(
        option => htm`
        <option key="${option.id}" value="${option.id}">${option.label}</option>
      `
      )}
      </Select>
      <Button action="submit">Submit</Button>
    </Page>
  `;
});
