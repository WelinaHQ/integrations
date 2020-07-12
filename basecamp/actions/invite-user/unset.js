const { withClient } = require('@welina/integration-utils');
const removeFromProject = require('../../lib/remove-from-project');
const refreshAndSaveToken = require('../../lib/refresh-save-token');

module.exports = withClient(async (options) => {
  const { payload, welinaClient } = options;
  const { member, metadata } = payload;

  console.log('member', member);
  console.log('metadata', metadata);

  const { professional_email, personal_email } = member;

  const newMetadata = await refreshAndSaveToken(metadata.basecampTokenInfo.refresh_token, {
    metadata,
    welinaClient,
  });
  await removeFromProject(newMetadata, {
    email: metadata.emailUsed === 'pro' ? professional_email : personal_email,
  });

  return {
    success: true,
  };
});
