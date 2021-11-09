var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

//Socket beckend -> frontend
io.on('connection', (socket) => {
  console.log('a user connected');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Comunicação com o mqtt
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://projetoiot.ddns.net:1883');

client.on('connect', function () {
  client.subscribe('topic/sensing', function (err) {
    if (!err) {
      console.log("Conectado com sucesso!")
    }
    else {
      console.log("Erro ao conectar com o mqtt: " + err)
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  io.emit('message', message.toString());
  console.log(message.toString());
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


//Socket de comunicação backend -> frontend

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {
  app: app,
  server: server

}
