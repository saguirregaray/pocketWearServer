module.exports = (app) => {
    const user = require('../controllers/user.controller.js');

    // Create new user
    app.post('/user', user.create);

    // Delete an user data with id
    app.delete('/user/:userID', user.delete);

     // Retrieve a single item data with id
     app.get('/user/:userID', user.findOne); 

    // Retrieve all users
    app.get('/user', user.findAll); 

     //update user data
     app.put('/user/:userID', user.put);  
}                    