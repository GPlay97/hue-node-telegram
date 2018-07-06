/**
 * @file hue.js
 * @author GPlay97
 * @description
 * The handling and routing for Hue-Philips automation that will be used for the requests and the Telegram Bot
 */
const hue = require('node-hue-api'),
    srv_config = require('./../config.json'),
    errors = require('./errors.json');

let api; // will be the initialized bridge as defined in config file

/**
 * Ensures that api will be initialized
 */
const initialize = () => {
    if (!api) api = new hue.HueApi(srv_config.HUE_BRIDGE_IP, srv_config.HUE_BRIDGE_USER);
};

/**
 * Searches for available bridges
 * @param {Function} callback callback function
 */
const searchBridges = (callback) => hue.nupnpSearch((err, bridges) => callback(err, bridges));

/**
 * Retrieves config from initialized bridge
 * @param {Function} callback callback function
 */
const retrieveConfig = (callback) => api.getConfig((err, config) => callback(err, config));

/**
 * Retrieves linked lights from initialized bridge
 * @param {Function} callback callback function
 */
const retrieveLights = (callback) => api.lights((err, lights) => callback(err, lights));

/**
 * Sets the light states for all available lights
 * Currently supported: 
 * - on / off
 * - brightness
 * @example setLightState({on: true, brightness: 12}, (err, set) => console.log(err, set));
 * @param {Object} stateObj object containing instructions whether to turn on or off lights and which brightness should be used
 * @param {Function} callback callback function
 */
const setLightStates = (stateObj, callback) => {
    if (typeof stateObj !== 'object' || stateObj == null) return callback(errors.MISSING_PARAMETERS.code, null);

    let state, processed = 0;;

    // we can't set all properties - otherwise light possibly shortly turn on when we want to turn it off
    if (stateObj.on) {
        state = hue.lightState.create().white(154, (
            (parseInt(stateObj.brightness) >= 0 && parseInt(stateObj.brightness) <= 100) ? parseInt(stateObj.brightness) : 100
        )).on();
    } else state = hue.lightState.create().off();

    retrieveLights((err, lightsRes) => {
        if (!err && lightsRes && Array.isArray(lightsRes.lights)) {
            // iterate through each light to set state
            lightsRes.lights.forEach(light => {
                api.setLightState(light.id, state, (err, set) => {
                    if (++processed + 1 === lightsRes.lights.length) callback(err, set); // fire callback only on last light bulb
                });
            });
        } else callback(err, null);
    });
};

/**
 * Module for the Philips Hue handler
 */
module.exports = {
    /**
     * Exported initialize function
     */
    initialize,
    /**
     * Exported searchBridges function
     */
    searchBridges,
    /**
     * findBridges request handler
     * @param {Object} req the server request
     * @param {Object} res the server response
     */
    findBridges: (req, res) => {
        // search for available bridges
        searchBridges((err, bridges) => {
            if (!err && Array.isArray(bridges)) res.json(bridges);
            else res.status(409).json({
                error: {
                    code: errors.BRIDGETS_FIND_ERROR.code,
                    message: errors.BRIDGETS_FIND_ERROR.message
                }
            });
        });
    },
    /**
     * Exported retrieveConfig function
     */
    retrieveConfig,
    /**
     * getConfig request handler
     * @param {Object} req the server request
     * @param {Object} res the server response
     */
    getConfig: (req, res) => {
        // retrieve the config
        retrieveConfig((err, config) => {
            if (!err && config != null) res.json(config);
            else res.status(409).json({
                error: {
                    code: errors.BRDIGET_CONFIG_ERROR.code,
                    message: errors.BRIDGET_CONFIG_ERROR.message
                }
            });
        });
    },
    /**
     * Exported retrieveLights function
     */
    retrieveLights,
    /**
     * getLights request handler
     * @param {Object} req the server request
     * @param {Object} res the server response
     */
    getLights: (req, res) => {
        // retrieve the lights
        retrieveLights((err, lights) => {
            if (!err && lights != null) res.json(lights);
            else res.status(409).json({
                error: {
                    code: errors.BRIDGET_LIGHTS_ERROR.code,
                    message: errors.BRIDGET_LIGHTS_ERROR.message
                }
            });
        });
    },
    /**
     * Exported setLightStates function
     */
    setLightStates,
    /**
     * turnOn request handler
     * @param {Object} req the server request
     * @param {Object} res the server response
     */
    turnOn: (req, res) => {
        // turn on all the lights and optionally set a brightness level (or 100% if not given)
        setLightStates({
            on: true,
            brightness: req.body.brightness
        }, (err, turnedOn) => {
            if (!err && turnedOn) res.json(turnedOn);
            else res.status(409).json({
                error: {
                    code: errors.LIGHT_STATE_SET_ERROR.code,
                    message: errors.LIGHT_STATE_SET_ERROR.message
                }
            });
        });
    },
    /**
     * turnOff request handler
     * @param {Object} req the server request
     * @param {Object} res the server response 
     */
    turnOff: (req, res) => {
        // turn off all the lights
        setLightStates({
            on: false
        }, (err, turnedOff) => {
            if (!err && turnedOff) res.json(turnedOff);
            else res.status(409).json({
                error: {
                    code: errors.LIGHT_STATE_SET_ERROR.code,
                    message: errors.LIGHT_STATE_SET_ERROR.message
                }
            });
        });
    }
};