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
                  let url = 'https://www.mozzartbet.com/sr/moj-broj?#/';

                that.Chrome.GoTo(url,{}, async function (err,res) {
        
                    if(!err){
                        await page.click('.lotto-event ul li');
                        await page.waitForFunction(() => document.querySelectorAll('.lotto-previous-results header.previous-header div.header-text').length >0, {
                            polling: 'mutation'
                        });
                        await page.click('.lotto-previous-results header.previous-header div.header-text');
                        await page.waitForFunction(() => document.querySelectorAll('article.lotto-previous-results').length >0, {
                            polling: 'mutation'
                        });
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

        console.log("== Greek Kino ==");
        let data = [];
        let tuple = {
                position:0,
                number:0
            };


        let $ = cheerio.load(body);
        let element = $('.lotto-previous-results .previous-round');

        // console.log(element.length,'imaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        //console.log(countCat);
        // (function balls_loop(j) {
        //     if(j==10) return false;
        // let balls = $(element[j]);

        let round_id = parseInt(element.find('.previous-round-header').eq(0).text().trim().split("Kolo: ")[1]);

        console.log(round_id);

        let balls = $(element).find('.previous-round-body').eq(0);
        balls.find('.number-holder').each(function () {
            tuple.number = $(this).find('p.number').text().trim();
            tuple.position =$(this).find('p.position').text().trim();
            data.push(tuple);
            tuple = {
                position:0,
                number:0
            };

        })

        data = JSON.stringify(data);
        console.log(data);  

        //if exist nothing
            //else add into table

        let that = this;

        this.existToDB(round_id, 'greek_kino',(exist)=>{
            if(exist == "none"){
                that.saveToDB(data,round_id,(result)=>{
                    console.log("UPISAO greek_kino");
                    Chrome.CloseBrowser((result)=>{
                        console.log(result);
                    })
                });
            }else{
                Chrome.CloseBrowser((result)=>{
                    console.log("POSTOJI");
                    console.log(result);
                })
            }
        });
     

        //     return balls_loop(++j);
        // })(0)
    }


    saveToDB(data,round_id,callback){
        let q = "INSERT INTO bet_statistic.beting_data ( betting_name, game_name, round_id, data, date_time) VALUES (?, ? ,? ,?, ?);"

        DB.connection.query(q,['Mozzart','greek_kino',round_id,data, moment(new Date()).format("YYYY-MM-DD hh:mm:ss")],(err,rows)=>{
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
