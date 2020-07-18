const { htm, withUiHook } = require('@welina/integration-utils');

module.exports = withUiHook(() => {
  return htm`
    <Page>
      <i>This integration doesn't need any configuration.</i>
    </Page>
  `;
});
