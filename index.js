/**
 * @file index.js
 * @author GPlay97
 * @description
 * The server main file, where server will be initialized to listen for requests and starting the Telegram Bot.
 */
const express = require('express'),
    app = express(),
    errors = require('./errors.json'),
    srv_config = require('./config.json'),
    bodyParser = require('body-parser'),
    hue = require('./hue.js'),
    telegram = require('./telegram.js');

// JSON parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// set default headers
app.use((req, res, next) => {
    res.contentType('application/json');
    res.setHeader('Access-Control-Allow-Origin', ((req.get('origin') == null) || req.get('origin') == 'null') ? '*' : req.get('origin') || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

// the request routes
app.get('/bridges', hue.findBridges);
app.get('/config', hue.getConfig);
app.get('/lights', hue.getLights);
app.post('/on', hue.turnOn);
app.post('/off', hue.turnOff);

// requested route doesn't exist
app.use((req, res) => {
    res.status(404).json({
        error: {
            code: errors.UNKNWON_ROUTE.code,
            message: errors.UNKNWON_ROUTE.message
        }
    });
});

// error handling (Arrow function not working here?)
app.use(function onError(err, req, res, next) {
    res.status(500).json({
        error: {
            code: errors.INTERNAL_ERROR.code,
            message: errors.INTERNAL_ERROR.message
        }
    });
    next(err);
});

// start the Telegram Bot
telegram.startBot();

// initialize the server
app.listen(srv_config.PORT, () => console.log('Server started on port ', srv_config.PORT));