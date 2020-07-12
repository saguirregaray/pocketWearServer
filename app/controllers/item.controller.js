const Item = require('../models/item.model.js');
const cassandra = require('cassandra-driver');
var assert = require('assert');


//cassandre client
const client = new cassandra.Client(
    { contactPoints: ['localhost'], keyspace: 'images', localDataCenter: 'datacenter1' });
client.connect(function (err) {
    assert.ifError(err);
})

// Create and Save item
exports.create = (req, res) => {
    // Create item
    res.set('Access-Control-Allow-Origin', '*');
    const item = new Item({
        type: req.body.type,
        color: req.body.color,
        season: req.body.season,
        store: req.body.store
    });

    // Save item in  database
    item.save()
        .then(data => {
            //var imageBuffer = new Buffer(req.body.image, 'base64');
            const query = 'INSERT INTO img_store (key, image) VALUES (?, ?)';
            client.execute(query, [data.id, req.body.image], { prepare: true }, function (err, result) {
                assert.ifError(err);
                res.send(data);
            });

        }).catch(err => {

            Item.findByIdAndRemove(req.params.itemID)
                .then(item => {
                    if (!item) {
                        return res.status(404).send({
                            message: "Item not found with id " + req.params.itemID
                        });
                    }
                    res.send({ message: "Item deleted successfully" });
                }).catch(err => {
                    if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                        return res.status(404).send({
                            message: "Item not found with id " + req.params.itemID
                        });
                    }
                    return res.status(500).send({
                        message: "Could not delete item with id " + req.params.itemID
                    });
                });


            res.status(500).send({
                message: err.message || "Some error occurred while creating the item."
            });
        });
};

// Retrieve and return all items from the database.
exports.findAll = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    Item.find()
        .then(item => {
            res.send(item);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving items."
            });
        });
};

// Retrieve and return all items from the database.
exports.findAllImages = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const query = 'SELECT image FROM img_store';
    client.execute(query, [], { prepare: true }, function (err, images) {
        assert.ifError(err);
        res.send(images);
    })
};


// Update items
exports.put = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Find item and update it with the request body
    Item.findByIdAndUpdate(req.params.itemID, {
        type: req.body.type,
        color: req.body.color,
        season: req.body.season,
        store: req.body.store
    }, { new: true })  //returns modified doc 
        .then(item => {
            if (!item) {
                return res.status(404).send({
                    message: "Item not found with id " + req.params.itemID
                });
            }
            res.send(item);

        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Item not found with id " + req.params.itemID
                });
            }
            return res.status(500).send({
                message: "Error updating item with id " + req.params.itemID
            });
        });
};

// Find a single item's image with a itemID
exports.findOneImage = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    Item.findById(req.params.itemID)
        .then(item => {
            if (!item) {
                return res.status(404).send({
                    message: "Item not found with id " + req.params.itemID
                });
            }
            const query = 'SELECT image FROM img_store WHERE key = ?';
            // Set the prepare flag in your queryOptions
            client.execute(query, [String(item._id)], { prepare: true }, function (err, image) {
                assert.ifError(err);
                if(image.rows.length !=0){
                res.send(image.rows[0].image);}
                else{
                    return res.status(404).send({
                        message: "Image not found with id " + req.params.itemID
                    });
                }

            });
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Item not found with id " + req.params.itemID
                });
            }
            return res.status(500).send({
                message: "Error retrieving item with id " + req.params.itemID
            });
        });
};

// Find a single item with a itemID
exports.findOne = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    Item.findById(req.params.itemID)
        .then(item => {
            if (!item) {
                return res.status(404).send({
                    message: "Item not found with id " + req.params.itemID
                });
            }
            res.send(item);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Item not found with id " + req.params.itemID
                });
            }
            return res.status(500).send({
                message: "Error retrieving item with id " + req.params.itemID
            });
        });
};

// Delete item with the specified itemID in the request
exports.delete = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    Item.findByIdAndRemove(req.params.itemID)
        .then(item => {
            if (!item) {
                return res.status(404).send({
                    message: "Item not found with id " + req.params.itemID
                });
            }

            const query = "DELETE FROM img_store WHERE key= ? ";
            client.execute(query, [req.params.itemID], { prepare: true }, function (err, result) {
                assert.ifError(err);
                res.send({ message: "Item deleted successfully" });
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Item not found with id " + req.params.itemID
                });
            }
            return res.status(500).send({
                message: "Could not delete item with id " + req.params.itemID
            });
        });

};

// Retrieve and return all items from the database.
exports.findWithCondition = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    Item.find({
        $or: [
            { type: req.body.type },
            { color: req.body.color },
            { season: req.body.season },
            {store: req.body.store}

        ]
    })
        .then(item => {
            res.send(item);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving items."
            });
        });

};

// UTILITY FUNCTIONS

// Retrieve and return all colors
exports.findColors = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    Item.find().distinct("color")
        .then(item => {
            res.send(item);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving items."
            });
        });
};

// Retrieve and return all colors
exports.findTypes = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    Item.find().distinct("type")
        .then(item => {
            res.send(item);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving items."
            });
        });
};

// Retrieve and return all colors
exports.findSeasons = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    Item.find().distinct("season")
        .then(item => {
            res.send(item);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving items."
            });
        });
};

// Retrieve and return all stores
exports.findStores = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    Item.find().distinct("store")
        .then(item => {
            res.send(item);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving items."
            });
        });
};

// Retrieve and return all items from the database ordered by date of creation .
exports.findItemsByDate = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    Item.find().sort({createdAt: 'desc'})
        .then(item => {
            res.send(item);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving items."
            });
        });
};

// Retrieve and return all items from the database ordered by date of last modification
exports.findItemsByDateUpdated = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    Item.find().sort({updatedAt: 'desc'})
        .then(item => {
            res.send(item);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving items."
            });
        });
};