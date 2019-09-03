const Octokit = require("@octokit/rest");

async function getTeams(githubTokenInfo) {
  try {
    const octokit = new Octokit({
      auth: `token ${githubTokenInfo.access_token}`,
      previews: ["mercy-preview"]
    });

    const listTeamsData = await octokit.teams.listForAuthenticatedUser();

    return listTeamsData.data;
  } catch (error) {
    console.log('error', error);
    if (error.status === 404) {
      return [];
    }
  }
};

module.exports = getTeams;
