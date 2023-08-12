/** @format */

const express = require("express");
const router = express.Router();

//GET ALL THE TODO
router.get("/", async (req, res) => {});

//GET A TODO by ID
router.get("/:id", async (req, res) => {});

//POST TODO
router.post("/", async (req, res) => {});

//POST MULTIPLE TODO
router.post("/all", async (req, res) => {});

//put Todo
router.put("/:id", async (req, res) => {});

//delete todo
router.delete("/:id", async (req, res) => {});

module.exports = router;
