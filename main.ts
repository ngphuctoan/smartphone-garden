// @ts-types="npm:@types/express"
import express from "express";

const PORT = Deno.env.get("PORT") || 3000;

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to the Dinosaur API!");
});

app.listen(PORT);
console.log(`Server started on "localhost:${PORT}"!`);
