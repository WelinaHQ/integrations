const { withClient } = require('@welina/integration-utils');
const addToProject = require('../../lib/add-to-project');
const refreshAndSaveToken = require('../../lib/refresh-save-token');

module.exports = withClient(async (options) => {
  const { payload, welinaClient } = options;
  const { member, metadata } = payload;

  const {
    last_name,
    first_name,
    professional_email,
    personal_email,
    organisation,
    team,
  } = member;

  const params = {
    name: `${first_name} ${last_name}`,
    email: metadata.emailUsed === 'pro' ? professional_email : personal_email,
    title: team.name,
    company: organisation.name,
  };

  try {
    const newMetadata = await refreshAndSaveToken(metadata.basecampTokenInfo.refresh_token, {
      metadata,
      welinaClient,
    });
    const result = await addToProject(newMetadata, params);
    return {
      success: true,
      result,
    };
  } catch (error) {
    console.log('error', error);
  }
});
