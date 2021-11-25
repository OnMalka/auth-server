const express = require('express'); 
const cors = require('cors');

const port = process.env.Port
require('./db/mongoose');
const usersRouter = require('./routers/usersRaouter');
const taskRouter = require('./routers/taskRouter');

const app = express();

app.use(express.json());
app.use(cors());
app.use(usersRouter);
app.use(taskRouter);

app.listen(port,()=>{
    console.log('Server conecctes port: ',port);
});