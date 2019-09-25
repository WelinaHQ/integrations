const Octokit = require("@octokit/rest");
const { get } = require("dot-prop");

async function addUserToTeam({ member, metadata }) {
  const octokit = new Octokit({
    auth: `token ${get(metadata, "githubTokenInfo.access_token")}`,
    userAgent: "octokit/rest.js v1.2.3",
    previews: ["mercy-preview"]
  });

  const username = member.github_username;
  console.log("username", username);

  if (!username) {
    console.log("aborting because member don't have a github username");
    return false;
  }

  try {
    const result = await octokit.teams.addOrUpdateMembership({
      team_id: metadata.team,
      username,
      mediaType: {
        previews: ["dazzler", "dazzler-preview"]
      }
    });

    console.log("result", result);

    return { success: true };
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

module.exports = addUserToTeam;
