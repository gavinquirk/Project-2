// Load environment variables from `.env` file (optional)
require('dotenv').config();

const slackEventsApi = require('@slack/events-api');
const SlackClient = require('@slack/client').WebClient;
const passport = require('passport');
const SlackStrategy = require('@aoberoi/passport-slack').default.Strategy;
const https = require('https');
var db = require("../models");
const moment = require("moment");
const express = require('express');
// var https = require("https")
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var userMsg


var postingStamp = moment().format("ddd, MMM Do YYYY");


// *** Initialize event adapter using verification token from environment variables ***
const slackEvents = slackEventsApi.createSlackEventAdapter(process.env.SLACK_VERIFICATION_TOKEN, {
  includeBody: true
});

// Initialize a data structures to store team authorization info (typically stored in a database)
const botAuthorizations = {}

// Helpers to cache and lookup appropriate client
// NOTE: Not enterprise-ready. if the event was triggered inside a shared channel, this lookup
// could fail but there might be a suitable client from one of the other teams that is within that
// shared channel.
const clients = {};
function getClientByTeamId(teamId) {
  if (!clients[teamId] && botAuthorizations[teamId]) {
    clients[teamId] = new SlackClient(botAuthorizations[teamId]);
  }
  if (clients[teamId]) {
    return clients[teamId];
  }
  return null;
}
// var accessToken = process.env.OAUTH_ACCESS_TOKEN
// Initialize Add to Slack (OAuth) helpers
passport.use(new SlackStrategy({
  clientID: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  skipUserProfile: true,
}, (accessToken, scopes, team, extra, profiles, done) => {
  botAuthorizations[team.id] = extra.bot.accessToken;
  done(null, {});
}));

// Initialize an Express application
const app = express();
app.use(bodyParser.json());


var linkObj = {}



module.exports = function(app){

// Plug the Add to Slack (OAuth) helpers into the express app
app.use(passport.initialize());
app.get('/slack/authorization', (req, res) => {
  res.send('<a href="/auth/slack"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>');
});
app.get('/auth/slack', passport.authenticate('slack', {
  scope: ['bot']
}));
app.get('/auth/slack/callback',
  passport.authenticate('slack', { session: false }),
  (req, res) => {
    // res.send('<p>Slack Overflow was successfully installed on your team.</p>');
    res.redirect("/")
  },
  (err, req, res, next) => {
    res.status(500).send(`<p>Greet and React failed to install</p> <pre>${err}</pre>`);
  }
);

// *** Plug the event adapter into the express app as middleware ***
app.use('/slack/events', slackEvents.expressMiddleware());

// *** Attach listeners to the event adapter ***

// *** Greeting any user that says "hi" ***
slackEvents.on('app_mention', (message, body) => {
  // Only deal with messages that have no subtype (plain messages) and contain 'hi'
  if (!message.subtype && message.text.indexOf("") >= 0) {
    // Initialize a client
    const slack = getClientByTeamId(body.team_id);
    // Handle initialization failure
    if (!slack) {
      return console.error('No authorization found for this team. Did you install this app again after restarting?');
    }
      console.log(message.text);
      

      var str = message.text;
    var n = str.indexOf(">" || "|" );
    var url = str.slice(1,n)
    console.log("Sliced message: " +url);
    db.resources.create({
      title: "Slack Submission",
      description: "Shared link via Slackbot",
      category: "Slack Submissions",
      link : url,
      author : "Slack User on " + postingStamp

    }).then(function(){
      console.log("posted to Database")
    })



    
    // Respond to the message back in the same channel
    slack.chat.postMessage({ channel: message.channel, text: `:tada: Hooray! Thanks <@${message.user}>, your post has been added to https://slackerflow.herokuapp.com !  ` })
      .catch(console.error);
    // // Respond to the message back in the same channel
    // slack.chat.postMessage(message.channel, text:`I Received your message`)
    //   .catch(console.error);
  }
  // console.log(message);
  
  
});

// *** Responding to reactions with the same emoji ***
// slackEvents.on('reaction_added', (event, body) => {
//   // Initialize a client
//   const slack = getClientByTeamId(body.team_id);
//   // Handle initialization failure
//   if (!slack) {
//     return console.error('No authorization found for this team. Did you install this app again after restarting?');
//   }
//   // Respond to the reaction back with the same emoji
//   slack.chat.postMessage(event.item.channel, `:${event.reaction}:`)
//     .catch(console.error);
// });

// *** Handle errors ***
slackEvents.on('error', (error) => {
  if (error.code === slackEventsApi.errorCodes.TOKEN_VERIFICATION_FAILURE) {
    // This error type also has a `body` propery containing the request body which failed verification.
    console.error(`An unverified request was sent to the Slack events Request URL. Request body: \
${JSON.stringify(error.body)}`);
  } else {
    console.error(`An error occurred while handling a Slack event: ${error.message}`);
  }
});


}



// Start the express application
// const port = process.env.PORT || 3000;
// http.createServer(app).listen(port, () => {
//   console.log(`server listening on port ${port}`);
// });
