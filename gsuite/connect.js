const { parse: parseUrl } = require("url");
const cookie = require("cookie");
const qs = require('query-string');
const { google } = require("googleapis");

const { ROOT_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

module.exports = (req, res) => {
  const { query } = parseUrl(req.url, true);

  if (!query.next) {
    res.writeHead(403);
    res.end("Query param next is required");
    return;
  }

  const oAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    `${ROOT_URL}/callback`
  );

  const state = `state_${Math.random()}`;
  const SCOPES = [
    'https://www.googleapis.com/auth/admin.directory.domain.readonly',
    'https://www.googleapis.com/auth/admin.directory.user'
  ];
  const redirectUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', redirectUrl);

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
