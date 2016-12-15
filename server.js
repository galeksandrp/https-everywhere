var http = require('http');
var request = require('request');
var url = require('url');
var crypto = require('crypto');

http.createServer(function(req, resp) {
  var urlParts = url.parse(req.url);
  if (req.url === '/' + process.env.PATHNAME && req.method === 'POST' && req.headers['X-GitHub-Event'] === 'push') {
    var jsonString = '';

    req.on('data', function(data) {
      jsonString += data;
    });

    req.on('end', function() {
      var payload = JSON.parse(jsonString);
      if (payload.ref === "refs/heads/" + process.env.BRANCH) {
        HASH = payload.after;
      }
      else {
        resp.end('200 OK');
      }
    });
  }
  else if (urlParts.pathname === '/92qhpf98qghf' && req.method === 'GET') {
    var queries = {};
    urlParts.query.split('&').forEach(function(query) {
      var parts = query.split('=');
      queries[parts[0]] = parts[1];
    });
    request({
      url: 'https://github.com/login/oauth/access_token',
      method: 'POST',
      form: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: queries.code
      },
      headers: {
        'User-Agent': 'request'
      }
    }, function(error, response, bodyAccess) {
      if (bodyAccess.access_token) {
        resp.writeHead(302, {
          'Location': 'https://preview.c9users.io/galeksandrp/space/https-everywhere/cp.html?' + bodyAccess
        });
        resp.end('ok');
      }
      else {
        resp.end('200 OK');
      }
    });
  }
  else if (urlParts.pathname === '/requests' && req.method === 'OPTIONS' ) {
    resp.writeHead(200, {
      'Access-Control-Allow-Origin': 'https://preview.c9users.io',
      'Access-Control-Allow-Headers': 'Content-Type, Travis-API-Version'
    });
    resp.end('ok');
  }
  else if (urlParts.pathname === '/requests' && req.method === 'POST' ) {
    // resp.writeHead(200, {
    //   'Access-Control-Allow-Origin': 'https://preview.c9users.io',
    //   'Access-Control-Allow-Headers': 'Content-Type, Travis-API-Version'
    // });
    //resp.setHeader('Access-Control-Allow-Origin', 'https://preview.c9users.io');
    //resp.setHeader('Access-Control-Allow-Headers', 'Content-Type, Travis-API-Version');
    var jsonString = '';

    req.on('data', function(data) {
      jsonString += data;
    });

    req.on('end', function() {
      var headers = req.headers;
      delete headers.host;
      //resp.end('ok2');
      headers["Authorization"] = "token " + process.env.TRAVIS_TOKEN;
      request({
        url: 'https://api.travis-ci.org/repo/' + process.env.GITHUB_NAME + '%2Fhttpse/requests',
        method: req.method,
        json: JSON.parse(jsonString),
        headers: headers
      }).pipe(resp);
    });
    //resp.end('ok2');
  }
  else {
    resp.end('200 OK');
  }
}).listen(process.env.PORT);
