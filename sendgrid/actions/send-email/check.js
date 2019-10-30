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
      <Input name="fromEmail" placeholder="Sender email" />
      <Input name="templateId" placeholder="Sendgrid template id" />
      <div>
        <Input type="radio" id="perso" name="emailUsed" value="perso" />
        <label for="perso">Use personal email</label>
      </div>
      <div>
        <Input type="radio" id="pro" name="emailUsed" value="pro" />
        <label for="pro">Use professional email</label>
      </div>
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
