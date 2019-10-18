const { google } = require("googleapis");
const slugify = require("@sindresorhus/slugify");

const { ROOT_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

module.exports = async (req, res) => {
  const { member, metadata } = req.body;

  const auth = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    `${ROOT_URL}/callback`
  );

  auth.setCredentials(metadata.googleTokenInfo);

  const { last_name, first_name } = member;

  const newUser = {
    name: {
      familyName: last_name,
      givenName: first_name
    },
    primaryEmail: `${slugify(first_name)}.${slugify(last_name)}@${metadata.domainName}`,
    password: "testtest123",
    changePasswordAtNextLogin: true
  };

  const directory = google.admin({ version: "directory_v1", auth });

  await directory.users.insert({
    resource: newUser
  });

  res.json({
    success: true
  });
};
