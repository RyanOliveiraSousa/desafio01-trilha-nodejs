const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const {username} = request.headers

  const user = users.find((user) => user.username === username)

  if(!user){

      return response.status(404).json({
        error: 'Mensagem do erro'
      })
  }

    request.user = user

   return next() 
}

app.post('/users', (request, response) => {
  // Complete aqui
    const { name, username } = request.body

    const userAlreadyExist = users.some((user) => user.username === username)

    if(userAlreadyExist){

      return response.status(400).json({
        error: 'Mensagem do erro'
      })
    }

    const user = {
      id: uuidv4(),
      name,
      username,
      todos: [],

    }

    users.push(user)

    return response.status(201).json(user)

});

app.get('/todos',checksExistsUserAccount,(request, response) => {
  // Complete aqui

  const {user} = request  
  return response.json(user.todos)

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline} = request.body
  const {user} = request

  const newTodo = {

    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()

  }
  user.todos.push(newTodo)

  return response.status(201).json(newTodo)



});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  const {title,deadline} = request.body
  const { id } = request.params

  const attTodo = user.todos.find((user ) => user.id === id)

  if(!attTodo){

      return response.status(404).json({error: "Mensagem do erro"})

  }


attTodo.title = title
attTodo.deadline = deadline

return response.json(attTodo)



});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  const { id } = request.params
  const { done} = request.body
  const attTodo = user.todos.find((user ) => user.id === id)

  if(!attTodo){

      return response.status(404).json({error: "Mensagem do erro"})
      
  }

  attTodo.done = true

  return response.json(attTodo)



});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  const { id } = request.params

  const idDelete = user.todos.findIndex((user ) => user.id === id)

  if(idDelete === -1){

    return response.status(404).json({error:"Mensagem do erro"})

  }
  user.todos.splice(idDelete, 1)

  return response.status(204).json()
  
});

module.exports = app;


