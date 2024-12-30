const express = require("express"); //importing express
const mongoose = require("mongoose"); //importing mongoose
const cors = require("cors"); //importing cors

const app = express();
app.use(express.json());

app.use(cors());
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }) //connection with mongoose
  .then((result) => {
    console.log("db is connected");
  }) //response on connection of db
  .catch(console.error); //display error in case of error of connection

const Todo = require("./models/Todo"); //importing db schema form models

//get request that sends data to user
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

//post request to get data from db
app.post("/todo/new", (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });
  todo.save();
  res.json(todo);
});

//delete request to delete data from db with particular id
app.delete("/todo/delete/:id", async (req, res) => {
  const result = await Todo.findByIdAndDelete(req.params.id);

  res.json({ result });
});

//get data with particular id from db
app.get("/todo/complete/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.complete = !todo.complete;
  todo.save();
  res.json(todo);
});

//add data with particular id to db
app.put("/todo/update/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  todo.text = req.body.text;

  todo.save();

  res.json(todo);
});

app.listen(process.env.PORT);
