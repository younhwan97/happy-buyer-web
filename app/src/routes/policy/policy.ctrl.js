"use strict";

const policy = {
    view: (req, res) => {
        return res.sendFile('policy.html', {root: __dirname})
    }
}

module.exports = {
    policy
}