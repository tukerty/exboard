var express = require('express');
var cors = require('cors')
var app = express();
var bodyParser = require('body-parser');
var axios = require('axios'); 
var sqlite3 = require('sqlite3').verbose()
var hexToRgba = require('hex-rgba')
var db = new sqlite3.Database('db/services.db')


app.use(cors())
app.use(bodyParser.json());
app.use(express.urlencoded());
app.use(express.static("dist"));

app.get('/services', function (req, res) {
    db.serialize(function() {
        var servicesList = []
        db.each("SELECT * FROM services ORDER BY order_n ASC", function(err, row) {
            var service = {
            id: row.id,
            name: row.name,
            url: row.url,
            bgColor: hexToRgba(row.color,20),
            color: row.color,
            env: ("" + row.env).split(',').map(Number)
            }
            servicesList.push(service)
        }, function(){
            res.json(servicesList);
        });
      });
})

app.post('/services', function(req, res){
    db.run('INSERT INTO services (name,env,url,color) VALUES ("' + req.body.name + '", "' + req.body.env + '", "' + req.body.url + '", "' + req.body.color +'")')
    res.send("OK")
})

app.put('/services/:id', function(req, res){
    db.run('UPDATE services SET name="' + req.body.name + '", env="' + req.body.env + '", url="' + req.body.url + '", color="' + req.body.color +'" WHERE id=' + req.params.id)
    res.send("OK")
})

app.delete('/services/:id', function (req, res) {
    db.run('DELETE FROM services WHERE id=' + req.params.id)
    res.send("OK")
})

app.get('/envs', function (req, res) {
  db.serialize(function() {
      var envList = []
      db.each("SELECT * FROM envs", function(err, row) {
          var env = {
          id: row.id,
          name: row.name,
          alias: row.alias,
          active: true,
          color: hexToRgba(row.color,100),
          project: ("" + row.project).split(',').map(Number)
          }
          envList.push(env)
      }, function(){
          res.json(envList);
      });
    });
})

app.post('/envs', function(req, res){
    db.run('INSERT INTO envs (name,alias,color, project) VALUES ("' + req.body.name + '", "' + req.body.alias + '", "' + req.body.color + '", "' + req.body.project +'")')
    res.send("OK")
})

app.delete('/envs/:id', function (req, res) {
    db.run('DELETE FROM envs WHERE id=' + req.params.id)
    res.send("OK")
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

app.post('/projects', function(req, res){
    db.run('INSERT INTO projects (name,color) VALUES ("' + req.body.name + '", "' + req.body.color + '")')
    res.send("OK")
})

app.put('/projects/:id', function(req, res){
    db.run('UPDATE projects SET name="' + req.body.name + '", color="' + req.body.color +'" WHERE id=' + req.params.id)
    res.send("OK")
})

app.delete('/projects/:id', function (req, res) {
    db.run('DELETE FROM projects WHERE id=' + req.params.id)
    res.send("OK")
})






var server = app.listen(4532, function () {
   var host = "0.0.0.0"
   var port = "4532"
   
   console.log("Example app listening at http://%s:%s", host, port)
})