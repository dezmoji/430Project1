// holds all of the tasks that are added by users
const taskList = {};
let idCount = 0;

// respond to the server
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, {
    'Content-Type': 'application/json',
  });
  response.write(JSON.stringify(object));
  response.end();
};

// respond to the server with only meta data
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, {
    'Content-Type': 'application/json',
  });
  response.end();
};

// method to handle not found responses
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

// method to handle bad request responses
const badRequest = (request, response) => {
  const responseJSON = {
    id: 'badRequest',
    message: 'Invalid query parameters passed in',
  };

  return respondJSON(request, response, 400, responseJSON);
};

// method that alters the search property in the task list based on query parameters
const queryResults = (type, text, active) => {
  // if the search type is searching the task string
  if (type === 'task') {
    // loop through the task list object
    let counter = 0;
    while (taskList[counter]) {
      // if the search text is in the task string and the active property of the object
      // matches the active variable passed in, set the search property to true
      if (taskList[counter].task.includes(text) && taskList[counter].active === active) {
        taskList[counter].search = true;
      } else {
        // otherwise, set the search property to false
        taskList[counter].search = false;
      }
      counter++;
    }

    return taskList;
  }

  // if the search type is searching the description string
  if (type === 'desc') {
    // loop through the task list object
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

  // return null if the type is invalid
  return null;
};

// method to handle getting tasks
const getTasks = (request, response, query) => {
  // respond with only the HEAD if it is a head request
  if (request.method === 'HEAD') {
    return respondJSONMeta(request, response, 200);
  }

  // create an object to hold the response
  const responseJSON = {
    taskList,
  };

  // if there a text parameter from the query exists
  if (query.text) {
    // get search results
    const searchResults = queryResults(query.type, query.text, true);

    // if the search results are empty, send a bad request response
    if (searchResults === null) return badRequest(request, response);

    // otherwise return the response
    return respondJSON(request, response, 200, searchResults);
  }

  // return a json response
  return respondJSON(request, response, 200, responseJSON);
};

// method to add a task to the task list
const addTask = (request, response, body) => {
  // set up the response to the client
  const responseJSON = {
    id: idCount,
    task: body.task,
    desc: body.desc,
    active: true,
    search: false,
  };

  // create the task and add it to the task list object
  taskList[idCount] = {};

  taskList[idCount].id = responseJSON.id;
  taskList[idCount].task = responseJSON.task;
  taskList[idCount].desc = responseJSON.desc;
  taskList[idCount].active = responseJSON.active;
  taskList[idCount].search = responseJSON.search;

  // increment the id count
  idCount++;

  // return the response
  return respondJSON(request, response, 201, responseJSON);
};

// "removes" the task
const removeTask = (request, response, body) => {
  // set the active property of the task to false as it is now no longer active
  taskList[body.id].active = false;

  // send the response
  return respondJSONMeta(request, response, 204);
};

module.exports = {
  getTasks,
  addTask,
  removeTask,
  notFound,
};
