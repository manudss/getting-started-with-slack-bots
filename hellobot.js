  var Redmine = require('promised-redmine');
module.exports = function (req, res, next) {
  var config = {
  host: "redmine.tagsysrfid.com", // required
  apiKey: "3e8d2076c0115a3f1590b6d24c6935dd11f8ecfe", // required
  pathPrefix: "/redmine",
  protocol: "https",
  // if using SSL settings, change protocol and port accordingly
  // sslCaCert: '/path/to/root/ca.pem', // defaults to null
  // sslClientCert: '/path/to/client/cert.pem', // defaults to null
  // sslClientKey: '/path/to/client/cert.key', // defaults to null
  // sslClientPassphrase: 'clientKeyPassphrase' // defaults to null
}

var id = 4406;

var redmineApi = new Redmine(config);
       redmineApi.verbose = true;
       console.log(redmineApi);
        redmineApi.getIssue(id, null)
          .success(function(issue){ // success is an alias of then without the promise rejection management in D.js the underlying promise library
            // do something with that
            console.log('get issue');
            console.log(issue);
            
          }).error(function (error, error2) {
            console.log('error redmine');
            console.log(error, error2);
          });

}
