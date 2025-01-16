import express, { response } from "express";
import cors from "cors";
import 'dotenv/config'
import "./database.js";
import { Todo } from "./models/index.js";

const app = express();
const port = process.env.PORT || 5000;

//to convert body into JSON
app.use(express.json());

app.use(cors({ origin: ["https://sec-assign-todo.netlify.app", "http://localhost:5173"] }));


// get all todos api
app.get("/api/v1/todos", async (req, res) => {
  try {
    const todos = await Todo.find(
      {},
      //ye data base se data fetch karne ka method ha
      // projection ma hum data ko filter kar sakte ha konsa data front end pe aye ga or konsa nahi

      // {createdAt:0, updatedAt:0, __v:0, ip:0} //projection (0 wala front end pe nahi aye ga)
      // {todoContent:1, _id:0} //projection (1 wala front end pe aye ga, _id nahi aye ge sirf id ki exception ha (0, 1) ma)
      { todoContent: 1 } //projection (1 wala front end pe aye ga)
    );

    const message = !todos.length ? "todo empty" : "all todos fetched";

    res.status(200).send({ data: todos, message: message });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
}),


  // add todo api
  app.post("/api/v1/todo", async (req, res) => {
    try {
      const todo = req.body.todo;
      const obj = {
        todoContent: todo,
        ip: req.ip,
      };

      // todos.push(obj)
      const result = await Todo.create(obj);

      res
        .status(201)
        .send({ data: result, message: "todo is added successfully!" });
    } catch (error) {
      res.status(400).send("network error");
    }
  }),


  // edit or update todo api
  app.patch("/api/v1/todo/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const result = await Todo.findByIdAndUpdate(id, {
        todoContent: req.body.todoContent,
      });
      console.log("result=>", result);

      if (result) {
        res.status(202).send({
          data: result,
          message: "todo is updated successfully!",
        });
      } else {
        res.status(404).send({ data: null, message: "todo not found!" });
      }
    } catch (error) {
      res.status(404).send("id not found");
    }
  }),


  // delete todo api
  app.delete("/api/v1/todo/:id", async(req, res) => {
    try {
      const id = req.params.id;

      const result = await Todo.findByIdAndDelete(id);

      if (result) {
        res.status(200).send({
          message: "todo is deleted successfully!",
        });
      } else {
        res.status(204).send({ data: null, message: "todo not found!" });
      }
    } catch (error) {
      res.status(204).send("No content found");
    }
  }),


  // no route found api
  app.use((req, res) => {
    res.status(404).send({ message: "no route found!" });
  }),
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
