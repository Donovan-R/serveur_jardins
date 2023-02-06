const { StatusCodes } = require('http-status-codes');
const db = require('../db');
const { BadRequestError, NotFoundError } = require('../errors');

//* create
const createTask = async (req, res) => {
  const { name } = req.body;
  const { userID } = req.user;

  const {
    rows: [task],
  } = await db.query(
    'insert into tasks (  user_id, name) VALUES ($1, $2) RETURNING *',
    [userID, name]
  );
  res.status(StatusCodes.CREATED).json({ task });
};

//*getAll

const getAllTasks = async (req, res) => {
  const { userID } = req.user;
  const { rows: tasks } = await db.query(
    'select * from tasks where user_id= $1',
    [userID]
  );

  res.status(StatusCodes.OK).json({ tasks, count: tasks.length });
};

//*update
const updateTask = async (req, res) => {
  const { name, is_completed } = req.body;

  const { id: taskID } = req.params;

  if (!name) {
    throw new BadRequestError('invalide');
  }

  const {
    rows: [task],
  } = await db.query(
    'UPDATE tasks SET name = $1, is_completed = $2 WHERE task_id = $3 RETURNING *',
    [name, is_completed, taskID]
  );
  if (!task) {
    throw new NotFoundError(`Pas de tâche avec l'id : ${taskID}`);
  }

  res.status(StatusCodes.OK).json({ task });
};

//* update check_task

const checkTask = async (req, res) => {
  const { id: taskID } = req.params;

  const {
    rows: [task],
  } = await db.query(
    'UPDATE tasks SET is_completed = NOT is_completed WHERE task_id = $1 RETURNING *',
    [taskID]
  );

  if (!task) {
    throw new NotFoundError(`Pas de tâche avec l'id : ${taskID}`);
  }

  res.status(StatusCodes.OK).json({ task });
};

//* delete
const deleteTask = async (req, res) => {
  const { id: taskID } = req.params;
  const {
    rows: [task],
  } = await db.query('DELETE FROM tasks WHERE task_id = $1 RETURNING *', [
    taskID,
  ]);
  if (!task) {
    throw new NotFoundError(`Pas de tâche avec l'id : ${taskID}`);
  }

  res.status(StatusCodes.OK).json({ task });
};

//*deleteAllTasks
const deleteAllTasks = async (req, res) => {
  const { rows } = await db.query('DELETE FROM tasks');

  res.status(StatusCodes.OK).end();
};

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  deleteAllTasks,
  checkTask,
};
