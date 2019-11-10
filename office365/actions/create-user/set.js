const { withClient } = require("@welina/integration-utils");
const client = require("@sendgrid/mail");
const password = require("secure-random-password");
const fromEntries = require("fromentries");
const camelcase = require("camelcase");
const createInOrganisation = require("../../lib/create-in-organisation");
const refreshToken = require("../../lib/refresh-token");

const { OFFICE_SENDGRID_API_KEY } = process.env;

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
  console.log("member", member);

  const {
    last_name,
    first_name,
    professional_email,
    personal_email,
    organisation,
    team
  } = member;

  const emailPassword = password.randomPassword();
  const email = `${first_name.toLowerCase()}.${last_name.toLowerCase()}@${metadata.domain}`;

  let createRes = await createInOrganisation(metadata, {
    firstName: first_name,
    lastName: last_name,
    email,
    password: emailPassword
  });

  if (createRes.error) {
    if (createRes.error.message === "Access token has expired.") {
      const updatedData = await refreshToken({ welinaClient, metadata });
      createRes = await createInOrganisation(updatedData, {
        firstName: first_name,
        lastName: last_name,
        email,
        password: emailPassword
      });

      if (createRes.error) {
        throw new Error(createRes.error);
      }
    } else {
      throw new Error(createRes.error);
    }
  }


  try {
    const variables = { memberId: member.id, email };
    const updateMemberRes = await welinaClient.fetchAndThrow(
      `mutation updateMember($memberId: uuid!, $email: String!) {
      __typename
      update_member(where: {id: {_eq: $memberId}}, _set: {professional_email: $email}) {
        affected_rows
      }
    }`,
      variables,
      headers
    );
    console.log('updateMemberRes', updateMemberRes);
  } catch (error) {
    console.log("error updating welina professional_email", error);
    throw error;
  }

  client.setApiKey(OFFICE_SENDGRID_API_KEY);

  const memberProps = prependKeys(member, "member");
  const organisationProps = prependKeys(member.organisation, "organisation");

  const msg = {
    to: member.personal_email,
    from: "welcome@welina.io",
    templateId: "d-ee618dac05974282ad162bd8922461b8",
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
