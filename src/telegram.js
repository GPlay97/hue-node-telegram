/**
 * @file telegram.js
 * @author GPlay97
 * @description
 * Telegram Bot listener and handler.
 */
const TelegramBot = require('node-telegram-bot-api'),
    srv_config = require('./../config.json'),
    hue = require('./hue.js'),
    bot = new TelegramBot(srv_config.TELEGRAM_TOKEN, {
        polling: true
    });

/**
 * Checks if given telegram user is authorized to use the API
 * If not, user will receive a message
 * @param {String|Number} user the telegram user id
 */
const isAuthorized = (user) => {
    if(!Array.isArray(srv_config.AUTHORIZED_TELEGRAM) || srv_config.AUTHORIZED_TELEGRAM.indexOf(user) === -1) {
        bot.sendMessage(user, 'Sorry, you are not allowed to that. Ensure that your ID (' + user + ') has been whitelisted.'); // unauthorized
        return false;
    }
    return true; // is authorized
};

/**
 * Starts the bot - attaches listener for specific commands
 */
const startBot = () => {
    /**
     * // TODO
     * Retrieves the current status of the lights
     */
    bot.onText(/\/status/, (msg, match) => {
        if(!isAuthorized(msg.chat.id)) return; // check authentication
        bot.sendMessage(msg.chat.id, 'Not working yet.');
    });
    /**
     * Will turn on all the lights and set the brightness
     */
    bot.onText(/\/on/, (msg, match) => {
        if(!isAuthorized(msg.chat.id)) return; // check authentication
        hue.setLightStates(true, (err, turnedOn) => {
            bot.sendMessage(msg.chat.id, ((!err && turnedOn)? 'The lights has been turned on.' : 'There was an error.'));
        });
    });
    /**
     * Will turn off all the lights and set the brightness
     */
    bot.onText(/\/off/, (msg, match) => {
        if(!isAuthorized(msg.chat.id)) return; // check authentication
        hue.setLightStates(false, (err, turnedOff) => {
            bot.sendMessage(msg.chat.id, ((!err && turnedOff)? 'The lights has been turned off.' : 'There was an error.'));
        });
    });
    /**
     * Will turn on all the lights and set the brightness
     */
    bot.onText(/\/brightness/, (msg, match) => {
        if(!isAuthorized(msg.chat.id)) return; // check authentication
        bot.sendMessage(msg.chat.id, 'Not working yet.');
    });
};

/**
 * Module for the Telegram Bot
 */
module.exports = {
    startBot
};