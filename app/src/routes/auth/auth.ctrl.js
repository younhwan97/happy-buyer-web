"use strict";

/* Module */
const fs = require("fs")
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const mysql = require('mysql');

AWS.config.update({region: 'ap-northeast-2'})

/* AWS RDS Setting */
const conf = JSON.parse(fs.readFileSync('./src/config/database.json', 'utf-8')) // read db config file in server
const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    port: conf.port,
    password: conf.password,
    database: conf.database,
    multipleStatements: true
});
connection.connect()

const view = {
    login : (req, res) => {
        return res.render('login')
    },

    logout : (req, res) => {
        req.session.destroy( (err) => {
            res.redirect('/auth/login')
        })
    }
}

const read = {
    login_process : (req, res) => {
        let loginId
        let loginPassword
        let query

        if (!req.body || Object.keys(req.body).length === 0) { // 로긴 데이터가 없을 때
            return res.json({
                success: false
            })
        }

        loginId = req.body.loginId
        loginPassword = req.body.loginPassword

        query = 'SELECT * FROM auth WHERE id = ?;'
        connection.query(query, loginId, (err, results, fields) => {
            if(err) throw err

            if(results.length && results[0].id === loginId){

                query = 'SELECT * FROM auth WHERE password = ?;'
                connection.query(query, loginPassword, (err, results, fields) => {
                    if(err) throw err

                    if(results.length){ // id와 password 모두 일치할 때
                        req.session.is_logined = true
                        req.session.nickname = loginId
                        req.session.role = '관리자'
                        req.session.save(()=>{
                            return res.json({
                                success: true
                            })
                        })
                    } else { // password 가 잘못되었을 때
                        return res.json({
                            success: false
                        })
                    }
                })
            } else {
                return res.json({ // 일치하는 id가 없을 때
                    success: false
                })
            }
        })
    },
}

module.exports = {
    view,
    read
}
