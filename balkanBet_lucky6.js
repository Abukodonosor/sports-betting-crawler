const Chrome  = require('./HeadlessChrome');
const cheerio=require('cheerio');

class Mozzart {

    constructor(){
        this.Chrome = new Chrome({});
    } 
    GoSport(urls){
        const that=this;
        this.Chrome.OpenBrowser((function (page) {
            (function loop(i) {

                if(typeof urls[i] == 'undefined'){
                    console.log('doneeeeee');
                    that.Chrome.CloseBrowser(function () {
                    });
                    return false;
                }
               // console.log(urls[i].web,'---------------------------------------------------------');
                  let url = 'https://seven-plugin-luckysix.7platform.com/?mode=plugin&&colors=145&q=web&lang=sr-Latn&company=4f54c6aa-82a9-475d-bf0e-dc02ded89225&scm=%7B%22url%22:%22https:%2F%2Fcm-rs.7platform.com:8008%22,%22id%22:%2200301e05-af1a-4cd3-8690-3ff5c362aa72%22,%22token%22:%22token%22,%22channel%22:%22edc5da0d-86f0-47bd-8e6f-1bfb17b78b9d%22,%22clientType%22:%22user%22,%22clientSubType%22:%22Player%22,%22encoding%22:%22plaintext%22%7D';

                that.Chrome.GoTo(url,{}, async function (err,res) {
        
                    if(!err){
                        // await page.click('.lotto-event ul li');
                        // await page.waitForFunction(() => document.querySelectorAll('.lotto-previous-results header.previous-header div.header-text').length >0, {
                        //     polling: 'mutation'
                        // });
                        // await page.click('.lotto-previous-results header.previous-header div.header-text');
                        // await page.waitForFunction(() => document.querySelectorAll('article.lotto-previous-results').length >0, {
                        //     polling: 'mutation'
                        // });
                        let body = await page.evaluate(() =>
                            document.documentElement.outerHTML);

                        that.ParseWeb(body,function () {
                           // return loop(++i);
                        });
                    }

                })
            })(0)

        }))
    }

    //PARSE HTML
    ParseWeb(body,callback){
       // console.log(body);

        let $ = cheerio.load(body);
        let element = $('#l6-draw');
        let number,position;
        console.log(element.length,'imaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        //console.log(countCat);
        // (function balls_loop(j) {
            // if(j==10) return false;
            let balls = $(element);
            // console.log(balls.html());
            balls.find('.ball').each(function () {
                number = $(this).text().trim();
                // position =$(this).find('p.position').text().trim();
                console.log(number);

            })
            // return balls_loop(++j);
        // })(0)
    }

    saveToDB(data,callback){

    }

}

module.exports=Mozzart;
