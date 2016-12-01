// server/index.js

// other dependencies installed via `npm install --save-dev`
var bodyParser = require('body-parser');

module.exports = function(app) {

  app.use(bodyParser.json({ type: "application/json" }));

  app.get('/api/foo', function(req, res) {
    res.send({ result: "bar"});
  });

  app.get('/api/now', function(req, res) {
    res.send({ now: new Date().getTime() });
  });

};