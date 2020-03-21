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
        <Radio id="perso" name="emailUsed" value="perso" mr="1" />
        <label for="perso">Send to employee personal email address</label>
      </Box>
      <Box mb="2">
        <Radio id="pro" name="emailUsed" value="pro" mr="1" />
        <label for="pro">Send to employee professional email address</label>
      </Box>
      <P>
        Those variables can be used inside your template:
        <ul>
          <li>first_name</ul>
          <li>ending_date</ul>
          <li>personal_email</ul>
          <li>professional_email</ul>
          <li>starting_date</ul>
          <li>last_name</ul>
          <li>github_username</ul>
          <li>linkedin_username</ul>
          <li>organisation_id</ul>
        </ul>
      </P>
      <Button action="submit" invert>Submit</Button>
    </Page>
  `;
});
