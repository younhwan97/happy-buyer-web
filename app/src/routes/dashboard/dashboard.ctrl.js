"use strict";

/* Module */
// empty

const view = {
    dashboard: (req, res) => {
        if(!req.session.is_logined) return res.redirect('/auth/login')

        const date = req.query.date || ""
        return res.render('app',
            {
                page: 'dashboard',
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
