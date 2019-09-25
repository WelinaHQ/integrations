const addGithubUserToTeam = require('../lib/github/add-user-to-team');

module.exports = (req, res) => {
  console.log("hook endpoint", req.body);

  const { member, metadata } = req.body;

  addGithubUserToTeam({ member, metadata });

  res.json({
    success: true
  });
};
