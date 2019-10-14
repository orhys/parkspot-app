// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function (req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function () {
        res.redirect(307, "/api/login");
      })
      .catch(function (err) {
        console.log("HI IM THE ERROR: " + err)
        res.status(401).json(err);
      });
  });

  // Route for reserving a parking spot.
  // otherwise send back an error
  app.post("/api/reserve", function (req, res) {

    console.log("hitting reserve post req" + req.body)

    var currEmail = req.user.email

    db.Spot.create({
      owner: req.body.owner,
      car: req.body.car,
      license: req.body.license,
      email: currEmail
    })
      .then(function () {
        // res.redirect(307, "/api/reserve");
      })
      .catch(function (err) {
        console.log("HI IM THE ERROR: " + err)

        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function (req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  // Route for getting some data about our reservations, this will be used on the client side 
  app.get("/api/user_reservations", function (req, res) {

    db.Spot.findAll({}).then(function (dbSpot) {
      // We have access to the todos as an argument inside of the callback function
      res.json(dbSpot);
    });

  });

  app.delete("/api/reservations/:id", function (req, res) {
    // We just have to specify which todo we want to destroy with "where"

    var loggedInEmail = req.user.email
    var entryTryingToDeleteEmail = ""
    var deleteRecordID = req.params.id
    var stuff_i_want = '';
    var mysql = require("mysql");


    var connection = mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "Majinboo1",
      database: "passport"
    });

    connection.connect(function(err) {
      if (err) {
        console.error("error connecting: " + err.stack);
        return;
      }
      console.log("connected as id " + connection.threadId);
    });

    get_info(function (result) {
      stuff_i_want = result;

      console.log("styff i want: " + stuff_i_want)

      entryTryingToDeleteEmail = stuff_i_want
      //rest of your code goes in here

      if (loggedInEmail == entryTryingToDeleteEmail) {
        db.Spot.destroy({
          where: {
            id: req.params.id
          }
        }).then(function (dbTodo) {
          res.json(dbTodo);
        });
      } else {
        console.log("you messed up")
      }
    });

    function get_info(callback) {

      var sql = "SELECT email FROM spots WHERE id = " + deleteRecordID;

      connection.query(sql, function (err, results) {
        if (err) {
          throw err;
        }
        console.log("results: " + JSON.stringify(results)); // good
        stuff_i_want = results[0].email;  // Scope is larger than function

        return callback(stuff_i_want);
      })
    }

  });
};