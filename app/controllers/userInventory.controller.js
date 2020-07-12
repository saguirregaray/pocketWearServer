const UserInventory = require('../models/userInventory.model.js');
var assert = require('assert');

// Create and Save user inv
exports.create = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Create userInventory
    const userInventory = new UserInventory({
        userID: req.body.userID,
        items: req.body.items,
    });
    // Save userInventory in  database
    userInventory.save()
        .then(userInventory => {

            res.send(userInventory);

        }).catch(err => {

            if (!userInventory) {
                return res.status(400).send({
                    message: err.message || "Some error occurred while creating the user inventory."
                });
            }
            return res.status(500).send({
                message: err.message || "Some error occurred while creating the user inventory."
            });
        });
};

// Find a single user inv with a userInventoryID
exports.findOne = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    UserInventory.findById(req.params.userInventoryID)
        .then(userInventory => {
            if (!userInventory) {
                return res.status(404).send({
                    message: "User inventory not found with id " + req.params.userInventoryID
                });
            }
            res.send(userInventory);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User inventory not found with id " + req.params.userInventoryID
                });
            }
            return res.status(500).send({
                message: "Error retrieving user inventory with id " + req.params.userInventoryID
            });
        });
};

// Delete userInventory with the specified userID in the request
exports.delete = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    UserInventory.find({ userID: req.body.userID })
        .then(userInventory => {
            return userInventory
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving user inventory."
            });
        }).then(userInventory => {
            UserInventory.findByIdAndRemove(userInventory[0]._id)
                .then(userInventory => {
                    if (!userInventory) {
                        return res.status(404).send({
                            message: "User inventory not found with id " + userInventory[0]._id
                        });
                    }
                    res.send({ message: "Item deleted successfully" });

                }).catch(err => {
                    if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                        return res.status(404).send({
                            message: "User inventory not found with id " + userInventory[0]._id
                        });
                    }
                    return res.status(500).send({
                        message: "Could not delete user inventory with id " + req.params.userInventoryID
                    });
                });
        })

};
// Retrieve and return all item from the database linked to a certain user.
exports.findByUserID = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    UserInventory.find({ userID: req.body.userID })
        .then(userInventory => {
            res.send(userInventory);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving user inventory."
            });
        });

};

// Update user
exports.put = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    UserInventory.find({ userID: req.body.userID })
        .then(userInventory => {
            return userInventory
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving user inventory."
            });
        }).then(userInventory => {
            // Find user and update it with the request body
            UserInventory.findByIdAndUpdate(userInventory[0]._id, {
                userID: req.body.userID,
                items: req.body.items
            }, { new: true })  //returns modified doc 
                .then(userInventory => {
                    if (!userInventory) {
                        return res.status(404).send({
                            message: "User inventory not found with id " + userInventory[0]._id
                        });
                    }
                    res.send(userInventory);

                }).catch(err => {
                    console.log(err)
                    if (err.kind === 'ObjectId') {
                        return res.status(404).send({
                            message: "User inventory not found with id " + userInventory[0]._id
                        });
                    }
                    return res.status(500).send({
                        message: "Error updating userInventory with id " + userInventory[0]._id
                    });
                });
        })


};

// Retrieve and return all users inventories from the database.
exports.findAll = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    UserInventory.find()
        .then(userInventory => {
            res.send(userInventory);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users inventories."
            });
        });
};