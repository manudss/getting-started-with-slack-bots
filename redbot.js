var request = require('request');

module.exports = function (req, res, next) {
    

    var message = req.body;
        console.log (message);
  var userName = req.body.user_name;
  var botPayload = {
    text : 'Hello, ' + userName + '!'
  };
  

  var pattern = /#(\d+)/gi; 
  
  var match = pattern.exec(message.text)
  console.log("M: " + match);
  
  

  
  var url = process.env.redmine_protocol+'://'+process.env.redmine_host+process.env.redmine_prefix+'/issues/';
  var replaceUrl = '<'+url+'$1|#$1>'
  
  var text = message.text.replace(pattern, replaceUrl); ;

  // avoid infinite loop
  if (userName !== 'slackbot' && text != message.text) {
     send('chat.update', {
            channel: message.channel_id,
            parse: "none",
            text: text,
            ts: message.timestamp
          });
  } else if (userName === 'slackbot' && message.subtype == 'bot_message') { // cas où c'est un message de Trello, alors on fait un traitement particulier. 
      
       return res.status(200).end();
  } else {
    return res.status(200).end();
  }
}

function send (method, args) {
    args = args || {} ;
    args.token =  process.env.api_slack_token;
    console.log(args);
    request.post({
        url: 'https://slack.com/api/' + method,
        json: true,
        form: args
    }, function (error, response, body) {
        if (error || !body.ok) {
            console.log('Error:', error || body.error);
        }
    });
};

