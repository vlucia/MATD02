var database = [
  {
    "code": "A1",
    "isFree": true,
    "img": null
  },
  {
    "code": "A2",
    "isFree": true,
    "img": null
  },
  {
    "code": "A3",
    "isFree": true,
    "img": null
  },
  {
    "code": "A4",
    "isFree": true,
    "img": null
  },
  {
    "code": "A5",
    "isFree": true,
    "img": null
  },
  {
    "code": "B1",
    "isFree": true,
    "img": null
  },
  {
    "code": "B2",
    "isFree": true,
    "img": null
  },
  {
    "code": "B3",
    "isFree": true,
    "img": null
  },
  {
    "code": "B4",
    "isFree": true,
    "img": null
  },
  {
    "code": "B5",
    "isFree": true,
    "img": null
  },
];
const carros = ["car1.png", "car2.png", "car3.png", "car4.png", "car5.png", "car6.png", "car7.png"];
const limite = 9.4;
var vagasLivres = 10;
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
  var objectToFront = {
    vagasLivres: vagasLivres,
    database: database
  }

  socket.emit('message', JSON.stringify(objectToFront));
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

  if ((parseFloat(message.toString()) <= limite && database[0].isFree) || (parseFloat(message.toString()) > limite && !database[0].isFree)) {
    MudarStatusVaga(database[0], 1);
    for (var i = 1; i < database.length; i++) {
      MudarStatusVaga(database[i], i / 100 * 5)
    }

    var objectToFront = {
      vagasLivres: vagasLivres,
      database: database
    }
    
    io.emit('message', JSON.stringify(objectToFront));
  }

  console.log(message.toString());
})



function MudarStatusVaga(card, chance) {
  var randonFactor = Math.random();

  if (randonFactor <= chance) {
    var random = Math.floor(randonFactor * carros.length);

    if (card.isFree == true) {
      card.img = carros[random];
      card.isFree = false;
      vagasLivres--;
    }
    else {
      card.img = null;
      card.isFree = true;
      vagasLivres++;
    }
  }
}
























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
