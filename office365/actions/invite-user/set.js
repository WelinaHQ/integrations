const addToOrganisation = require("../../lib/add-to-organisation");

module.exports = async (req, res) => {
  const { member, metadata } = req.body;
  console.log("member", member);

  const {
    last_name,
    first_name,
    professional_email,
    personal_email,
    organisation,
    team
  } = member;

  let inviteRes = await addToOrganisation(metadata, {
    email: metadata.emailUsed === "pro" ? professional_email : personal_email
  });

  if (inviteRes.error) {
    if (inviteRes.error.message === "Access token has expired.") {
      const updatedData = await addToOrganisation(metadata, {
        email:
          metadata.emailUsed === "pro" ? professional_email : personal_email
      });

      if (inviteRes.error) {
        throw new Error(inviteRes.error);
      }
    } else {
      throw new Error(inviteRes.error);
    }

    res.json({
      success: true
    });
  }
};
