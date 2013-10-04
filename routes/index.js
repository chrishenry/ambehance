
/*
 * GET home page.
 */

exports.index = function(req, res){
  console.log(req.query.color);

  var hue = require("node-hue-api"),
      HueApi = hue.HueApi,
      lightState = hue.lightState;

  var displayResult = function(result) {
      console.log(JSON.stringify(result, null, 2));
  };

  var displayError = function(err) {
      console.error(err);
  };

  var api = new HueApi(app.get('hue_ip'), app.get('hue_username')),
      state = lightState.create().on().white(500, 33);

  api.lights()
      .then(displayResult)
      .done();

  // Delete a user
  // api.deleteUser(req.query.deleteUser)
  //     .then(displayResult)
  //     .fail(displayError)
  //     .done();

  // Set the lamp with id '2' to on
  api.setLightState(1, state)
      .then(displayResult)
      .fail(displayError)
      .done();

  api.setLightState(2, state)
      .then(displayResult)
      .fail(displayError)
      .done();

  api.setLightState(3, state)
      .then(displayResult)
      .fail(displayError)
      .done();


  // --------------------------
  // Using a callback
  api.connect(function(err, config) {
      if (err) throw err;
      displayResult(config);
  });

  res.render('index', { title: app.get('title') });
};
