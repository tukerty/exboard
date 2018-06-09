var express = require('express');
var cors = require('cors')
var app = express();
var bodyParser = require('body-parser');
var axios = require('axios'); 
var sqlite3 = require('sqlite3').verbose()
var hexToRgba = require('hex-rgba')
var db = new sqlite3.Database('db/services.db')

db.run('CREATE TABLE IF NOT EXISTS "envs" ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, alias TEXT, color TEXT, project INTEGER, foreign key (project) references projects(id) );')
db.run('CREATE TABLE IF NOT EXISTS "projects" ( "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "name" TEXT NOT NULL DEFAULT "No Name", "color" TEXT NOT NULL DEFAULT "#607D8B" );')
db.run('CREATE TABLE IF NOT EXISTS "services" ( "id" INTEGER PRIMARY KEY AUTOINCREMENT, "name" TEXT, "url" TEXT, "color" TEXT );')
db.run('CREATE TABLE IF NOT EXISTS "services_envs" ( "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "service_id" INTEGER, "env_id" INTEGER, FOREIGN KEY("service_id") REFERENCES "services"("id"), FOREIGN KEY("env_id") REFERENCES "envs"("id") );')

app.use(cors())
app.use(bodyParser.json());
app.use(express.urlencoded());
app.use(express.static("dist"));



app.get('/services', function (req, res) {
    db.serialize(function() {
        let servicesList = []
        let linksList = []

        function loadLinks(){
            let promiseLinks = new Promise(function(resolve,reject) {
                var links = []
                db.each("SELECT * FROM services_envs", function(err, row) {
                    var link = {
                        id: row.id,
                        env_id: row.env_id,
                        service_id: row.service_id
                    }
                    links.push(link)
                }, function(){
                    resolve(links)
                });
            })
            return promiseLinks
        }

        function loadServices(){
            let promiseServices = new Promise(function(resolve,reject){
                db.each("SELECT * FROM services", function(err, row) {
                    var envs = []
                    linksList.forEach(link => {
                        if (link.service_id === row.id){
                            envs.push(link.env_id)
                        }
                    })
                    var service = {
                        id: row.id,
                        name: row.name,
                        url: row.url,
                        bgColor: hexToRgba(row.color,20),
                        color: row.color,
                        env: envs
                    }
                    servicesList.push(service)
                }, function(){
                    resolve(servicesList)
                });
            });
            return promiseServices
        }

        loadLinks()
            .then(data => {
                linksList = data
            })
            .then(
                loadServices()
                    .then(data => {
                        servicesList = data
                        res.json(servicesList)
                    })
            )
            .catch(error => {
                console.log(error)
            })

      });
})
app.post('/services', function(req, res){
    db.run('INSERT INTO services (name,url,color) VALUES ("' + req.body.name + '", "' + req.body.url + '", "' + req.body.color +'");',function(err,row){
        let query = 'INSERT INTO services_envs (service_id, env_id) VALUES '  
        let lastid = this.lastID;
        req.body.env.forEach(function(e){
            query += '("' + lastid + '", "' + e + '"),'
        })
        db.run(query.slice(0, -1), function(err,row){
            res.send(query)
        })
    })
})
app.put('/services/:id', function(req, res){
    db.run('DELETE FROM services_envs WHERE service_id = ' + req.params.id, function(){
        let query = 'INSERT INTO services_envs (service_id, env_id) VALUES '  
        let lastid = req.params.id;
        req.body.env.forEach(function(e){
            query += '("' + lastid + '", "' + e + '"),'
        })
        db.run(query.slice(0, -1), function(err,row){
                    
            db.run('UPDATE services SET name="' + req.body.name + '", url="' + req.body.url + '", color="' + req.body.color +'" WHERE id=' + req.params.id)
            res.send("OK")
        })
    })
})
app.delete('/services/:id', function (req, res) {
    db.run('DELETE FROM services WHERE id=' + req.params.id)
    res.send("OK")
})

app.get('/envs', function (req, res) {
  db.serialize(function() {
      var envList = []
      db.each("SELECT envs.* FROM envs", function(err, row) {
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

app.put('/envs/:id', function(req, res){
    db.run('UPDATE envs SET name="' + req.body.name + '", alias="' + req.body.alias + '", project="' + req.body.project + '", color="' + req.body.color +'" WHERE id=' + req.params.id)
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