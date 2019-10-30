const Octokit = require("@octokit/rest");

async function getOrgs(githubTokenInfo) {
  try {
    const octokit = new Octokit({
      auth: `token ${githubTokenInfo.access_token}`,
      userAgent: "Welina",
      previews: ["mercy-preview"]
    });

    const listOrgsData = await octokit.orgs.listForAuthenticatedUser();

    return listOrgsData.data;
  } catch (error) {
    console.log('error', error);
    if (error.status === 404) {
      return [];
    }
  }
};

module.exports = getOrgs;
