// server.js
// where your node app starts

// init project
import express from "express";
import nunjucks from "nunjucks";
import sassMiddleware from "node-sass-middleware";
import markdown from "nunjucks-markdown";

var app = express();

var environment = nunjucks.configure([
  './node_modules/govuk-frontend/govuk/',
  './node_modules/govuk-frontend/govuk/components/',
  './views'
], {
  express: app,
  autoescape: true, // output with dangerous characters are escaped automatically
  noCache: true,
  watch: true
});

// Add custom markdown tag
import renderer from "./lib/markdown/renderer-with-classes.js";
markdown.register(environment, renderer)

// Set nunjucks as the view engine for express
app.set('view engine', 'njk')

// Compile SCSS on the fly, not recommended in production.
app.use(sassMiddleware({
  src: 'src/styles/',
  dest: 'public/'
}));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public', { maxAge: '1d' }));

// Allow views to access node_modules.
app.use('/html5shiv/', express.static('./node_modules/html5shiv', { maxAge: '1d' }));
app.use('/govuk-frontend/', express.static('./node_modules/govuk-frontend/govuk', { maxAge: '1d' }));

// Allow views access to assets
app.use('/assets', express.static('./node_modules/govuk-frontend/govuk/assets', { maxAge: '1d' }));

app.get("/", function (request, response, next) {
  
  // Get the glitch project name, used to have dynamic remix links that work for remixed projects.
  const glitchProjectName = request.subdomains[0]
  response.send(
    environment.render('index.html', { glitchProjectName })
  )
});

app.get("/test", function (request, response, next) {
  
  // Get the glitch project name, used to have dynamic remix links that work for remixed projects.
  const glitchProjectName = request.subdomains[0]
  response.send(
    environment.render('test.md', { glitchProjectName })
  )
});

// listen for requests :)
var listener = app.listen(process.env.PORT || 1234, function () {
  console.log(
    "Prototype started at http://localhost:" + listener.address().port
  );
});
