const { htm, withUiHook } = require("@welina/integration-utils");

module.exports = withUiHook(async ({ payload, welinaClient }) => {
  const { clientState = {} } = payload;

  const metadata = (await welinaClient.getMetadata()) || {};

  if (!metadata.office365TokenInfo) {
    return htm`
      <Page>
        <Link href="https://welina.io/integrations/office365">Configuration needed</Link>
      </Page>
    `;
  }

  return htm`
    <Page>
      <Box mb="4">
        <div>
          <Radio type="radio" id="perso" name="emailUsed" value="perso" />
          <label for="perso">Invite sent to personal email</label>
        </div>
        <div>
          <Radio type="radio" id="pro" name="emailUsed" value="pro" />
          <label for="pro">Invite sent to professional email</label>
        </div>
      </Box>
      <Button action="submit">Submit</Button>
    </Page>
  `;
});
