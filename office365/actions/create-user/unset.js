const { withClient } = require("@welina/integration-utils");
const removeFromOrganisation = require("../../lib/remove-from-organisation");
const refreshToken = require("../../lib/refresh-token");

module.exports = withClient(async options => {
  const { payload, welinaClient } = options;
  const { member, metadata, headers } = payload;

  console.log("member", member);
  console.log("metadata", metadata);

  const { professional_email } = member;

  let removeRes = await removeFromOrganisation(metadata, {
    email: professional_email
  });

  if (removeRes.error) {
    if (removeRes.error.message === "Access token has expired.") {
      const updatedMetadata = await refreshToken({ welinaClient, metadata });
      removeRes = await removeFromOrganisation(updatedMetadata, {
        email: professional_email
      });

      if (removeRes.error) {
        throw new Error(removeRes.error);
      }
    } else {
      throw new Error(removeRes.error);
    }
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
    console.log("mutateRes", mutateRes);
  } catch (error) {
    console.log("error updating welina professional_email", error);
    throw error;
  }

  return {
    success: true
  };
});
