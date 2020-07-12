const addToProject = require('../../lib/add-to-project');

module.exports = async (req, res) => {
  const { member, metadata } = req.body;

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
    const result = await addToProject(metadata, params);
    res.json({
      success: true,
    });
  } catch (error) {
    console.log('error', error);
  }
};
