const { parse: parseUrl } = require("url");
const cookie = require("cookie");
const qs = require("query-string");

const { ROOT_URL, BASECAMP_CLIENT_ID } = process.env;

module.exports = (req, res) => {
  const { query } = parseUrl(req.url, true);

  if (!query.next) {
    res.writeHead(403);
    res.end("Query param next is required");
    return;
  }

  const params = qs.stringify({
    type: 'web_server',
    client_id: BASECAMP_CLIENT_ID,
    redirect_uri: `${ROOT_URL}/callback`
  });
  const redirectUrl = `https://launchpad.37signals.com/authorization/new?${params}`;
  const state = `state_${Math.random()}`;

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
