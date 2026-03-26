import express from "express";

import * as ProductController from "#/controllers/products.ts";

const router = express.Router();

router.get("/", ProductController.index);

export default router;
