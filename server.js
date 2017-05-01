var http = require('http');
var request = require('request');

var branches = {'template-foorack2': '1d50a8f4ea414bfe298e8b8b5b7ab5a5476e2eee',
'template-pgerber': '68a46fedc6e6b1eb7db643567f16882c9f48b1b0',
'template-foorack': '8e6b221bf6811833b8d35d3c80c2385d0ab3ddb0'};

function createBranch(branch, resp, branch) {
  request({
    url: 'https://' + process.env.GITHUB_NAME + ':' + process.env.GITHUB_TOKEN + '@api.github.com/repos/' + process.env.GITHUB_NAME + '/' + process.env.GITHUB_REPO + '/git/refs',
    method: 'POST',
    json: {
      sha: typeof branch === 'undefined' ? process.env.SHA : branches[branch],
      ref: 'refs/heads/' + branch
    },
    headers: {
      'User-Agent': 'request'
    }
  }).pipe(resp);
}
http.createServer(function(req, resp) {
  if (req.url === '/' + process.env.PATHNAME && req.method === 'POST') {
    var jsonString = '';

    req.on('data', function(data) {
      jsonString += data;
    });

    req.on('end', function() {
      var payload = JSON.parse(jsonString);
      if (payload.action === 'opened') {
        createBranch(payload.issue.title + '=' + payload.issue.number, resp, payload.issue.labels.length ? payload.issue.labels[0] : undefined);
      }
      else if (payload.action === 'reopened') {
        request({
          url: 'https://' + process.env.GITHUB_NAME + ':' + process.env.GITHUB_TOKEN + '@api.github.com/repos/' + process.env.GITHUB_NAME + '/' + process.env.GITHUB_REPO + '/git/refs/heads/' + payload.issue.title + '=' + payload.issue.number,
          method: 'DELETE',
          json: {},
          headers: {
            'User-Agent': 'request'
          }
        }, function(error, response, body) {
          createBranch(payload.issue.title + '=' + payload.issue.number, resp, payload.issue.labels.length ? payload.issue.labels[0] : undefined);
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
