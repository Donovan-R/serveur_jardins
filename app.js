require('dotenv').config();
require('express-async-errors');
const cors = require('cors');

const express = require('express');
const app = express();

// const authenticateUser = require('./middleware/authentication.js');
//* routers
const authRouter = require('./routes/auth.js');
// const tasksRouter = require('./routes/tasks.js');

const notFound = require('./middleware/notFound.js');
const errorHandler = require('./middleware/error-handler.js');

app.use(cors());
app.use(express.json());

//* routes
app.use('/api/v1/auth', authRouter);
// app.use('/api/v1/tasks', authenticateUser, tasksRouter);

//*middleware
app.use(notFound);
app.use(errorHandler);

app.listen(5000, () => {
  console.log('Le serveur écoute sur le port 5000...');
});
