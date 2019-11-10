const removeFromProject = require("../../lib/remove-from-project");

module.exports = async (req, res) => {
  const { member, metadata } = req.body;

  console.log("member", member);
  console.log("metadata", metadata);

  const { professional_email, personal_email } = member;

  await removeFromProject(metadata, {
    email: metadata.emailUsed === "pro" ? professional_email : personal_email
  });

  res.json({
    success: true
  });
};
