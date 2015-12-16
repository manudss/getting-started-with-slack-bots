var request = require('request');

var redmine_url = 'https://redmine.tagsysrfid.com/redmine/';

module.exports = function (req, res, next) {
  
  /* 
  { token: '5c92yoWiWGfhxmdTp9pksIx4',
  team_id: 'T043MHUJY',
  team_domain: 'tagsysrfid',
  channel_id: 'G0FMRC733',
  channel_name: 'privategroup',
  user_id: 'U0FMR3MQQ',
  user_name: 'emmanuel.dss',
  command: '/red',
  text: '6622',
  response_url: 'https://hooks.slack.com/commands/T043MHUJY/16273270931/2O5mBsE12iH8Ng8yN6s03poS' }
  
  */
  
  console.log('command :', req.body);
  var url = 'https://hooks.slack.com/services/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';
  if (req.body.response_url) {
    url = req.body.response_url;
    send({"response_type": "ephemeral", text: req.body.command+" "+req.body.text+" : Recheche en cours ... "}, url);
  }
  
  
  // default roll is 2d6
  var matches;
  var botPayload = {};
  var id;
  
  var Redmine = require('promised-redmine');
var config = {
  host: process.env.redmine_host, // required
  apiKey: process.env.redmine_keys, // required
  pathPrefix: process.env.redmine_prefix,
  protocol: process.env.redmine_protocol,
  // if using SSL settings, change protocol and port accordingly
  // sslCaCert: '/path/to/root/ca.pem', // defaults to null
  // sslClientCert: '/path/to/client/cert.pem', // defaults to null
  // sslClientKey: '/path/to/client/cert.key', // defaults to null
  // sslClientPassphrase: 'clientKeyPassphrase' // defaults to null
}

       var redmineApi = new Redmine(config);
       redmineApi.verbose = true;
       console.log(redmineApi);
       
       switch (req.body.command) {
        case 'help':
          return res.status(200).send('/red last');
          
        case '/last':
          getLast ();
          break;  
          
        case '/find':
          find (req.body.text);
          break;  

          
        default:
          return res.status(200).send('/red last');
      }
       

  
  
  console.log('Receive info ' + req.body.text);
  
  console.log(req.body);
  
  
function getLast () {
   redmineApi.getIssues({limit:10})
          .success(function(issues){ // success is an alias of then without the promise rejection management in D.js the underlying promise library
            // do something with that
            console.log('get issue');
            console.log(issues);
            
            botPayload.attachments = [];  
            
            botPayload.pretext = "Last ticket";
            
            for (var issueid in issues.issues) {
              var issue = issues.issues[issueid];
              
              //console.log (issue);
              
               botPayload.attachments.push(
              {
                  "fallback": issue.subject,
                  /*"pretext": "New ticket from Andrea Lee",*/
                  "title": "#"+issue.id+": "+issue.subject,
                  "title_link": redmine_url+'issues/'+issue.id
              }
              );
            }
       
            
            
            /* botPayload.fallback = redmine_url+'issues/'+ id;
      botPayload.title_link = issue.subject;
      botPayload.title_link = redmine_url+'issues/'+ id;
      //botPayload.text = issue.subject;
      botPayload.color = "#7CD197";*/
      botPayload.username = req.body.user_name;
     
      botPayload.channel = req.body.channel_id;
      
      // send dice roll
          send(botPayload, url, function (error, status, body) {
            if (error) {
              return next(error);
        
            } else if (status !== 200) {
              // inform user that our Incoming WebHook failed
              return next(new Error('Incoming WebHook: ' + status + ' ' + body));
        
            } else {
              return res.status(200).end();
            }
          });
          
          //return res.status(200).send(botPayload);
      
      
            
          }).error(function (error) {
            console.log('error redmine');
            console.log(error);
            return res.status(500).send('Error with redmine ');
          });
  
  
  
  
}

function find (search) {
   redmineApi.getIssues({limit:100})
          .success(function(issues){ // success is an alias of then without the promise rejection management in D.js the underlying promise library
            // do something with that
            console.log('get issue');
            console.log(issues);
            
            botPayload.attachments = [];  
            
            botPayload.pretext = "Last ticket";
            
            var DataCollection = require('data-collection');
            // Finds Roose, Ramsay, Eddard --- case insensitive
            
            var issueCollection = new DataCollection(issues.issues);
            
            var filteredIssues = issueCollection.query()
              .filter({subject__icontains: search})
              .values();
              
              console.log(filteredIssues);
            
            for (var issueid in filteredIssues) {
              var issue = filteredIssues[issueid];
              
              console.log (issue);
              
               botPayload.attachments.push(
              {
                  "fallback": issue.subject,
                  /*"pretext": "New ticket from Andrea Lee",*/
                  "title": "Ticket #"+issue.id+": "+issue.subject,
                  "title_link": redmine_url+'issues/'+issue.id
              }
              );
            }
       
            
            
            /* botPayload.fallback = redmine_url+'issues/'+ id;
      botPayload.title_link = issue.subject;
      botPayload.title_link = redmine_url+'issues/'+ id;
      //botPayload.text = issue.subject;
      botPayload.color = "#7CD197";*/
      botPayload.username = req.body.user_name;
     
      botPayload.channel = req.body.channel_id;
      
      // send dice roll
          send(botPayload, url, function (error, status, body) {
            if (error) {
              return next(error);
        
            } else if (status !== 200) {
              // inform user that our Incoming WebHook failed
              return next(new Error('Incoming WebHook: ' + status + ' ' + body));
        
            } else {
              return res.status(200).end();
            }
          });
          
          //return res.status(200).send(botPayload);
      
      
            
          }).error(function (error) {
            console.log('error redmine');
            console.log(error);
            return res.status(500).send('Error with redmine ');
          });
  
  
  
  
}



  
}



function send (payload, uri, callback) {
  //var uri = 'https://hooks.slack.com/services/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';

  request({
    uri: uri,
    method: 'POST',
    body: JSON.stringify(payload)
  }, function (error, response, body) {
    if (error) {
      return callback(error);
    }

    if (callback) callback(null, response.statusCode, body);
  });
}


