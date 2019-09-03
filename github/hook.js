const addGithubUserToTeam = require('./lib/github/add-user-to-team');

module.exports = (req, res) => {
  console.log("hook endpoint", req.body);

  const { actionId, metadata } = req.body;

  console.log('metadata', metadata);
  
  if (actionId === 'githubAddToTeam') {
    addGithubUserToTeam()
  }

  res.json({
    success: true
  });
};
