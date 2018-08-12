const Chrome  = require('./HeadlessChrome');
const cheerio = require('cheerio');
const DB = require('./DB');
let moment = require('moment');


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
                  let url = 'https://www.mozzartbet.com/sr/lucky-six#/';
        
                that.Chrome.GoTo(url,{}, async function (err,res) {
        
                    if(!err){
                        // await page.click('.lucky-part.lucky-six-header .header-button');
                        // await page.waitForFunction(() => document.querySelectorAll('.lucky-results-wrapper').length >0, {
                        //     polling: 'mutation'
                        // });
                        // await page.click('.lotto-previous-results header.previous-header div.header-text');
                        // await page.waitForFunction(() => document.querySelectorAll('article.lotto-previous-results').length >0, {
                        //     polling: 'mutation'
                        // });
                        let body = await page.evaluate(() =>
                            document.documentElement.outerHTML);

                        that.ParseWeb(body,that.Chrome,function () {
                           // return loop(++i);
                        });
                    }
                })
            })(0)
        }))
    }

    //PARSE HTML
    ParseWeb(body,Chrome,callback){
       // console.log(body);
       let that = this;

        (function balls_loop(j) {

            let data = [];
            let tuple = {
                    position:0,
                    number:0
                };
    
            if(j==3){
                Chrome.CloseBrowser((result)=>{
                    return callback("done");
                })
                return false;
            } 
            
            let $ = cheerio.load(body);
            let element = $('.lucky-results-wrapper.mobile .lucky-six-result.mobile').eq(j);

            let round_id = element.find('.left-header').text();
            var numberPattern = /\d+/g;
            round_id = round_id.match(numberPattern)[0];

            let pos = 0;

            let balls = $(element);
            balls.find('.number').each(function () {
                tuple.number = $(this).text().trim();
                tuple.position = ++ pos;
                data.push(tuple);
                tuple = {
                    position:0,
                    number:0
                };
            })
            data.pop();


            console.log("== Lucky6 ==");
            console.log("roundID : "+round_id)
            data = JSON.stringify(data);
            console.log(data);  

            

            that.existToDB(round_id, 'lucky6',(exist)=>{
                if(exist == "none"){
                    that.saveToDB(data,round_id,(result)=>{
                        console.log("UPISAO Lucky6");
                        console.log(result);
                        return balls_loop(++j);
    
                    });
                }else{
                    console.log("POSTOJI");
                    return balls_loop(++j);
                }
            });
    
            
        })(0)
    }


    saveToDB(data,round_id,callback){
        let q = "INSERT INTO bet_statistic.beting_data ( betting_name, game_name, round_id, data, date_time) VALUES (?, ? ,? ,?, ?);"

        DB.connection.query(q,['Mozzart','lucky6',round_id,data, moment(new Date()).format("YYYY-MM-DD hh:mm:ss")],(err,rows)=>{
            if(err) throw err;
            callback("end");

        });

    }

    existToDB(round_id, game_name, callback){
        let q = "SELECT * FROM bet_statistic.beting_data WHERE round_id = ? AND game_name = ?";

        DB.connection.query(q,[round_id, game_name],(err,rows)=>{
            if(err) throw err;
            let final;
            if(rows.length){
                final = "exist";
            }
            else{
                final = "none";
            }
            callback(final);
        });
    }



}

module.exports=Mozzart;
