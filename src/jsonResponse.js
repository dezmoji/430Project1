const noteList = {};
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

const getNotes = (request, response, query) => {
  const responseJSON = {
    noteList,
  };

  if (query != null) {
    // const searchList = {};
    // set notes in responseJSON equal to searchList

    return respondJSON(request, response, 200, responseJSON);
  }

  return respondJSON(request, response, 200, responseJSON);
};

const addNote = (request, response, body) => {
  // set the note in here equal to the string
  const responseJSON = {
    topic: body.topic,
    note: body.note,
  };

  if (!responseJSON.topic) {
    responseJSON.topic = 'Untitled';
  }

  noteList[idCount] = {};

  noteList[idCount].id = idCount;
  noteList[idCount].topic = responseJSON.topic;
  noteList[idCount].note = responseJSON.note;

  console.log(noteList);

  idCount++;

  return respondJSON(request, response, 201, responseJSON);
};

const removeNote = (request, response) => respondJSONMeta(request, response, 204);

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
  getNotes,
  addNote,
  removeNote,
  notFound,
};
