module.exports = (app) => {
    const userInventory = require('../controllers/userInventory.controller.js');

    // Create new userInventory
    app.post('/userInventory', userInventory.create);

    // Delete an userInventory data with id
    app.delete('/userInventory/:userID', userInventory.delete);

     // Retrieve a single userInventory data with id of user 
     app.get('/userInventory/:userID', userInventory.findByUserID); 

    // Retrieve all userInventory
    app.get('/userInventory', userInventory.findAll); 

     //update userInventory data using user id 
     app.put('/userInventory/:userID', userInventory.put);  
}  