var request = require('request');

var redmine_url = 'https://redmine.tagsysrfid.com/redmine/';

module.exports = function (req, res, next) {
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

  if (req.body.text) {
    
    if (req.body.text == 'help') {
      return res.status(200).send('/redmine <id redemine>');
    }
    // parse roll type if specified
    matches = req.body.text.match(/^(\d+)$/);
    
    console.log(matches);

    if (matches && matches[1]) {
      id = matches[1];
      // write response message and add to payload
      
      
      /**
       * {
    "attachments": [
        {
            "fallback": "New ticket from Andrea Lee - Ticket #1943: Can't rest my password - https://groove.hq/path/to/ticket/1943",
            "pretext": "New ticket from Andrea Lee",
            "title": "Ticket #1943: Can't reset my password",
            "title_link": "https://groove.hq/path/to/ticket/1943",
            "text": "Help! I tried to reset my password but nothing happened!",
            "color": "#7CD197"
        }
    ]
}
       */
       
       var redmineApi = new Redmine(config);
       redmineApi.verbose = true;
        redmineApi.getIssue(id, null)
          .success(function(issue){ // success is an alias of then without the promise rejection management in D.js the underlying promise library
            // do something with that
            
            
            botPayload.attachments = [
            {
                "fallback": (issue.subject)? issue.subject : '',
                /*"pretext": "New ticket from Andrea Lee",*/
                "title": "Ticket #"+id+": "+(issue.subject)? issue.subject : '',
                "title_link": redmine_url+'issues/'+ id,
                "text": issue.description,
                "color": "#7CD197",
                "fields" : [
                {
                    "title": "Project",
                    "value": (issue.project)? issue.project.name  : '',
                    "short": true
                },
                {
                    "title": "Tracker",
                    "value": (issue.tracker)? issue.tracker.name  : '',
                    "short": true
                },
                {
                    "title": "Status",
                    "value": (issue.status)? issue.status.name : '',
                    "short": true
                },
                {
                    "title": "Author",
                    "value": (issue.author)? issue.author.name  : '',
                    "short": true
                },
                {
                    "title": "Assigned to",
                    "value": (issue.assigned_to)? issue.assigned_to.name : '',
                    "short": true
                }
            ]
            }
        ];
            
            
            /* botPayload.fallback = redmine_url+'issues/'+ id;
      botPayload.title_link = issue.subject;
      botPayload.title_link = redmine_url+'issues/'+ id;
      //botPayload.text = issue.subject;
      botPayload.color = "#7CD197";*/
      botPayload.username = req.body.user_name;
     
      botPayload.channel = req.body.channel_id;
      
      // send dice roll
  send(botPayload, function (error, status, body) {
    if (error) {
      return next(error);

    } else if (status !== 200) {
      // inform user that our Incoming WebHook failed
      return next(new Error('Incoming WebHook: ' + status + ' ' + body));

    } else {
      return res.status(200).end();
    }
  });
      
      
            
          }).error(function (error) {
            console.log('error redmine');
            console.log(error);
            return res.status(200).send('error : '+error);
          });
  
  
     
      //botPayload.icon_emoji = ':tagsys:';

    } else {
      // send error message back to user if input is bad
      return res.status(200).send('/redmine <id redemine>');
    }
  }
  
  console.log('Receive info ' + req.body.text);
  
  console.log(req.body);
  
  

  
}



function send (payload, callback) {
  var uri = 'https://hooks.slack.com/services/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';

  request({
    uri: uri,
    method: 'POST',
    body: JSON.stringify(payload)
  }, function (error, response, body) {
    if (error) {
      return callback(error);
    }

    callback(null, response.statusCode, body);
  });
}
