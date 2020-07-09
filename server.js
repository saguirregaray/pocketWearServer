const express = require('express');
const bodyParser = require('body-parser');
var assert = require('assert');

var cors = require('cors');
var csp = require('helmet-csp');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.use(cors({
    origin: 'http://localhost:3001'
}));

app.use(csp({
    directives: {
        imgSrc: [`imgur.com`]
    }
}))



// Config database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

const cassandra = require('cassandra-driver');



// define a simple route
app.get('/', (req, res) => {
    res.json({ "message": "Mongo server app" });
});

// Require person routes
require('./app/routes/item.routes.js')(app);

//necessary with mongoose
mongoose.Promise = global.Promise;



// Connecting to the database
mongoose.connect(dbConfig.urlMongo, {
    useNewUrlParser: true
}).then(() => {
    const client = new cassandra.Client(
        { contactPoints: [dbConfig.cassandraHost], keyspace: 'images', localDataCenter: 'datacenter1' });
    client.connect(function (err) {
        assert.ifError(err);
    })
    
}).then(() => {
    console.log("Successfully connected to the database");
    // listen for requests
    app.listen(3000, () => {
        console.log("Server is listening on port 3000");
    });

}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

