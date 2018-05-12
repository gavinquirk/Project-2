require('dotenv').config()
const MessagingResponse = require('twilio').twiml.MessagingResponse;
var db = require("../models");
const moment = require("moment");
var express = require("express")
var router = express.Router()
var https = require("https")
var twilio = require("twilio")


// middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })

const username = process.env.TWILIO_ACCOUNT_SID;
const password = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(username, password);



var timestamp = moment().format("ddd, DD MMM YYYY HH:mm ZZ")
var postingStamp = moment().format("ddd, MMM Do YYYY")


var dataArr = {}
var smsPostObj = {}

// function below to add alert to index page when new SMS posting comes in
function addAlert(){
  // $(".sms-alert").append(`<div class="alert alert-warning alert-dismissible fade show" role="alert">
  //       <strong>NEW SMS Link</strong> Click <a href="/index">HERE</a> to refresh the page.
  //       <button type="button" class="close" data-dismiss="alert" aria-label="Close">
  //         <span aria-hidden="true">&times;</span>
  //       </button>
  //     </div>`)
  console.log("AddAlert function Runs");
  
}
// var validationForHost = twilio.webhook(password, {
//   host:'slackerflow.herokuapp.com',
//   protocol:'https'
// });



module.exports = function (app) {
  app.post('/sms', (req, res, next) => {
    const twiml = new MessagingResponse();
    // ===initial message, auto reply
    twiml.message('Welcome to Slack overflow! Thanks for sharing your link! Visit us at https://slackerflow.herokuapp.com !');
    res.writeHead(200, { 'Content-Type': 'text/xml' });

    client.messages.each({
      dateSent: timestamp,
      to: process.env.TWILIO_NUMBER,
    },

      function (messages) {
        // console.log(messages.body);
        dataArr = messages.body
        // console.log("Stored Value: "+dataArr);
        smsPostObj = {
          link: dataArr,
          author: "Mobile User on " + postingStamp,
          category: "Text Submissions",
          title: "Mobile Submission",
          description: "Shared link using Twilio Number"
        }
       }
    );
    
    twiml.redirect("/sms/post");
    res.end(twiml.toString());
    // Ends Conversation
  } 
  )

  app.post("/sms/post", function(req, res) {
    // console.log("****Redirect Object: "+ req.body.Body);
    db.resources.create({
      title: "Mobile Submission",
      description: "Shared link via Slack Text",
      category: "Mobile Link",
      link : req.body.Body,
      author : "Mobile User on " + postingStamp

    })
    .then(function(dbPost) {
        res.json(dbPost);
        addAlert()
        console.log("New Text Submission posted to Database. Refresh Page.");
        
      });
  });


// module.exports = router



}



// http.createServer(app).listen(1337, () => {
//   console.log('Express server listening on port 1337');
// })