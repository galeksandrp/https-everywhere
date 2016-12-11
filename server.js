var http = require('http');
var request = require('request');
http.createServer(function(req, resp) {
  if (req.url === '/' + process.env.PATHNAME && req.method === 'POST') {
    var jsonString = '';

    req.on('data', function(data) {
      jsonString += data;
    });

    req.on('end', function() {
      var payload = JSON.parse(jsonString);
      if (payload.action === 'opened' || payload.action === 'reopened') {
        request({
          url: 'https://' + process.env.GITHUB_NAME + ':' + process.env.GITHUB_TOKEN + '@api.github.com/repos/' + process.env.GITHUB_NAME + '/' + process.env.GITHUB_REPO + '/git/refs',
          method: 'POST',
          json: {
            sha: process.env.SHA,
            ref: 'refs/heads/' + payload.issue.title + '=' + payload.issue.number
          },
          headers: {
            'User-Agent': 'request'
          }
        }).pipe(resp);
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
