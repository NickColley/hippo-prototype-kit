import { existsSync, readFileSync } from "node:fs";
import express from "express";
import nunjucks from "nunjucks";
import markdown from "nunjucks-markdown";
import sassMiddleware from "node-sass-middleware";

import { LAYOUTS_DIR, BUFFER_DIR, PAGES_DIR } from "./constants.js";
import createNunjucksFileToRender from "./createNunjucksFileToRender.js";
import markdownRenderer from "./markdown/renderer-with-classes.js";

const app = express();

const environment = nunjucks.configure(
  [
    "./node_modules/govuk-frontend/govuk/",
    "./node_modules/govuk-frontend/govuk/components/",
    LAYOUTS_DIR,
    BUFFER_DIR,
    PAGES_DIR,
  ],
  {
    express: app,
    autoescape: true, // output with dangerous characters are escaped automatically
    noCache: true,
    watch: true,
  }
);

// Add custom markdown tag
markdown.register(environment, markdownRenderer);

// Set nunjucks as the view engine for express
app.set("view engine", "njk");

// Compile SCSS on the fly, not recommended in production.
app.use(
  sassMiddleware({
    src: "app/styles/",
    dest: "public/",
  })
);

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public", { maxAge: "1d" }));

// Allow views to access node_modules.
app.use(
  "/html5shiv/",
  express.static("./node_modules/html5shiv", { maxAge: "1d" })
);
app.use(
  "/govuk-frontend/",
  express.static("./node_modules/govuk-frontend/govuk", { maxAge: "1d" })
);

// Allow views access to assets
app.use(
  "/assets",
  express.static("./node_modules/govuk-frontend/govuk/assets", { maxAge: "1d" })
);

// Render pages based on their name.
app.get("/:pageName?", function (request, response, next) {
  // Get the glitch project name, used to have dynamic remix links that work for remixed projects.
  const glitchProjectName = request.subdomains[0];
  const { pageName } = request.params;

  const renderOptions = {
    glitchProjectName,
    pageName,
  };

  // Check if page exists
  const existingFile = getMatchingPageFile(pageName);

  if (!existingFile) {
    return next();
  }

  const fileContents = readFileSync(PAGES_DIR + existingFile, "utf-8");

  const isNunjucks = fileContents.includes("{%");
  if (isNunjucks) {
    return response.send(environment.render(existingFile, renderOptions));
  }

  // If it's raw Markdown put it into the template manually and render it.
  const isMarkdown = existingFile.endsWith(".md");
  if (isMarkdown) {
    return response.send(
      environment.render(
        createNunjucksFileToRender(fileContents, "markdown.njk"),
        renderOptions
      )
    );
  }

  // If it's raw HTML and isnt a full document put it into the template manually and render it.
  const isHTML = fileContents.trim().startsWith("<");
  const isFullHTMLDocument = fileContents.trim().startsWith("<!DOCTYPE");
  if (!isFullHTMLDocument && isHTML) {
    return response.send(
      environment.render(
        createNunjucksFileToRender(fileContents, "html.njk"),
        renderOptions
      )
    );
  }

  response.send(fileContents);
});

function getMatchingPageFile(pageName = "index") {
  const nunjucksFileName = `${pageName}.njk`;
  const htmlFileName = `${pageName}.html`;
  const markdownFileName = `${pageName}.md`;
  if (existsSync(PAGES_DIR + nunjucksFileName)) {
    return nunjucksFileName;
  }
  if (existsSync(PAGES_DIR + htmlFileName)) {
    return htmlFileName;
  }
  if (existsSync(PAGES_DIR + markdownFileName)) {
    return markdownFileName;
  }
}

const listener = app.listen(process.env.PORT || 1234, function () {
  console.log(
    "Prototype started at http://localhost:" + listener.address().port
  );
});
