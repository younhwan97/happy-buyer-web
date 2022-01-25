"use strict";

/* Module */
// empty

const view = {
    dashboard: (req, res) => {
        if(!req.session.is_logined) return res.redirect('/auth/login')
        const login = {
            nickname : req.session.nickname,
            role : req.session.role
        }

        const date = req.query.date || ""
        return res.render('app',
            {
                page: 'dashboard',
                login: login,
                options: {
                    date: date
                }
            }
        )
    }
}

module.exports = {
    view
}
