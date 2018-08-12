'use strict';
const puppeteer = require('puppeteer');


class HeadlessChrome{
    constructor(options){
        this.Browser=false;
        this.Page=false;
        this.timeout='timeout' in options?options.timeout:30000;
        this.waitUntil='waitUntil' in options?options.waitUntil:'networkidle0';
        this.Height='height' in options?options.height:768;
        this.Width='width' in options?options.width:1366;
        this.repeat_err='repeat_err' in options?options.repeat_err:5;
        if(this.repeat_err>100)throw 'repeat_err variabile value is more then 100';
    }


    async OpenBrowser(callback){

        //--------------------------------------
        //random user agents
        //--------------------------------------
        let browser;

            browser = await puppeteer.launch({
                args:[
                    //'--proxy-server='+proxy,
                    '--ignore-certificate-errors',
                    //  '--no-sandbox',
                    //  '--disable-setuid-sandbox'
                ],
                headless:true,
                'ignoreHTTPSErrors':true,
            });

        const page = await browser.newPage();
        this.Browser=browser;
        this.Page=page;
        return callback(page);
    }

    async CloseBrowser(callback){
        await this.Page.close();
        await this.Browser.close();
        return callback('browser Closed');
    }

    async GoTo(url,options={},callback){
        if(!url)return callback(true);
        let that=this;
        let err_msg=[];

        (async function loop(i) {
            if(i>that.repeat_err)return callback(err_msg);


            try{

                let response =await that.Page.goto(url, {
                    'timeout':that.timeout,
                    waitUntil:that.waitUntil   //that.waitUntil
                });
                let headers=response['_headers'];
                let statusCode=response['_status']+'';
                let requestedUrl=response['_url'];
                let bodyHTML=  await that.Page.evaluate(() => document.documentElement.outerHTML);

                if(statusCode.startsWith('2')||statusCode.startsWith('3')){
                    return callback(null,{
                        'html':bodyHTML,
                        'headers':headers,
                        'statusCode':statusCode,
                        'requestedUrl':requestedUrl,
                    });
                }

                return callback(null,{
                    'statusCode':statusCode
                })




            }catch (err){
                console.log(err);
                err_msg.push(err.stack);

                switch (err.stack){
                    case 'Error: Navigation Timeout Exceeded':
                        return loop(++i);
                        break;
                    case 'Error: net::ERR_TUNNEL_CONNECTION_FAILED':
                        return loop(++i);
                        break;
                    case 'Error: net::ERR_TOO_MANY_REDIRECTS':
                        return loop(100);
                        break;
                    case 'Error: net::ERR_INVALID_REDIRECT':
                        return loop(100);
                        break;
                    case 'Error: net::ERR_EMPTY_RESPONSE':
                        return loop(++i);
                        break;
                    case 'Error: net::ERR_CONNECTION_CLOSED':
                        return loop(++i);
                        break;

                    default:
                        return loop(++i);
                        break;
                }



                return false;


            }

        }(0));
    }




}


module.exports=HeadlessChrome;









