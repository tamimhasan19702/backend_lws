/** @format */

const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const todoSchema = require("./todoSchema");
const Todo = new mongoose.model("Todo", todoSchema);

//GET ALL THE TODO
router.get("/", async (req, res) => {});

//GET A TODO by ID
router.get("/:id", async (req, res) => {});

//POST TODO
router.post("/", async (req, res) => {
    const newTodo = new Todo(req.body)
    await newTodo.save((err) => {
        if(!err){
            res.status(200).json({
                message: "Todo Created Successfully"
            })
        }else{
            res.status(500).json({
                error: 'There was a server side error!!'
            })
        }
    });
});

//POST or update MULTIPLE TODO
router.post("/all", async (req, res) => {
    await Todo.insertMany(req.body, (err) => {
        if(err){
            res.status(500).json({
                error: "There was a server side error!!"
            })
        } else{
            res.status(200).json({
                message: "Todos Created Successfully"
            })
        }
    })
});

//put Todo
router.put("/:id", async (req, res) => {
    await Todo.findByIdAndUpdate({_id: req.params.id}, {
        $set: {
            status: 'active'
        }
    }, (err) => {
        if(err){
            res.status(500).json({
                error: "There was a server side error!!"
            })
        } else{
            res.status(200).json({
                message: "Todo Updated Successfully"
            })
        }
    });
});


//delete todo
router.delete("/:id", async (req, res) => {});

module.exports = router;
