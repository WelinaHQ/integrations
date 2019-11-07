const { withClient } = require("@welina/integration-utils");
const { google } = require("googleapis");
const slugify = require("@sindresorhus/slugify");

const { ROOT_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

module.exports = withClient(async options => {
  const { payload, welinaClient } = options;
  const { member, metadata, headers } = payload;

  const auth = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    `${ROOT_URL}/callback`
  );

  auth.setCredentials(metadata.googleTokenInfo);

  const { last_name, first_name } = member;

  const email = `${slugify(first_name)}.${slugify(last_name)}@${
    metadata.domainName
  }`;

  const newUser = {
    name: {
      familyName: last_name,
      givenName: first_name
    },
    primaryEmail: email,
    password: "testtest123",
    changePasswordAtNextLogin: true
  };

  const directory = google.admin({ version: "directory_v1", auth });

  try {
    await directory.users.insert({
      resource: newUser
    });
  } catch (error) {
    console.log("error inserting gsuite user", error);
    throw error;
  }

  try {
    const variables = { memberId: member.id, email };
    const mutateRes = await welinaClient.fetchAndThrow(
      `mutation updateMember($memberId: uuid!, $email: String!) {
      __typename
      update_member(where: {id: {_eq: $memberId}}, _set: {professional_email: $email}) {
        affected_rows
      }
    }`,
      variables,
      headers
    );
  } catch (error) {
    console.log("error updating welina professional_email", error);
    throw error;
  }

  return {
    success: true
  };
});
