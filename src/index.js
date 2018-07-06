/**
 * @file index.js
 * @author GPlay97
 * @description
 * The server main file, where server will be initialized to listen for requests and starting the Telegram Bot.
 */
const express = require('express'),
    fs = require('fs'),
    app = express(),
    https = require('https'),
    session = require('express-session'),
    errors = require('./errors.json'),
    srv_config = require('./../config.json'),
    httpsServer = ((srv_config.CHAIN_PATH &&
        srv_config.PRIVATE_KEY_PATH &&
        srv_config.CERTIFICATE_PATH) ? https.createServer({
        ca: fs.readFileSync(srv_config.CHAIN_PATH, 'utf-8'),
        key: fs.readFileSync(srv_config.PRIVATE_KEY_PATH, 'utf-8'),
        cert: fs.readFileSync(srv_config.CERTIFICATE_PATH, 'utf-8')
    }, app) : false),
    bodyParser = require('body-parser'),
    auth = require('./auth.js'),
    hue = require('./hue.js'),
    telegram = require('./telegram.js');

// session handling
app.use(session({
    secret: srv_config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: (httpsServer !== false)
    }
}));

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

// check authentication
app.use((req, res, next) => {
    // if not on login route, check first if authenticated
    if (req.url === '/login' || req.session.authenticated) return next();
    // not authorized
    return res.status(401).json({
        error: {
            code: errors.UNAUTHORIZED.code,
            message: errors.UNAUTHORIZED.message
        }
    });
});

// the request routes
app.post('/login', auth.validatePassword);
app.get('/bridges', hue.findBridges);
app.get('/config', hue.getConfig);
app.get('/lights', hue.getLights);
app.post('/on', hue.turnOn);
app.post('/off', hue.turnOff);

// requested route doesn't exist
app.use((req, res) => {
    res.status(404).json({
        error: {
            code: errors.UNKNOWN_ROUTE.code,
            message: errors.UNKNOWN_ROUTE.message
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

// initialize the hue bridge
hue.initialize();

// start the Telegram Bot
telegram.startBot();

// initialize the server (http or https)
if (httpsServer) httpsServer.listen(srv_config.PORT, () => console.log('[HTTPS] Server started on port ', srv_config.PORT));
else app.listen(srv_config.PORT, () => console.log('[HTTP] Server started on port ', srv_config.PORT));