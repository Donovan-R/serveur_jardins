require('dotenv').config();
require('express-async-errors');
const cors = require('cors');

const express = require('express');
const app = express();

const fileUpload = require('express-fileupload');

const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const authenticateUser = require('./middleware/authentication.js');
//* routers
const authRouter = require('./routes/auth.js');
const tasksRouter = require('./routes/tasks.js');
const plantsRouter = require('./routes/plants.js');
const userRouter = require('./routes/account.js');
const adminRouter = require('./routes/dash.js');

const notFound = require('./middleware/notFound.js');
const errorHandler = require('./middleware/error-handler.js');

app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Methods',
    'GET,HEAD,OPTIONS,PUT,POST,DELETE'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});
app.use(express.json());

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

//* routes

app.use('/api/v1/plants', plantsRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/tasks', authenticateUser, tasksRouter);
app.use('/api/v1/account', authenticateUser, userRouter);
app.use('/api/v1/dash', authenticateUser, adminRouter);

//*middleware
app.use(notFound);
app.use(errorHandler);

//* pour mettre en ligne
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Le serveur écoute sur le port ${port}...`);
});
