const express = require('express');

const server = express(); 

server.use(express.json()); 

const users = ['Nilderson', 'Milena', 'Marcia'];

//Middleware Global
server.use((req, res, next) => {
  console.time('request');
  console.log(`Metodo: ${req.method}, URL ${req.url}`);

  next();

  console.timeEnd('request');
});

//Middleware Local
function checkUserNameExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'User name is required!'});
  } 

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: "User does not exists!"});
  }

  req.user = user;

  return next();

}

// Consultar - Listar todos os usuario
server.get('/users', (req, res) => {
  return res.json(users); // Lista todos os usuários 
});

// Consultar - Listar um usuario
server.get('/users/:index', checkUserInArray, (req, res) => {
  return res.json({message : `Exibindo o usuário ` + req.user});
});

// Create
server.post('/users', checkUserNameExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

// Update
server.put('/users/:index', checkUserNameExists, checkUserInArray, (req, res) => {
    const { index } = req.params;
    const { name }  = req.body;

    users[index] = name; 

    return res.json(users);
});

// Delete

server.delete("/users/:index", (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

server.listen(3000)