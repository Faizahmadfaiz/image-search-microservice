var mongoose = require('mongoose')
    express  = require('express'),
    request  = require('request'),
    ejs      = require('ejs'),
    app      = express();

//require routes
var indexRoutes = require('./routes/index.js');
var apiRoutes = require('./routes/api.js');

//APP CONFIG
var mLab = process.env.MONGOLAB_URI || 'mongodb://localhost/image_search_api';
mongoose.connect(mLab);
app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 3000));


app.use('/', indexRoutes);
app.use('/api', apiRoutes);

app.listen(app.get('port'), function() {
  console.log('Image Search Microservice is running');
});