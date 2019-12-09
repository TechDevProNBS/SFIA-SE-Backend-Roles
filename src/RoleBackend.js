console.log('running');

/**
 * Importing required modules.
 * Connecting to a config.json file which has connections and passwords for databases
 * dependent on the profile selected.
 */
let express = require('express');
let bodyparser = require('body-parser');
let mongo = require('mongodb').MongoClient;

let allConfig = require('./config.json');
let profile = allConfig.currentProfile;
let config = allConfig[profile];

/**
 * This is where to select the database that is referenced throughout the backend.
 */
let database = config.roles_database;

let url = `mongodb+srv://${database.user}:${database.password}@nationwide-ld1bk.azure.mongodb.net/test`;
let app = express();
let cors = require('cors');

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

let dbName = database.name;
let dbCollection = database.collection;

app.get('/API/get', function (req, res) {
    mongo.connect(url, function (err, client) {
        if (err) throw err;
        db = client.db(dbName);
        db.collection(dbCollection).find().toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
        });
        client.close();
    });
});

/**
 * Get request to return roles based on role name from the request.
 */
app.get('/API/getRoleByName/:roleName', function (req, res) {
    let data = {
        role_name: req.params.roleName
    }
    mongo.connect(url, function (err, client) {
        if (err) throw err;
        db = client.db(dbName);
        db.collection(dbCollection).find(data).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
        });
        client.close();
    });
});

/**
 * Post request to create roles. Expects JSON for data.
 */
app.post('/API/postRole', function (req, res) {
    let data = req.body;
    mongo.connect(url, function (err, client) {
        if (err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
        } else {
            db = client.db(dbName)
            db.collection(dbCollection).insertOne(data, function (error, result) {
                if (error) {
                    console.log('Error occurred while inserting record...\n',error);
                }
            });
            console.log("success");
            
            res.send("Success");
            client.close();
        }
    });
});

/**
 * Delete request to delete roles based on role name from URL.
 */
app.delete('/API/deleteRole/:roleName', function (req, res) {
    let data = {
        role_name: req.params.roleName
    }
    mongo.connect(url, function (err, client) {
        if (err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
        } else {
            db = client.db(dbName);
            db.collection(dbCollection).deleteOne(data, function (error, result) {
                if (error) {
                    console.log('Error occurred while deleting record...\n',error);
                }
            });
            res.send('Success');
            client.close();
        }
    });
});

/**
 * Put request to update roles based on role name from URL. Expects JSON for data.
 */
app.put('/API/putRole/:name', function (req, res) {
    let data = req.body;
    
    let original = {
        role_name: req.params.name
    }

    mongo.connect(url, function (err, client) {
        if (err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
        } else {
            db = client.db(dbName);
            db.collection(dbCollection).updateOne(original, {$set:data}, function (error, result) {
                if (error) {
                    console.log('Error occurred while updating record...\n',error);
                }
            });
            res.send('Success');
            client.close();
        }
    });
});

/**
 * Port number read from config.json file.
 */
app.listen(config.node_port_role_backend);