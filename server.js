var express = require('express');
var cors = require('cors')
var app = express();
var bodyParser = require('body-parser');
var axios = require('axios'); 
var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('db/services.db')

app.use(cors())
app.use(bodyParser.json());
app.use(express.static("dist"));

app.get('/services', function (req, res) {
    db.serialize(function() {
        var servicesList = []
        db.each("SELECT * FROM services ORDER BY order_n ASC", function(err, row) {
            var service = {
            id: row.id,
            name: row.name,
            url: row.url,
            env: ("" + row.env).split(',').map(Number)
            }
            servicesList.push(service)
        }, function(){
            res.json(servicesList);
        });
      });
})

app.get('/envs', function (req, res) {
  db.serialize(function() {
      var envList = []
      db.each("SELECT * FROM envs", function(err, row) {
          var env = {
          id: row.id,
          name: row.name,
          alias: row.alias,
          color: row.color,
          project: ("" + row.project).split(',').map(Number)
          }
          envList.push(env)
      }, function(){
          res.json(envList);
      });
    });
})

app.get('/projects', function (req, res) {
    db.serialize(function() {
        var projList = []
        db.each("SELECT * FROM projects", function(err, row) {
            var proj = {
            id: row.id,
            name: row.name,
            color: row.color
            }
            projList.push(proj)
        }, function(){
            res.json(projList);
        });
    });
})

app.post('/create', function (req, res) {
    db.run('INSERT INTO services (name,env,url,image_url) VALUES ("' + req.body.name + '", "' + req.body.env + '", "' + req.body.url + '", "test.png")')
    res.send("OK")
})
  

app.post('/destroy', function (req, res) {
  db.run('DELETE FROM services WHERE id=' + req.body.id)
  res.send("OK")
})

var server = app.listen(4532, function () {
   var host = "0.0.0.0"
   var port = "4532"
   
   console.log("Example app listening at http://%s:%s", host, port)
})