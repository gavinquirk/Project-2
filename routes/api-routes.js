// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our Todo model
var db = require("../models");

var sequelize = require('sequelize');


// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the posts
  app.get("/api/posts/", function(req, res) {
    db.resources.findAll({})
      .then(function(dbPost) {
        res.json(dbPost);
      });
  });

  // Get route for returning posts of a specific category
  app.get("/api/posts/category/:category", function(req, res) {
    console.log(req.params.category)
    db.resources.findAll({
      where: {
        category: req.params.category
      }
    })
      .then(function(dbPost) {
        res.json(dbPost);
      });
  });

  // Get route for retrieving a single post
  app.get("/api/posts/:id", function(req, res) {
    db.resources.findOne({
      where: {
        id: req.params.id
      }
    })
      .then(function(dbPost) {
        res.json(dbPost);
      });
  });

  // POST route for saving a new post
  app.post("/api/posts/", function(req, res) {
    console.log(req.body);
    db.resources.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      link : req.body.link,
      author : req.body.author
    })
    .then(function(dbPost) {
        res.json(dbPost);
        console.log("api-routes.js line::: "+ dbPost);
        
      });
  });


  // PUT route for updating DOWN VOTE
  app.put("/api/posts/down/:id", function (req, res) {
    console.log('backend ' + req.params.id)
    db.resources.update({
      voteCount: sequelize.literal('voteCount - 1')
    }, {
        where: {
          id: req.params.id
        }
      }).then(function (dbPost) {
        // location.reload();
        res.json(dbPost);
      });
  });



  
  
  // PUT route for updating UP VOTE
  app.put("/api/posts/up/:id", function (req, res) {
    db.resources.update({ 
      voteCount: sequelize.literal('voteCount + 1') 
    }, {
        where: {
          id: req.params.id
        }
      }).then(function (dbPost) {
        console.log('dbPost: ' + dbPost)
        res.json(dbPost);
        // location.reload()
;      }).catch(function (error) {
        console.log(error)
      });
  });

  // PUT route for updating posts
  app.put("/api/posts", function(req, res) {
    db.Post.update(req.body,
      {
        where: {
          id: req.body.id
        }
      })
      .then(function(dbPost) {
        res.json(dbPost);
      });
  });
};
