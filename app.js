const ViberBot  = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;
const RichMediaMessage = require('viber-bot').Message.RichMedia;
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
    switch(message.text){
        case "view":
            viewTasks();
            break;
        default:
            response.send(new TextMessage(`I don't quite understand your command`));
    }
});


/*
bot.onTextMessage(/view/, (message, response) => {
   viewTasks(message, response);  
});*/

function viewTasks(message, response){
    const SAMPLE_RICH_MEDIA = {
    "ButtonsGroupColumns": 6,
    "ButtonsGroupRows": 7,
    "BgColor": "#FFFFFF",
    "Buttons":[
         
         {
            "Columns":6,
            "Rows":5,
            "ActionType":"none",           
            "Image":"https://store-images.s-microsoft.com/image/apps.49795.13510798887304077.4ce9da47-503d-4e6e-9fb3-2e78a99788db.b6188938-8471-4170-83b8-7fc4d9d8af6a?mode=scale&q=90&h=270&w=270&background=%230078D7"
         },
         {
            "Columns":6,
            "Rows":1,
            "Text":"to do",
            "ActionType":"none",
            "TextSize":"medium",
            "TextVAlign":"middle",
            "TextHAlign":"left"
         },
         {
            "Columns":6,
            "Rows":1,
            "ActionType":"reply",
            "ActionBody":"https://www.google.com",
            "Text":"<font color=#ffffff>Delete</font>",
            "TextSize":"large",
            "TextVAlign":"middle",
            "TextHAlign":"middle",
            "Image":"https://s14.postimg.org/4mmt4rw1t/Button.png"
         },
         
         
      ]
    };
    response.send(new RichMediaMessage(SAMPLE_RICH_MEDIA))
}