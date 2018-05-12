// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var router = express.Router()
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 1337;

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

// Static directory
app.use(express.static("public"));

// var twilioroutes = require('./routes/twilio-routes.js')

// ...

// app.use('/', twilioroutes)
// app.use('/sms', twilioroutes)
// app.use('/sms/post', twilioroutes)

// Routes
// =============================================================
require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);

// require("./routes/slack-routes.js")(app);
// require("./routes/twilio-routes.js")(app);


// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("App listening on localhost:" + PORT);
  });
});


// twilio integration

// const http = require('http');
// const MessagingResponse = require('twilio').twiml.MessagingResponse;


// app.post('/sms', (req, res) => {
//   const twiml = new MessagingResponse();

//   twiml.message('This is a Reply');

//   res.writeHead(200, {'Content-Type': 'text/xml'});
//   res.end(twiml.toString());
// });

// http.createServer(app).listen(1337, () => {
//   console.log('Express server listening on port 1337');
// });