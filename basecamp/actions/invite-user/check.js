const { htm, withUiHook } = require('@welina/integration-utils');
const getProjects = require('../../lib/get-projects');
const refreshAndSaveToken = require('../../lib/refresh-save-token');

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

  const newMetadata = await refreshAndSaveToken(metadata.basecampTokenInfo.refresh_token, { metadata, welinaClient })

  const projects = await getProjects(newMetadata);

  if (!projects.length) {
    return htm`
      <Page>
        <Text>Sorry but we didn't found any project in your Basecamp organization</Text>
      </Page>
    `;
  }

  const options = projects.map((project) => ({
    id: project.id,
    label: project.name,
  }));

  return htm`
    <Page>
      <P>In which Basecamp project would you like to add those members?</P>
      <Select
        mb="4"
        name="project"
        value="${clientState.projectId || options[0].id}"
        placeholder="Select a Basecamp project"
      >
      ${options.map(
        (option) => htm`
        <Option key="${option.id}" value="${option.id}" label="${option.label}" />
      `
      )}
      </Select>
      <Box mb="4">
        <div>
          <Radio id="perso" name="emailUsed" value="perso" />
          <label for="perso">Use personal email</label>
        </div>
        <div>
          <Radio id="pro" name="emailUsed" value="pro" />
          <label for="pro">Use professional email</label>
        </div>
      </Box>
      <Button action="submit">Save Task</Button>
    </Page>
  `;
});
