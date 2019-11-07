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
      <div>
        <Input type="radio" id="perso" name="emailUsed" value="perso" />
        <label for="perso">Use personal email</label>
      </div>
      <div>
        <Input type="radio" id="pro" name="emailUsed" value="pro" />
        <label for="pro">Use professional email</label>
      </div>
      <Button action="submit" invert>Submit</Button>
    </Page>
  `;
});
