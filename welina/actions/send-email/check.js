const { htm, withUiHook } = require('@welina/integration-utils');

module.exports = withUiHook(() => {
  return htm`
    <Page>
      <Input name="fromEmail" placeholder="Sender email (from:)" mb="4" />
      <Box mb="2">
        <Radio id="perso" name="emailUsed" value="perso" mr="1" defaultChecked />
        <label for="perso">Send to employee personal email address</label>
      </Box>
      <Box mb="2">
        <Radio id="pro" name="emailUsed" value="pro" mr="1" />
        <label for="pro">Send to employee professional email address</label>
      </Box>
      <Button action="submit">Submit</Button>
    </Page>
  `;
});
