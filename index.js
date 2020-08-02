// this is needed for importing expressjs into our application
const express = require('express')
const appConfig = require('./config/appConfig')
const fs = require('fs')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const globalErrorMiddleware = require('./middlewares/appErrorHandler')


//declaring an instance or creating an application instance
const app = express()
var cors = require('cors')

app.use(cors())

//middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())


// Bootstrap models
let modelsPath = './models'
fs.readdirSync(modelsPath).forEach(function (file) {
    if (~file.indexOf('.js')) {
        require(modelsPath + '/' + file)
    }
  })
  // end Bootstrap models



// Bootstrap route
let routesPath = './routes'
fs.readdirSync(routesPath).forEach(function (file) {
    if (~file.indexOf('.js')) {
        let route = require(routesPath + '/' + file);
        route.setRouter(app);
    }
});
// end bootstrap route


  // calling global 404 handler after route
app.use(globalErrorMiddleware.globalNotFoundHandler)

 
  // end global 404 handler


//listening the server - creating a local server
app.listen(appConfig.port, () => {
    //creating the mongo db connection here
    let db = mongoose.connect(appConfig.db.uri,{ useFindAndModify: false ,useNewUrlParser: true,useUnifiedTopology: true});

})


// handling mongoose connection error
mongoose.connection.on('error', function (err) {
        console.log(err)

}); // end mongoose connection error

// handling mongoose success event
mongoose.connection.on('open', function (err) {
    if (err) {
        console.log(err);

    } 

}); // end mongoose connection open handler