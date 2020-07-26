const { htm, withUiHook } = require('@welina/integration-utils');
const shortid = require('shortid');

module.exports = withUiHook(async ({ payload, welinaClient }) => {
  const shortId = shortid.generate();

  return htm`
    <Page>
      <P>A Zap can now be created referencing this Welina Zap #ID: <strong>${shortId}</strong></P>
      <Input name="zapId" type="hidden" value="${shortId}" disabled />

      <Button mb="6" as="a" variant="invert-blue" href="https://zapier.com/developer/public-invite/111971/e58b589f96cc0e3f5279dd59fdd03e83/" target="_blank">
        Create a Zap using Welina Integration
      </Button>
      <Button action="submit">Continue</Button>
    </Page>
  `;
});
