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
    "HUE_BRIDGE_USER": "abc123"
}
```

Key | Explaination
--- | ---
PORT | The port the Node server will listen to. Should be >= 1024
TELEGRAM_TOKEN | The API token from your Telegram Bot
HUE_BRIDGE_IP | The ip address of your Philips Hue Bridge. If you do not know it, skip this and read on (can be explored later, so you can edit it later)
HUE_BRIDGE_USER | The user API key of your Philips Hue Developer Account

3. That's it. Now run `node index.js`. The server should start on your defined port.

## Usage
Generally it can be used in two ways. Currently there are only a few things you can do, but it will be extended. Stay tuned!

### Server
Port within the URL here needs to be replaced with your defined port. GET, POST are HTTP request types.

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
Turn on the lights - currently all lights will be turned on - at 100% brightness (cold temperature) - will be modified soon.

`POST http://localhost:1234/on`

Wow! That's bright!

#### Turn off the lights
Join the dark side!
Turn off the lights again. Completely.

`POST http://localhost:1234/off`

It's dark in here.

### Telegram
Now - try it with telegram.
Currently there are only two commands supported. More will be added soon.

#### Turn on the lights
Send `/on` to your personal connected Telegram Bot.

#### Turn off the lights
Send `/off`.

Both of them will interact same as their equivalent HTTP requests


## ToDo's
More possibilites to control your lights will be added soon.
You will then be able to control single lights, vary the brightness and so on.
There will also be some authentication, to prevent unauthorized access.
There will also be some automated server tests to ensure continuous integration.

## Contributing
More features will be added soon.
If you have found a bug or have an idea, create an issue here.

Feel also free to contribute with code.
Fork this repository, work on it, and create a Pull Request.
