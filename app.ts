import express from "express";
import { Eta } from "eta";
import path from "node:path";
import router from "#/routers.ts";

const PORT = process.env.PORT || 3000;

const app = express();

const eta = new Eta({
  views: path.join(import.meta.dirname, "views"),
  cache: true,
});

app.engine("eta", (path, opts, callback) => {
  try {
    const fileContent = eta.readFile(path);
    const renderedTemplate = eta.renderString(fileContent, opts);
    callback(null, renderedTemplate);
  } catch (error) {
    callback(error);
  }
});
app.set("view engine", "eta");

app.use(router);

app.listen(PORT);
console.log(`Server started on "localhost:${PORT}"!`);
