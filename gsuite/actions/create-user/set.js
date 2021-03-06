const { withClient } = require("@welina/integration-utils");
const { google } = require("googleapis");
const slugify = require("@sindresorhus/slugify");
const client = require("@sendgrid/mail");
const password = require("secure-random-password");
const fromEntries = require('fromentries');
const camelcase = require("camelcase");

const {
  ROOT_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GSUITE_SENDGRID_API_KEY
} = process.env;

const prependKeys = (obj, prepend) => {
  return fromEntries(
    Object.entries(obj).map(([key, value]) => [
      camelcase(`${prepend}:${key}`),
      value
    ])
  );
};

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
  const emailPassword = password.randomPassword();

  const newUser = {
    name: {
      familyName: last_name,
      givenName: first_name
    },
    primaryEmail: email,
    password: emailPassword,
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
    await welinaClient.fetchAndThrow(
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

  client.setApiKey(GSUITE_SENDGRID_API_KEY);

  const memberProps = prependKeys(member, "member");
  const organisationProps = prependKeys(member.organisation, "organisation");

  const msg = {
    to: member.personal_email,
    from: "welcome@welina.io",
    templateId: "d-91288eb031cf4042a68f4ab009c005f9",
    dynamic_template_data: {
      ...memberProps,
      ...organisationProps,
      email,
      password: emailPassword
    }
  };

  console.log("msg", msg);

  await client.send(msg);

  return {
    success: true
  };
});
