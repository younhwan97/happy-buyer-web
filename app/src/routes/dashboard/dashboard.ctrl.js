"use strict";

/* Module */
// empty

const view = {
    dashboard: (req, res) => {
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
