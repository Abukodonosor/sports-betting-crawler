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
                  let url = 'https://kenodn.meridianbet.com/keno_default/stats/index.html?locale=sr&oddsFormat=decimal';

                that.Chrome.GoTo(url,{}, async function (err,res) {
        
                    if(!err){
                       
                        await page.click('.trans_stats');
                        await page.waitForFunction(() => document.querySelectorAll('#last10draws').length >0, {
                            polling: 'mutation'
                        });

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
        let element = $('#last10draws .row');
        let number,position;
        console.log(element.length,'imaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        //console.log(countCat);
        (function balls_loop(j) {
            if(j==10) return false;
            let balls = $(element[j]);
            // console.log(balls.html());
            balls.find('.number').each(function () {
                number = $(this).find('.ball').text().trim();
            
                console.log(number);

            })
            return balls_loop(++j);
        })(0)
    }

    saveToDB(data,callback){

    }

}

module.exports=Mozzart;
