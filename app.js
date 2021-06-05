const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
const process = require('process');
require('dotenv/config');

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
  });
mongoose.set('useFindAndModify', false);

app.use(cors());
app.options('*', cors());

//middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);
app.use('/public/uploads', express.static(__dirname +'/public/uploads'));

//Routers
const ProductRouter = require('./routers/products');
const OrdersRouter = require('./routers/orders');
const CategoriesRouter = require('./routers/categories');
const UsersRouter = require('./routers/users');

const api = process.env.API_URL;

app.use(`${api}/products`, ProductRouter);
app.use(`${api}/orders`, OrdersRouter);
app.use(`${api}/categories`, CategoriesRouter);
app.use(`${api}/users`, UsersRouter);

//Database
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Shoply-database',
})
.then(()=>{
    console.log('Database connection is ready!')
})
.catch((err)=>{
    console.log(err);
})

//Development
app.listen(3000, () => {
    console.log("The server is running at http://localhost:3000");
})

//Production
// var server = app.listen(process.env.PORT || 3000, function () {
//     var port = server.address().port;
//     console.log("Express is working on port " + port);
// })