const taskList = {};
let idCount = 0;

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, {
    'Content-Type': 'application/json',
  });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, {
    'Content-Type': 'application/json',
  });
  response.end();
};

const notFound = (request, response) => {
  const responseJSON = {
    id: 'notFound',
    message: 'The page you are looking for was not found.',
  };

  if (request.method === 'HEAD') {
    return respondJSONMeta(request, response, 404);
  }

  return respondJSON(request, response, 404, responseJSON);
};

const badRequest = (request, response) => {
  const responseJSON = {
    id: 'badRequest',
    message: 'Bad Request my dude',
  };

  return respondJSON(request, response, 400, responseJSON);
};

const queryResults = (type, text, active) => {
  if (type === 'task') {
    let counter = 0;
    while (taskList[counter]) {
      if (taskList[counter].task.includes(text) && taskList[counter].active === active) {
        taskList[counter].search = true;
      } else {
        taskList[counter].search = false;
      }
      counter++;
    }

    return taskList;
  }
  if (type === 'desc') {
    let counter = 0;
    while (taskList[counter]) {
      if (taskList[counter].desc.includes(text) && taskList[counter].active === active) {
        taskList[counter].search = true;
      } else {
        taskList[counter].search = false;
      }
      counter++;
    }
    return taskList;
  }

  return null;
};

const getTasks = (request, response, query) => {
  if (request.method === 'HEAD') {
    return respondJSONMeta(request, response, 200);
  }

  const responseJSON = {
    taskList,
  };

  if (query.text) {
    const searchResults = queryResults(query.type, query.text, true);

    if (queryResults === null) return badRequest(request, response);

    return respondJSON(request, response, 200, searchResults);
  }

  return respondJSON(request, response, 200, responseJSON);
};

const addTask = (request, response, body) => {
  // set the note in here equal to the string
  const responseJSON = {
    id: idCount,
    task: body.task,
    desc: body.desc,
    active: true,
    search: false,
  };

  taskList[idCount] = {};

  taskList[idCount].id = responseJSON.id;
  taskList[idCount].task = responseJSON.task;
  taskList[idCount].desc = responseJSON.desc;
  taskList[idCount].active = responseJSON.active;
  taskList[idCount].search = responseJSON.search;

  idCount++;

  return respondJSON(request, response, 201, responseJSON);
};

const removeTask = (request, response, body) => {
  taskList[body.id].active = false;
  return respondJSONMeta(request, response, 204);
};

module.exports = {
  getTasks,
  addTask,
  removeTask,
  notFound,
};