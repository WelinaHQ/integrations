const { parse: parseUrl } = require("url");
const cookie = require("cookie");

function send(res, statusCode, content) {
  res.writeHead(statusCode);
  res.end(content);
}

module.exports = (req, res) => {
  const { query } = parseUrl(req.url, true);
  const { code } = query;
  const cookies = cookie.parse(req.headers.cookie);
  const context = JSON.parse(cookies["my-addon-context"] || "{}");

  if (!code ) {
    return send(res, 403, "No code found");
  }

  res.writeHead(302, {
    Location: `${context.next}?code=${code}`,
    "Set-Cookie": cookie.serialize("my-addon-context", "", { path: "/" })
  });

  res.end("Redirecting...");
};
