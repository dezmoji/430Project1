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

const getTasks = (request, response, query) => {
  const responseJSON = {
    taskList,
  };

  if (query != null) {
    // const searchList = {};
    // set notes in responseJSON equal to searchList

    return respondJSON(request, response, 200, responseJSON);
  }

  return respondJSON(request, response, 200, responseJSON);
};

const addTask = (request, response, body) => {
  // set the note in here equal to the string
  const responseJSON = {
    task: body.task,
    desc: body.desc,
  };

  taskList[idCount] = {};

  taskList[idCount].id = idCount;
  taskList[idCount].task = responseJSON.task;
  taskList[idCount].desc = responseJSON.desc;

  console.log(taskList);

  idCount++;

  return respondJSON(request, response, 201, responseJSON);
};

const removeTask = (request, response) => respondJSONMeta(request, response, 204);

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

module.exports = {
  getTasks,
  addTask,
  removeTask,
  notFound,
};
