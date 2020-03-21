const { htm, withUiHook } = require("@welina/integration-utils");
const getDomains = require('../../lib/get-domains');

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

  const domains = await getDomains(metadata.office365TokenInfo);

  const options = domains.map(domain => ({
    id: domain.id,
    label: domain.id
  }));

  return htm`
    <Page>
      <P>To which Office 365 domain would you like to add those members?</P>
      <Select
        name="domain"
        value="${clientState.domain || options[0].id}"
        placeholder="Select Office 365 domain to use"
      >
      ${options.map(
        option => htm`
        <Option key="${option.id}" value="${option.id}" label="${option.label}" />
      `
      )}
      </Select>
      <Button action="submit">Submit</Button>
    </Page>
  `;
});
