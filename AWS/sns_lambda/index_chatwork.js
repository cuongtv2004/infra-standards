var https = require('https');
var querystring = require('querystring');

exports.handler = function(event, context) {
  var message = JSON.parse(event.Records[0].Sns.Message);
  var state = (message.NewStateValue == 'ALARM') ? 'error' : 'ok';

  var post_message = "(" + state + ")\n"
   + "[code]\n"
   + message.NewStateValue + "\n"
   + "--------------------" + "\n"
   + message.AlarmName + "\n"
   + "Reason: " + message.NewStateReason + "\n"
   + "Region: " + message.Region + "\n"
   + "Type: " + message.Trigger.Namespace + "\n"
   + "ID: " + message.Trigger.Dimensions[0].value + "\n"
   + "[/code]\n";

  var postData = querystring.stringify ({
    body: post_message
  });

  var options = {
    host: 'api.chatwork.com',
    port: 443,
    method: 'POST',
    path: '/v2/rooms/<<Room ID>>/messages',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length,
      'X-ChatWorkToken': '<<Token>>'
    }
  };

  var req = https.request(options, function (res) {
    res.on('data', function (d) {
      process.stdout.write(d);
    });
    res.on('end', function () {
      context.done();
    });
  });

  req.on('error', function (err) {
    console.log(err);
  });

  req.write(postData);
  req.end();

};
