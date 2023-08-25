const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const PORT = process.env.PORT || 3001;

// connect to db
const connectDB = require('./src/model/db');
connectDB()
.then(() => {console.log('database connection successful')})
.catch((err) => {console.log('database connetion failed', err)});

if(process.env.NODE_ENV !== 'production') {
    //logger
    app.use(morgan('tiny')); 
}

//API security
app.use(helmet());

//handle cors error
app.use(cors());

//set body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//load routers
const userRouter = require('./src/routers/user.router');
const ticketRouter = require('./src/routers/ticket.router');
const tokensRouter = require('./src/routers/tokens.router');

//handle user routes
app.use('/v1/user', userRouter);

//handle ticket routes
app.use('/v1/ticket', ticketRouter);

//handle tokens routes
app.use('/v1/tokens', tokensRouter);

//handle page not found error
app.get('*', (req,res) => {
    res.json({message: '404! Resource not found'});
})

app.listen(PORT, () => {
    console.log(`listening at ${PORT}`);
});