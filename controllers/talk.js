"use strict";
var speakerdeck = require('speakerdeck-scraper');

function decorateLinks(data, path) {
    return [
        { rel: 'download', href: data.download },
        { rel: 'external', href: 'https://speakerdeck.com/' + path  },
        { rel: 'api', href: '/' + path }
    ];
}

function decorateUser(user) {
    var links = [
        { rel: 'external', href: user.url },
        { rel: 'api', href: '/' + user.id  }
    ];
    delete user.url;
    return {
        data: user,
        links: links
    };
}

module.exports = function(req, res, next) {

    var path = req.params.user + '/' + req.params.id;

    speakerdeck.getTalk(path).then(function(data){
        data.user = decorateUser(data.user);
        data.links = decorateLinks(data, path);

        res.json(data);
        next();
    }).catch(function(err){
        res.status(500).json({ error: err });
    });

};
