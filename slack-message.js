var WebClient = require('./lib/node-slack-client/lib/clients/web/client');
var RtmClient = require('./lib/node-slack-client/lib/clients/rtm/client');

var token = '' || process.env.api_slack_token;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


var webClient = new WebClient(token);
console.log(webClient);
var rtm = new RtmClient(webClient, {logLevel: 'debug'});
console.log(rtm);
rtm.start();

rtm.on('message', function(message) {
    var patternRedmineId = /#(\d+)/gi; 
    
    if (message.subtype == 'bot_message' && message.text === '' && message.attachments) { // cas où c'est un message de Trello, alors on fait un traitement particulier. 
        console.log(message);
      
        message.attachments.map (function (attachment) {
          console.log(attachment);
          if (attachment && attachment.text) {
                var message = (attachment.pretext)? attachment.pretext : attachment.text;
                var patternTrello = /"?<http.?:(\/\/trello\.com\/?.?\/([^|]+))\|([^>]+)>"?/gi; 
  
                var matchTrello = patternTrello.exec(message);
                console.log("Match Trello : " + message, matchTrello);
              
              if (matchTrello) {
                    var pattern = /#(\d+)/gi; 
  
                    var match = pattern.exec(message);
                    console.log("Match #id redmine : " + match);
                    
                    var replaceUrl = '"$3":$1';
  
                    message = message.replace(patternTrello, replaceUrl); 
                    message = message.replace(/#/g, "#:");
                    
                    if (attachment.pretext) {
                        message += "\n"+attachment.text;
                    }
                    
                    if (match) {
                        sendMessageRedmine(match[1], message);
                    }
                    
                    
                    
              }
          }
        }, this);
      
    } else if (message.text && message.subtype !== 'bot_message' && patternRedmineId.exec(message.text)) {
        
          console.log("Match redmine id : " , patternRedmineId.exec(message.text));
          
          
        
          
          var url = process.env.redmine_protocol+'://'+process.env.redmine_host+process.env.redmine_prefix+'/issues/';
          var replaceUrl = '<'+url+'$1|#$1>'
          
          var text = message.text.replace(patternRedmineId, replaceUrl); 
          
          if (text != message.text) {
              webClient.makeAPICall('chat.update', {
                channel: message.channel,
                parse: "none",
                text: text,
                ts: message.ts
              }, function (data) {
                  console.log ("Message updated", text, data);
              });
          }
          
    }
    
});


function sendMessageRedmine (id, message) {
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

        console.log("Post Message : "+message+" to issue : #"+id);
        
redmineApi.updateIssue(id, {notes:message})
          .success(function(response){
              console.log(response);
          });

}