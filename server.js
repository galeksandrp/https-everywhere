var http = require('http');
var request = require('request');
var url = require('url');
var crypto = require('crypto');
var rsa = require('ursa');

var bodyEncrypt = {
  "key": "-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAqpFR7F25/LMdieGMVOOS\nlyCZSMDMStXmlIVzZKOLlXHJrRcHtIpLomsbCf4+/MON/B6yAZHmcAWpHn81+l9k\nfF2PIS0JStB1Tokz0uZvPthV0Tteq7yXzYAgCynE/25i7CFNbShdEJ/dXkzwNCsY\n29l6a5UqKT4B/uPQOl8ihEYSU8Ajyu0jCOQrRHXCFi9+7J3FC/Yi2pN5arqi29vz\n+kW17gmhW6KUfAzOy66hWsSZUaqgbwqFV7yotDRy5/OpX8XEg2jSTHiKYM9OT0iV\n7orZZgmvbjzyIrLRHS8lBdFlYNmZv8CVUao6YcdE1AqIa9RmI85hl6S0Z5wrDSRX\nGNY/Myv9DiFBOnqlUUIg5x23oShpOOu6DpFe4+Xx1IScGN6Cf3FVJdSVME/Hp46E\n0wG76WffWfKiM3KbuTkHu+kbDGkjz6vhl6+6ZI45C0wTOsqTBXGOQfbgnTcwKSqd\nMU3v5dURGdy0I1CBOJHjLyvEXTFceNhLiW2yo4jbh0TFqbSBIubPBGD+G9ZfqX28\n/JwMYWwoKDDafvexfeoS1v1Gb5ba5HiDnUFnbl5fTSWUTY5lEmzNWKixDbCrtmkj\nbafMeW0thFYS9dDsK/TJnq1PSydGdX3B4rE//spvD1RVua00pFwKry5GbKlpDbUi\nNFWCKgKsuDeHoPa6uVRp8VUCAwEAAQ==\n-----END PUBLIC KEY-----\n",
  "fingerprint": "a0:0f:19:fa:2f:98:49:37:30:f5:60:5d:ac:ad:f6:7c"
};
var pem = bodyEncrypt.key.replace(/RSA PUBLIC KEY/g, 'PUBLIC KEY');
var publicKey = rsa.createPublicKey(pem);

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
        resp.writeHead(302, {
          'Location': 'https://galeksandrp.github.io/httpse.html?state='+ queries.state + '&' + bodyAccess
        });
        resp.end('ok');
    });
  }
  else if (urlParts.pathname === '/requests' && req.method === 'OPTIONS') {
    resp.writeHead(200, {
      'Access-Control-Allow-Origin': 'https://galeksandrp.github.io',
      'Access-Control-Allow-Headers': 'Content-Type, Travis-API-Version'
    });
    resp.end('ok');
  }
  else if (urlParts.pathname === '/requests' && req.method === 'POST') {
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
      delete headers['content-length'];
      //resp.end('ok2');
      headers["Authorization"] = "token " + process.env.TRAVIS_TOKEN;
      var json = JSON.parse(jsonString);
      var cipherTextLogin = publicKey.encrypt("GITHUB_NAME=" + json.login, undefined, undefined, rsa.RSA_PKCS1_PADDING);
      var login = cipherTextLogin.toString('base64');
      var cipherText = publicKey.encrypt("GITHUB_TOKEN=" + json.request.config.env.global[3].secure, undefined, undefined, rsa.RSA_PKCS1_PADDING);
      var token = cipherText.toString('base64');
      request({
        url: 'https://api.travis-ci.org/repo/' + process.env.GITHUB_NAME + '%2Fhttpse/requests',
        method: req.method,
        json: {
          "request": {
            "message": json.state + " Override the commit message: this is an api request",
            "branch": "template-api",
            "config": {
              "env": {
                "global": [
                  "DOMAIN=" + json.state,
                  {
                    "secure": login
                  },
                  "ISSUE=" + 3, {
                    "secure": token
                  }
                ]
              }
            }
          }
        },
        headers: headers
      }).pipe(resp);
    });
    //resp.end('ok2');
  }
  else {
    resp.end('200 OK');
  }
}).listen(process.env.PORT);
