module.exports = function(app) {

  // Front end routes
  app.get('/', function(req, res) {
    res.render('ide');
  });
  app.get('/term', function(req, res) {
    res.render('index');
  });
  app.get('/ide', function(req, res) {
    res.render('ide');
  });
}
