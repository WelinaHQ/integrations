const { htm, withUiHook } = require("@welina/integration-utils");

module.exports = withUiHook(async ({ payload, welinaClient }) => {
  const metadata = (await welinaClient.getMetadata()) || {};

  if (!metadata.apiKey) {
    return htm`
      <Page>
        <Link href="/integrations/sendgrid">Configuration needed</Link>
      </Page>
    `;
  }

  return htm`
    <Page>
      <Input name="fromEmail" placeholder="Sender email (from:)" mb="4" />
      <Input name="templateId" placeholder="Sendgrid template id" mb="4" />
      <Box mb="2">
        <Radio id="perso" name="emailUsed" value="perso" mr="1" defaultChecked />
        <label for="perso">Send to employee personal email address</label>
      </Box>
      <Box mb="2">
        <Radio id="pro" name="emailUsed" value="pro" mr="1" />
        <label for="pro">Send to employee professional email address</label>
      </Box>
      <P>
        Those variables can be used inside your template:
        <ul>
          <li>first_name</li>
          <li>ending_date</li>
          <li>personal_email</li>
          <li>professional_email</li>
          <li>starting_date</li>
          <li>last_name</li>
          <li>github_username</li>
          <li>linkedin_username</li>
          <li>organisation_id</li>
        </ul>
      </P>
      <Button action="submit">Submit</Button>
    </Page>
  `;
});
