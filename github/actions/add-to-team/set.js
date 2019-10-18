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
    throw new Error("Aborted because member don't have a github username");
  }

  const result = await octokit.teams.addOrUpdateMembership({
    team_id: metadata.team,
    username,
    mediaType: {
      previews: ["dazzler", "dazzler-preview"]
    }
  });

  console.log("result", result);

  res.json({
    success: true
  });
};
