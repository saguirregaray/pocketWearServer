const User = require('../models/user.model.js');
var assert = require('assert');

// Create and Save user
exports.create = (req, res) => {
    // Create user
    const user = new User({
        user: req.body.user,
        password: req.body.password,
    });
    // Save user in  database
    user.save()
        .then(user => {
           
            res.send(user);
        
        }).catch(err => {
           
            if (!user){
                return res.status(400).send({
                    message: err.message || "Some error occurred while creating the user."
                });
            }
            return res.status(500).send({
                message: err.message || "Some error occurred while creating the user."
            });
        });
};

// Find a single user with a userID
exports.findOne = (req, res) => {

    User.findById(req.params.userID)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userID
                });
            }
            res.send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userID
                });
            }
            return res.status(500).send({
                message: "Error retrieving user with id " + req.params.userID
            });
        });
};

// Delete user with the specified userID in the request
exports.delete = (req, res) => {

    User.findByIdAndRemove(req.params.userID)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userID
                });
            }
            res.send({ message: "Item deleted successfully" });

        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userID
                });
            }
            return res.status(500).send({
                message: "Could not delete user with id " + req.params.userID
            });
        });

};

// Update user
exports.put = (req, res) => {
    // Find user and update it with the request body
    User.findByIdAndUpdate(req.params.userID, {
        user: req.body.user,
        password: req.body.password,
    }, { new: true })  //returns modified doc 
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userID
                });
            }
            res.send(user);

        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userID
                });
            }
            return res.status(500).send({
                message: "Error updating user with id " + req.params.userID
            });
        });
};

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
    User.find()
        .then(user => {
            res.send(user);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        });
};