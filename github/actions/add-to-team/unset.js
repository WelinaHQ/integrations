const Octokit = require("@octokit/rest");
const { get } = require("dot-prop");

module.exports = async (req, res) => {
  const { member, metadata } = req.body;

  const octokit = new Octokit({
    auth: `token ${get(metadata, "githubTokenInfo.access_token")}`,
    userAgent: "Welina"
  });

  const username = member.github_username;

  if (!username) {
    console.log("aborting because member don't have a github username");
    return res.json({
      success: true
    });
  }

  const result = await octokit.teams.removeMembership({
    team_id: metadata.team,
    username
  });

  res.json({
    success: true
  });
};
