const client = require("@sendgrid/mail");
const template = require("lodash.template");

const { SENDGRID_API_KEY } = process.env;

module.exports = async (req, res) => {
  const { member, metadata } = req.body;

  console.log('metadata', metadata)
  console.log('member', member)

  client.setApiKey(SENDGRID_API_KEY);

  const compiledHtml = template(metadata.html)

  const msg = {
    to:
      metadata.emailUsed === "pro"
        ? member.professional_email
        : member.personal_email,
    from: metadata.fromEmail,
    subject: metadata.object,
    html: compiledHtml(member)
  };

  try {
    await client.send(msg);

    res.json({
      success: true
    });
  } catch (error) {
    //Log friendly error
    console.error(error.toString());

    //Extract error msg
    const { message, code, response } = error;

    console.error(message);

    //Extract response msg
    const { headers, body } = response;
  }
};
