const { google } = require("googleapis");

const { ROOT_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

async function getDomains(tokenInfo) {
  const auth = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    `${ROOT_URL}/callback`
  );

  auth.setCredentials(tokenInfo);

  const directory = google.admin({ version: "directory_v1", auth });

  const response = await directory.domains.list({ customer: 'my_customer' });
  const domains = response.data.domains;

  return domains;
}

module.exports = getDomains;
