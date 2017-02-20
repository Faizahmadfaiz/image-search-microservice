var express = require('express');
var router = express.Router();
var Image = require('../models/image.js');

router.get('/imagesearch/:term', function(req, res) {
  var term = req.params.term;
  var offset = req.query.offset;
  var count = 10;
  var baseUrl = 'https://api.cognitive.microsoft.com/bing/v5.0/images/search';
  var lastParams = 'mkt=en-us&safeSearch=Moderate';
  var url;

  //save the term in database
  Image.create({term: term}, function(err, data) {
    console.log(data + " inserted");
  });

  if(offset == undefined) {
    url = `${baseUrl}?q=${term}&count=${count}&${lastParams}`;
  } else {
    url = `${baseUrl}?q=${term}&count=${count}&offset=${offset}&${lastParams}`;
  }

  var options = {
    url: url,
    headers: {
      'Ocp-Apim-Subscription-Key': '110ccf055a434d408cb75613cab5eb83',
    }
  };

 getImageData(options)
  .then(
    function(imageData) {
      res.json(imageData);
    },
    function() {
      res.send('Some problem has occured,please try later :)');
    }
  ); 

});

router.get('/latest/imagesearch', function(req, res) {
  Image.find({}, '-_id term when').sort({when: -1}).limit(10).exec(function(err, docs) {
    res.json(docs);
  });
});




function getImageData(options) {
  return new Promise(function(resolve, reject) {

    function callback(error, response, body) {   
      var imageArray = [];
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        info.value.forEach(function(obj) {
          var imageObject = {
            url: obj.contentUrl,
            snippet: obj.name,
            tumbnail: obj.thumbnailUrl,
            context: obj.hostPageDisplayUrl
          };
          imageArray.push(imageObject);
        });
      }
      resolve(imageArray);
    }

    request(options, callback);
  });
}

module.exports = router;