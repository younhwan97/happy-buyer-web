"use strict";

/* Module */
const fs = require("fs")

const view = {
    login : (req, res) => {
        return res.render('login')
    },
}

const create = {
    session : (req, res) => { // login process
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
        req.app.get('dbConnection').query(query, loginId, (err, results, fields) => {
            if(err) throw err

            if(results.length && results[0].id === loginId){

                query = 'SELECT * FROM auth WHERE password = ?;'
                req.app.get('dbConnection').query(query, loginPassword, (err, results, fields) => {
                    if(err) throw err

                    if(results.length){ // id와 password 모두 일치할 때
                        req.session.is_logined = true
                        req.session.nickname = loginId
                        req.session.role = 'admin'
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

    guest_session : (req, res) => { // guest login process
        req.session.is_logined = true
        req.session.nickname = 'guest'
        req.session.role = 'guest'

        req.session.save(()=>{
            return res.redirect('/')
        })
    },
}

const remove = {
    session : (req, res) => {
        if (!req.session || Object.keys(req.session).length === 0) { // 세션 데이터가 없을 때
            return res.redirect('/auth/login')
        }

        req.session.destroy( (err) => {
            if(err) throw  err

            return res.redirect('/auth/login')
        })
    },
}

module.exports = {
    view,
    remove,
    create
}
