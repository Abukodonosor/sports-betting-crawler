/*
DB class, here we makeing our connection, load config params, and seting relations, and static methodes for class
*/
'use strict';

let mysql = require('mysql'),
    ip = require("ip");

/* configuration parametars */
let config = require("./config");

let local = config.local,
    server = config.server,
    conf_ip = config.ip,
    ip_address=  ip.address();

class DB{

    constructor(options){

        this.connection = mysql.createConnection(ip_address == conf_ip? server: local);
        // this.connection.connect();
    }

    connect(){
        this.connection.connect();
    }
    static s_connect(){
        this.connection = mysql.createConnection(ip_address == conf_ip? server: local);
        this.connection.connect();
    }

    // getPzn(callback){
    //     this.connection.query("SELECT * FROM pzn", ( err, rows)=>{
    //         console.log(rows);
    //         callback(rows)
    //         console.log(this.options);
    //     });
    // }


    connEnd(){
        this.connection.end();
    }
    
}
DB.s_connect();



module.exports = DB;
