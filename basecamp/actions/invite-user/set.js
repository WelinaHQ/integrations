const addToProject = require("../../lib/add-to-project");

module.exports = async (req, res) => {
  const { member, metadata } = req.body;
  console.log("member", member);

  const {
    last_name,
    first_name,
    professional_email,
    personal_email,
    organisation,
    team
  } = member;

  await addToProject(metadata, {
    name: `${first_name} ${last_name}`,
    email: metadata.emailUsed === "pro" ? professional_email : personal_email,
    title: team.name,
    company: organisation.name
  });

  res.json({
    success: true
  });
};
