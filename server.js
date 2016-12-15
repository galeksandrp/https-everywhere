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
      json: true,
      headers: {
        'User-Agent': 'request'
      }
    }, function(error, response, bodyAccess) {
      if (bodyAccess.access_token) {
        request({
          url: 'https://api.github.com/repos/EFForg/https-everywhere/forks?access_token=' + bodyAccess.access_token,
          method: 'POST',
          json: true,
          headers: {
            'User-Agent': 'request'
          }
        }, function(error, response, bodyFork) {
          request({
            url: 'https://api.travis-ci.org/repos/' + process.env.GITHUB_NAME + '/httpse/key',
            json: true
          }, function(error, response, bodyEncrypt) {
            var rsa = require('ursa');
            var pem = bodyEncrypt.key.replace(/RSA PUBLIC KEY/g, 'PUBLIC KEY');
            var publicKey = rsa.createPublicKey(pem);
            var cipherText = publicKey.encrypt("GITHUB_TOKEN=" + bodyAccess.access_token, undefined, undefined, rsa.RSA_PKCS1_PADDING);
            var secvar = cipherText.toString('base64');
            //var secvar = crypto.publicEncrypt(bodyEncrypt.key, new Buffer("GITHUB_TOKEN=" + bodyAccess.access_token)).toString('base64');
            request({
              url: 'https://api.travis-ci.org/repo/' + process.env.GITHUB_NAME + '%2Fhttpse/requests',
              method: 'POST',
              json: {
                "request": {
                  "message": queries.state + " Override the commit message: this is an api request",
                  "branch": "template-api",
                  "config": {
                    "env": {
                      "global": [
                        "DOMAIN=" + queries.state,
                        "GITHUB_NAME=" + bodyFork.owner.login,
                        "ISSUE=" + 3,
                        {
                          "secure": secvar
                        }
                      ]
                    }
                  }
                }
              },
              headers: {
                'User-Agent': 'request',
                "Authorization": "token " + process.env.TRAVIS_TOKEN,
                "Travis-API-Version": 3
              }
            }).pipe(resp);
          });
        });
      }
      else {
        resp.end('200 OK');
      }
    });
  }
  else {
    resp.end('200 OK');
  }
}).listen(process.env.PORT);
