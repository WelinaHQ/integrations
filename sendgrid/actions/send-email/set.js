const client = require("@sendgrid/mail");

module.exports = async (req, res) => {
  const { member, metadata } = req.body;

  console.log("metadata", metadata);
  console.log("metadata.apiKey", metadata.apiKey);

  client.setApiKey(metadata.apiKey);

  const msg = {
    to:
      metadata.emailUsed === "perso"
        ? member.personal_email
        : member.professional_email,
    from: metadata.fromEmail,
    templateId: metadata.templateId,
    dynamic_template_data: {
      ...member
    }
  };

  console.log("msg", msg);

  await client.send(msg);

  res.json({
    success: true
  });
};
