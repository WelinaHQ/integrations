const { parse: parseUrl } = require("url");
const cookie = require("cookie");
const qs = require("query-string");

const { ROOT_URL, OFFICE_CLIENT_ID } = process.env;

module.exports = (req, res) => {
  const { query } = parseUrl(req.url, true);

  if (!query.next) {
    res.writeHead(403);
    res.end("Query param next is required");
    return;
  }

  const state = `state_${Math.random()}`;

  const params = qs.stringify({
    client_id: OFFICE_CLIENT_ID,
    response_type: 'code',
    redirect_uri: `${ROOT_URL}/callback`,
    response_mode: 'query',
    scope: 'offline_access openid User.Read Directory.Read.All User.Invite.All User.ReadWrite.All',
    state
  });

  const redirectUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params}`;

  const context = { next: query.next, state };

  res.writeHead(302, {
    Location: redirectUrl,
    "Set-Cookie": cookie.serialize(
      "my-addon-context",
      JSON.stringify(context),
      { path: "/" }
    )
  });
  res.end("Redirecting...");
};
