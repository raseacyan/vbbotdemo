const ViberBot  = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;
const winston = require('winston');
const wcf = require('winston-console-formatter');
var request = require('request');

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [    
    //new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.Console()
  ]
});

// Creating the bot with access token, name and avatar
const bot = new ViberBot(logger, {
    authToken: process.env.AUTH_TOKEN, // <--- Paste your token here
    name: "Is It Up",  // <--- Your bot name here
    avatar: "http://api.adorable.io/avatar/200/isitup" // It is recommended to be 720x720, and no more than 100kb.
});

if (process.env.NOW_URL || process.env.HEROKU_URL) {
    const http = require('http');
    const port = process.env.PORT || 8080;

    http.createServer(bot.middleware()).listen(port, () => bot.setWebhook(process.env.NOW_URL || process.env.HEROKU_URL));
} else {
    logger.debug('Could not find the now.sh/Heroku environment variables. Please make sure you followed readme guide.');
}


bot.onSubscribe(response => {
    say(response, `Hi there ${response.userProfile.name}. I am ${bot.name}! Feel free to ask me if a web site is down for everyone or just you. Just send me a name of a website and I'll do the rest!`);
});


bot.onTextMessage(/^hi|hello$/i, (message, response) =>
    response.send(new TextMessage(`Hi there ${response.userProfile.name}. I am robot`)));

bot.onTextMessage(/./, (message, response) => {
    response.send(new TextMessage(`you entered ${message.text}`))
});

const SAMPLE_RICH_MEDIA = {
    "ButtonsGroupColumns": 6,
    "ButtonsGroupRows": 2,
    "BgColor": "#FFFFFF",
    "Buttons": [{
        "ActionBody": "http://www.website.com/go_here",
        "ActionType": "open-url",
        "BgMediaType": "picture",
        "Image": "http://www.images.com/img.jpg",
        "BgColor": "#000000",
        "TextOpacity": 60,
        "Rows": 4,
        "Columns": 6
    }, {
        "ActionBody": "http://www.website.com/go_here",
        "ActionType": "open-url",
        "BgColor": "#85bb65",
        "Text": "Buy",
        "TextOpacity": 60,
        "Rows": 1,
        "Columns": 6
    }]
};

bot.onTextMessage(/sample/, (message, response) => {
    response.send(new RichMedia(SAMPLE_RICH_MEDIA))
});