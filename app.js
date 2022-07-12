
const express = require('express'); //Import the express dependency
const cookieParser = require('cookie-parser');
const {provideErrorHandler} = require('./middleware/errorHalndler')
const cors = require('cors');

require('dotenv').config();
const config_env = JSON.parse(process.env.CONFIG);

const app = express();              //Instantiate an express app, the main work horse of this server
// const port = 5000;                  //Save the port number where your server will be listening

const { Connection } = require('./db')
const routes = require('./routes/index')

//db
Connection.open()

app.use(cors({
    origin: '*'
}));

app.use(cookieParser());
app.use(express.json())

//middleware
app.use(provideErrorHandler);
//api routes
app.use('/api/',routes)


app.listen(config_env.port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${config_env.port}`); 
});