const hexRgb = require('hex-rgb');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();


const ColorConverter = require("cie-rgb-color-converter");

// 110, 143, 101
// 

// console.log(xy)



const host = "http://192.168.1.9";
const username = "1vJG8-vMBG-mthxvRpvGs8HpcZvMt3a2soqn01Ps";
const hueUrl = `${host}/api/${username}`;
var router = express.Router();


// afficher toutes les lampes
router.route('/alllights')
    .get(function(req, res) {
        var url = hueUrl;
        //console.log(url);  
        var options = {
            uri: url,
            json: true
        }
        var rp = require('request-promise');
        rp(options)
        .then(function(body) {
            var info = [];
            for (var key in body.lights) {
                var single = body.lights[key]["state"];
                single["id"] = key;
                single["name"] = body.lights[key]["name"];

                info.push(single);
            }
            //console.log(info);
            res.send(info);
            
        })
        .catch(function(err){
            console.log(err);
        });
});

// changer l etat d une lampe / afficher les informations d'une lampe
router.route('/lights/:id/:rgb')
    .post(function(req, res) {
       
        var rgb = hexRgb(req.params.rgb)

        var xy = ColorConverter.rgbToXy(rgb.red, rgb.green, rgb.blue,'LCA001');
        var id = req.params.id;
        var data = '{"on":true, "xy":['+Number.parseFloat(xy.x).toFixed(3)+','+Number.parseFloat(xy.y).toFixed(3)+']}';
        var url = hueUrl+'/lights/' + id + "/state/";
        //console.log(url);  
        var options = {
            method: 'PUT',
            uri: url,
            json: JSON.parse(data)
        }
        console.log(options)
        var rp = require('request-promise');
        rp(options)
        .then(function(body) {
            res.send(body)
            //console.log("-----------");
            //console.log(body);
            //res.json(body);
            //res.render('pages/singlelight', { lightinfo: body });
            //res.redirect('/'+id);
        })
        .catch(function(err){
            console.log(err);
            res.send("bad operation.");
        });
    })
    .get(function(req, res) {
        var id = req.params.id;
        var url = hueUrl+'/lights/' + id ;
        //console.log(url);  

        var options = {
            uri: url,
            json: true
        }
        var rp = require('request-promise');
        rp(options)
        .then(function(body) {
           
            var single = body["state"];
            single["name"] = body["name"];
            single["id"] = id;
            //  console.log(single);
            res.send(single);
        })
        .catch(function(err){
            console.log(err);
        });
    
    });
//get information state d'une lampe
router.route('/lights/:id').get(function(req, res) {
        var id = req.params.id;
        var url = hueUrl+'/lights/' + id ;
        //console.log(url);  

        var options = {
            uri: url,
            json: true
        }
        var rp = require('request-promise');
        rp(options)
        .then(function(body) {
           
            var single = {}
            single["id"] = id;
            single["name"] = body["name"];
            single["on"] = body["state"]["on"];
            //  console.log(single);
            res.send(single);
        })
        .catch(function(err){
            console.log(err);
        });
    
    });

// allumer ou eteindre toute les lampes
router.route('/groups/:bool')
.post(function(req, res) {
    var data = '{"on":'+req.params.bool+'}';
    var url = hueUrl+'/groups/0/action';
    //console.log(url);  
    var options = {
        method: 'PUT',
        uri: url,
        json: JSON.parse(data)
    }
    console.log(options)
    var rp = require('request-promise');
    rp(options)
    .then(function(body) {
        res.send(body)
        //console.log("-----------");
        //console.log(body);
        //res.json(body);
        //res.render('pages/singlelight', { lightinfo: body });
        //res.redirect('/'+id);
    })
    .catch(function(err){
        console.log(err);
        res.send("bad operation.");
    });
});


app.use("/", router);

app.listen(9100);
console.log("starting express server on port 9100...");