# Hue Node Telegram
#### Control the lights with Node.JS and your personal Telegram Bot!


Hue Node Telegram is a lightweight project written in JavaScript that allows you to easily interact with your Philips Hue lights.
This can be done viaHTTP Requests. 
Furthermore you also have the possibility to create your personal Telegram Bot and send commands to it to control the lights.

## Installation
The installation is quite easy. You need some prerequsites, before you can start.

#### Prerequisites
- Node.JS (http://nodejs.org)
- Hue Developer Account (https://developers.meethue.com/documentation/getting-started)
- Telegram Bot (https://core.telegram.org/bots)

#### Setup
1. Get the source code via `git clone https://github.com/GPlay97/hue-node-telegram` or clone your own forked version.
2. Change in the directory with `cd hue-node-telegram`. Create a new file called `config.json` and insert the following content (replace the values with your own values):
```JSON
{
    "PORT": "1234",
    "TELEGRAM_TOKEN": "123abc",
    "HUE_BRIDGE_IP": "192.168.1.102",
    "HUE_BRIDGE_USER": "abc123",
    "SESSION_SECRET": "somethingSecret",
    "AUTHORIZED_TELEGRAM": ["userID1", "userID2"],
    "AUTHORIZED_HASH": "someSHA512Hash",
    "CHAIN_PATH": "",
    "PRIVATE_KEY_PATH": "",
    "CERTIFICATE_PATH": ""
}
```

Key | Explaination
--- | ---
PORT | The port the Node server will listen to. Should be >= 1024
TELEGRAM_TOKEN | The API token from your Telegram Bot
HUE_BRIDGE_IP | The ip address of your Philips Hue Bridge. If you do not know it, skip this and read on (can be explored later, so you can edit it later)
HUE_BRIDGE_USER | The user API key of your Philips Hue Developer Account
SESSION_SECRET | The secret that will be used for sessions to use for the server authentication - replace with something random from your choice
AUTHORIZED_TELEGRAM | List of allowed Telegram user IDs, that can use the Telegram commands (further information on the Telegram section below)
AUTHORIZED_HASH | Password hash of your personal password to protect server requests (further information on the Server section below)
CHAIN_PATH | Required, if you want to support HTTPS. The path to the chain file
PRIVATE_KEY_PATH | Required, if you want to support HTTPS. The path to the private key file path
CERTIFICATE_PATH | Required, if you want to support HTTPS. The path to the certificate file path

3. Run `npm install` to automatically install all required dependencies.

4. That's it. Change in the `src` directory with `cd src`. Now run `node index.js`. The server should start on your defined port.

## Usage
Generally it can be used in two ways. Currently there are only a few things you can do, but it will be extended. Stay tuned!

### Server
Port within the URL here needs to be replaced with your defined port. GET, POST are HTTP request types.

---
The server runs locally, as well as your Hue bridge by default.
So it's only reachable from your local network.
If you decide to forward the port from server, ensure to use HTTPS.

To do so, provide the required files within the `config.json` file, as declared above.

---

To be able to use all of the requests to control your lights and to prevent unauthorized access, you will need to setup a password to protect the routes.
To do so, you will need to run `node authentication.js` within the `src` directory.
It will ask you for a password - just choose some (strong) password. After that, it outputs a password hash. 
Copy the hash and insert it within the `config.json` file in the `AUTHORIZED_HASH` property.

#### Login to authorize
Before you can use any request to get further information about your bridge or lights or to be able to control them, first authenticate.

To do so, you will need to create a session with this request (note that a session expires - and on restart of server, you will need to re-login).

`POST http://localhost:1234/login`

You will need to specify your password within the body as application/json
```JSON
{
    "password": "yourPassword"
}
```


If it succeeds, it will tell you, that you are now authenticated. If not, ensure that you have created the steps to get a password hash.

#### Find local bridges
If you want to retrieve a list of bridges near you (useful if you don't know the IP address of your Hue bridge), just send this request, while your server is running.

`GET http://localhost:1234/bridges`

This will give you an array, containing object with all information about every found bridge, such as id, ip or mac address.

#### Get the config from linked bridge
To test, if your bridge and your configuration is working, retrieve the configuration from your bridge via this request, while your server is running.

`GET http://localhost:1234/config`

This will respond with an object with all details. There should be several keys, especially keys such as ip address. If you do not see them, ensure that user provided within config.json (HUE_BRIDGE_USER) is correct.

#### Get all lights from linked bridge
Maybe you are also interested on how many and which lights are currently available at your linked bridge.
Just execute this request, to find out.

`GET http://localhost:1234/lights`

Just as the bridges request, this will provide an array with objects inside containing several information.

#### Turn on the lights
Let the magic happen now!
Turn on the lights - currently all lights will be turned on - brightness (cold temperature) - will be modified soon.

`POST http://localhost:1234/on`

Wow! That's bright!

---
You can specify a custom brightness level (0-100).
If no or invalid brightness level given, it will be set to 100%.

If you want to specify a brightness level, send this within the body as application/json.

```JSON
{
    "brightness": 15
}
```
---


#### Turn off the lights
Join the dark side!
Turn off the lights again. Completely.

`POST http://localhost:1234/off`

It's dark in here.

### Telegram
Now - try it with telegram.
Currently there are only two commands supported. More will be added soon.
Before you can use the Telegram Bot, you will need to whitelist your user ID - otherwise you are not allowed to use the commands.
This prevents others from unauthorized access.
To do so, enter your Telegram user ID within the `config.json` file within the `AUTHORIZED_TELEGRAM` array.
If you do not know your ID, just try to use one of the listed commands below. 
The bot will tell you, that you don't have permissions - and furthermore give you your user ID.

#### Turn on the lights
Send `/on` to your personal connected Telegram Bot.

---
To set a custom brightness, specify your desired level (0-100) after the command.

e.g. `/on 15`

---

#### Turn off the lights
Send `/off`.

Both of them will interact same as their equivalent HTTP requests


## ToDo's
More possibilites to control your lights will be added soon.
You will then be able to control single lights, vary the brightness and so on.
There will also be some automated server tests to ensure continuous integration.
HTTPS support.

## Contributing
More features will be added soon.
If you have found a bug or have an idea, create an issue here.

Feel also free to contribute with code.
Fork this repository, work on it, and create a Pull Request.
