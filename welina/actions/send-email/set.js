const { withClient } = require("@welina/integration-utils");
const client = require("@sendgrid/mail");
const template = require("lodash.template");

const { SENDGRID_API_KEY } = process.env;

module.exports = withClient(async options => {
  const { payload, welinaClient } = options;
  const { member, metadata, headers } = payload;

  console.log('metadata', metadata)
  console.log('member', member)

  client.setApiKey(SENDGRID_API_KEY);

  let compiledHtml

  if (metadata.html) {
    compiledHtml = template(metadata.html)
  } else if (metadata.template_id) {
    try {
      const emailTemplateRes = await welinaClient.fetchAndThrow(
        `query GetEmailTemplate {
          email_template_by_pk(id: "${metadata.template_id}") {
            html
          }
        }`,
        null,
        headers
      );
      compiledHtml = template(emailTemplateRes.data.email_template_by_pk.html)
    } catch (error) {
      console.log("error getting welina email template", error);
    }
  }
  

  const msg = {
    to:
      metadata.emailUsed === "pro"
        ? member.professional_email
        : member.personal_email,
    from: metadata.fromEmail,
    subject: metadata.object,
    html: compiledHtml(member)
  };

  console.log('msg.to', msg.to)
  console.log('msg.from', msg.from)
  console.log('msg.subject', msg.subject)

  try {
    await client.send(msg);

    return {
      success: true
    };
  } catch (error) {
    //Log friendly error
    console.error(error.toString());

    //Extract error msg
    const { message, code, response } = error;

    console.error(message);

    // //Extract response msg
    // const { headers, body } = response;
  }
});
