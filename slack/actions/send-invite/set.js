const client = require("@sendgrid/mail");
const camelcase = require("camelcase");
const fromEntries = require('fromentries');

const { SENDGRID_API_KEY, INVITATION_TEMPLATE_ID } = process.env;

module.exports = async (req, res) => {
  const { member, metadata } = req.body;

  console.log("member", member);
  console.log("metadata", metadata);

  client.setApiKey(SENDGRID_API_KEY);

  const prependKeys = (obj, prepend) => {
    return fromEntries(
      Object.entries(obj).map(([key, value]) => [
        camelcase(`${prepend}_${key}`),
        value
      ])
    );
  };

  const memberProps = prependKeys(member, "member");
  const organisationProps = prependKeys(member.organisation, "organisation");
  console.log("memberProps", memberProps);
  console.log("organisationProps", organisationProps);

  const msg = {
    to:
      metadata.emailUsed === "perso"
        ? member.personal_email
        : member.professional_email,
    from: "welcome@welina.io",
    templateId: INVITATION_TEMPLATE_ID,
    dynamic_template_data: {
      ...memberProps,
      ...organisationProps,
      invitationLink: metadata.invitationLink
    }
  };

  console.log("msg", msg);

  await client.send(msg);

  res.json({
    success: true
  });
};
