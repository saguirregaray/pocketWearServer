module.exports = (app) => {
    const item = require('../controllers/item.controller.js');

    // Create new item
    app.post('/item', item.create);                      //Done

     // Delete an item data with id
    app.delete('/item/:itemID', item.delete);           //Done

    //DATA
    //update item data
    app.put('/item/:itemID', item.put);                     //Done

    // Retrieve all items data
    app.get('/item/data', item.findAll);                         //Done

    // Retrieve a single item data with id
    app.get('/item/data/:itemID', item.findOne);                 //Done

    // Retrieve items data by filter
    app.get('/item/dataFilters', item.findWithCondition);          //Done

    //IMAGES  

    // Retrieve all items images
    app.get('/itemImage', item.findAllImages);                 //Done

    // Retrieve a single item image with id
    app.get('/itemImage/:itemID', item.findOneImage);           //Done

    // UTILITY FUNCTIONS

    // Retrieve all colors to filter
    app.get('/colors', item.findColors);                 //Done

    // Retrieve all stores to filter
    app.get('/stores', item.findStores);            //Done

    // Retrieve all types to filter
    app.get('/types', item.findTypes);                      //Done

    // Retrieve all seasons
    app.get('/seasons', item.findSeasons);                  //Done

    // Retrieve all items ordered by creation date
    app.get('/item/date', item.findItemsByDate);            //Done

    // Retrieve all items ordered by lst update date
    app.get('/item/date/update', item.findItemsByDateUpdated);      //Done

 






}