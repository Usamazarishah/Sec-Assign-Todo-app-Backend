import express from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 5000
const todos = []

 //to convert body into JSON 
app.use(express.json());

app.use(cors({ origin: ["https://graceful-vacherin-54fc59.netlify.app","http://localhost:5173"]}));


// get all todos api
app.get('/api/v1/todos', (req, res) => {

  const message = !todos.length ? "todo empty" : "all todos fetched"

  res.status(200).send({data : todos, message : message});
}),


// add todo api
app.post('/api/v1/todo', (req, res) => {
    
    const todo = req.body.todo
    const obj = {
      todoContent : todo,
      id : String(new Date().getTime())
    } 

    todos.push(obj)
    res.status(201).send({data:obj, message:"todo is added successfully!"})
}),


// edit or update todo api
app.patch('/api/v1/todo/:id', (req, res) => {
   const id = req.params.id
   
   let isFound = false;
   for(let i = 0; i < todos.length; i++){

    if (todos[i].id === id) {
      //idher todo mil gaya ha (ab usko update karna ha)

      todos[i].todoContent = req.body.todoContent
      isFound = true
      break;
    }
    
   }

   if(isFound){
    res.status(201).send({
      data:{todoContent: req.body.todoContent, id: id},
      message:'todo is updated successfully!'
    })

   }else{
    res.status(200).send({data:null, message:'todo not found!'})

   }

}),


// delete todo api
app.delete('/api/v1/todo/:id', (req, res) => {
  const id = req.params.id
   
  let isFound = false;
  for(let i = 0; i < todos.length; i++){

   if (todos[i].id === id) {
     //idher todo mil gaya ha (ab usko delete karna ha)

     todos.splice(i, 1)

     isFound = true
     break;
   }

  }

  if(isFound){
   res.status(201).send({
    //  data:{todoContent: req.body.todoContent, id: id},
     message:'todo is deleted successfully!',
   })

  }else{
   res.status(200).send({data:null, message:'todo not found!'})

  }

}),


// no route found api
app.use((req, res) => {
    res.status(404).send('no route found!')
}),

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})