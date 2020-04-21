const express = require("express");
const cors = require("cors");
const { uuid } = require('uuidv4');

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(newRepo);

  return response.status(201).json(newRepo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs, likes } = request.body;

  const index = repositories.findIndex(repo => repo.id === id);

  if (index < 0) {
    return response.status(400).json({ error: 'not found' });
  }

  if (likes) {
    return response.status(200).json({ likes: repositories[index].likes });
  }

  const updated = {
    id,
    title: title ? title : repositories[index].title,
    url: url ? url : repositories[index].url,
    techs: techs ? techs : repositories[index].techs,
    like: repositories[index].like,
  };

  repositories[index] = updated;

  return response.status(200).json(updated);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex(repo => repo.id === id);

  if (index < 0) {
    return response.status(400).json({ error: 'not found' });
  }

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex(repo => repo.id === id);

  if (index < 0) {
    return response.status(400).json({ error: 'not found' });
  }

  repositories[index].likes++;

  return response.status(201).json({ likes: repositories[index].likes });
});

module.exports = app;
