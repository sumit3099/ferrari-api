let mongoose = require('mongoose');
//mongoose.connect('mongodb://172.17.123.204:27017/ferrari');
mongoose.connect('mongodb://mongosql.westus2.cloudapp.azure.com:27017/ferrari', { user: 'ferrari', pass: 'Welcome123$' });
let db = mongoose.connection;
db.once('open', function() {
    console.log(" Database is connected!");
});