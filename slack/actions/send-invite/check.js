const { htm, withUiHook } = require("@welina/integration-utils");

module.exports = withUiHook(async ({ payload, welinaClient }) => {
  const metadata = (await welinaClient.getMetadata()) || {};

  console.log("metadata", metadata);

  if (!metadata.invitationLink) {
    return htm`
      <Page>
        <Link href="/integrations/slack">Configuration needed</Link>
      </Page>
    `;
  }

  return htm`
    <Page>
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
      <Button action="submit" invert>Submit</Button>
    </Page>
  `;
});
