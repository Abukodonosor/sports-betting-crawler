'use strict';
const mozzart = require('./mozzart');
const mozzartLucky6 = require('./mozzartLucky6');

const meridian = require('./meridian');
const lucky6 = require('./balkanBet_lucky6');
var cron = require('node-cron');

process.env.TZ = 'Europe/Berlin';
 
cron.schedule('*/3 * * * *', function(){
    let data = ['https://www.mozzartbet.com/sr/moj-broj?#/'];
    const m = new mozzart();
    m.GoSport(data);
});

cron.schedule('*/2 * * * *', function(){
    let data = ['https://www.mozzartbet.com/sr/lucky-six#/'];
    const mozLucky6 = new mozzartLucky6();
    mozLucky6.GoSport(data);
});


// let data = ['https://www.mozzartbet.com/sr/moj-broj?#/'];
//     const m = new mozzart();
//     m.GoSport(data);

// let data = ['https://kenodn.meridianbet.com/keno_default/stats/index.html?locale=sr&oddsFormat=decimal'];
// const m = new meridian();
// m.GoSport(data);

// let data = ['https://seven-plugin-luckysix.7platform.com/?mode=plugin&&colors=145&q=web&lang=sr-Latn&company=4f54c6aa-82a9-475d-bf0e-dc02ded89225&scm=%7B%22url%22:%22https:%2F%2Fcm-rs.7platform.com:8008%22,%22id%22:%2200301e05-af1a-4cd3-8690-3ff5c362aa72%22,%22token%22:%22token%22,%22channel%22:%22edc5da0d-86f0-47bd-8e6f-1bfb17b78b9d%22,%22clientType%22:%22user%22,%22clientSubType%22:%22Player%22,%22encoding%22:%22plaintext%22%7D'];
// const m = new lucky6();
// m.GoSport(data);
