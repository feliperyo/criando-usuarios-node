const express = require("express");
const uuid = require("uuid");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const users = [];

const checkUsersId = (request, response, next) => {
  const { id } = request.params;

  const index = users.findIndex((user) => user.id === id);

  if (index < 0) {
    return response.status(404).json({ message: "User not found" });
  }

  request.userIndex = index;
  request.userId = id;

  next();
};

app.get("/users", (request, response) => {
  return response.json(users);
});

app.post("/users", (request, response) => {
  const { name, age } = request.body;

  const user = { id: uuid.v4(), name, age };
  users.push(user);

  return response.status(201).json(user);
});

app.put("/users/:id", checkUsersId, (request, response) => {
  const id = request.userId;
  const index = request.userIndex;
  const { name, age } = request.body;

  const updatedUser = { id, name, age };

  users[index] = updatedUser;

  return response.json(updatedUser);
});

app.delete("/users/:id", checkUsersId, (request, response) => {
  const index = request.userIndex;

  users.splice(index, 1);

  return response.status(204).json();
});

app.listen(process.env.PORT || 3001, () => {
  console.log('Server started');
});
