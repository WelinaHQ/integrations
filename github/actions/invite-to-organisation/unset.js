const Octokit = require("@octokit/rest");
const { get } = require("dot-prop");

module.exports = async (req, res) => {
  const { member, metadata } = req.body;

  const org = get(metadata, "orgId_label");
  const username = get(member, "github_username");

  try {
    const octokit = new Octokit({
      auth: `token ${get(metadata, "githubTokenInfo.access_token")}`,
      userAgent: "Welina",
      previews: ["mercy-preview"]
    });

    const result = await octokit.orgs.removeMember({
      org,
      username
    })

    console.log("result", result);

    res.json({
      success: true
    });
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};
