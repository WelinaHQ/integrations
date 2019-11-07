const { withClient } = require("@welina/integration-utils");
const removeFromProject = require("../../lib/remove-from-project");

module.exports = withClient(async options => {
  const { payload } = options;
  const { member, metadata } = payload;

  console.log("member", member);

  const { professional_email, personal_email } = member;

  await removeFromProject(metadata, {
    email: metadata.emailUsed === "pro" ? professional_email : personal_email
  });

  return {
    success: true
  };
});
