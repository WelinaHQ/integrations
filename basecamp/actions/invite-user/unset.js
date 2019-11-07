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

  const directory = google.admin({ version: "directory_v1", auth });

  try {
    await directory.users.delete({
      userKey: member.professional_email
    });
  } catch (error) {
    console.log(`error deleting gsuite user with user key ${member.professional_email}`, error);
    throw error;
  }

  try {
    const variables = { memberId: member.id, email: null };
    const mutateRes = await welinaClient.fetchAndThrow(
      `mutation updateMember($memberId: uuid!, $email: String) {
      __typename
      update_member(where: {id: {_eq: $memberId}}, _set: {professional_email: $email}) {
        affected_rows
      }
    }`,
      variables,
      headers
    );
    console.log('mutateRes', mutateRes)
  } catch (error) {
    console.log("error updating welina professional_email", error);
    throw error;
  }

  return {
    success: true
  };
});
