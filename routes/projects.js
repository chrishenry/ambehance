
/*
 * GET projects listing.
 */

exports.index = function(req, res){

  var request = require('request');

  var key = '&api_key=eAzgLef3CezLbZcDn11bUztYd7XQ3at1';

  var url = 'http://www.behance.net/v2/projects?color_hex=DE7600&color_range=20&api_key=eAzgLef3CezLbZcDn11bUztYd7XQ3at1';

  //Tell the request that we want to fetch a url, send the results to a callback function
  request({uri: url}, function(err, response, body) {

    //Just a basic error check
    if(err && response.statusCode !== 200){
      console.log('Request error.');
    }

    api_resp = JSON.parse(response.body);

    console.log(api_resp.projects[0].covers['202']);

  });

  res.end();

};
