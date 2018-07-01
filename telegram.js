/**
 * @file telegram.js
 * @author GPlay97
 * @description
 * Telegram Bot listener and handler.
 */
const TelegramBot = require('node-telegram-bot-api'),
    srv_config = require('./config.json'),
    hue = require('./hue.js'),
    bot = new TelegramBot(srv_config.TELEGRAM_TOKEN, {
        polling: true
    });

/**
 * Starts the bot - attaches listener for specific commands
 */
const startBot = () => {
    /**
     * // TODO
     * Retrieves the current status of the lights
     */
    bot.onText(/\/status/, (msg, match) => {
        bot.sendMessage(msg.chat.id, 'Not working yet.');
    });
    /**
     * Will turn on all the lights and set the brightness
     */
    bot.onText(/\/on/, (msg, match) => {
        hue.setLightStates(true, (err, turnedOn) => {
            bot.sendMessage(msg.chat.id, ((!err && turnedOn)? 'The lights has been turned on.' : 'There was an error.'));
        });
    });
    /**
     * Will turn off all the lights and set the brightness
     */
    bot.onText(/\/off/, (msg, match) => {
        hue.setLightStates(false, (err, turnedOff) => {
            bot.sendMessage(msg.chat.id, ((!err && turnedOff)? 'The lights has been turned off.' : 'There was an error.'));
        });
    });
    /**
     * Will turn on all the lights and set the brightness
     */
    bot.onText(/\/brightness/, (msg, match) => {
        bot.sendMessage(msg.chat.id, 'Not working yet.');
    });
};

/**
 * Module for the Telegram Bot
 */
module.exports = {
    startBot
};