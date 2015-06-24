/**
 * @api {get} /:user/:talk Read data of a Talk
 * @apiVersion 0.0.1
 * @apiName GetTalk
 * @apiGroup Talk
 *
 * @apiDescription Get talk data from speakerdeck.com
 *
 * @apiParam {String} user The Users ID.
 * @apiParam {String} talk The Talk ID.
 *
 * @apiExample Example usage:
 * curl -i http://speakerdeck-api.herokuapp.com/patrickhamann/breaking-news-at-1000ms-velocity-eu-2014
 *
 * @apiSuccess {Object}   user          The User object.
 * @apiSuccess {String}   user.data.id   The Users id.
 * @apiSuccess {String}   user.data.name   The Users name.
 * @apiSuccess {String}   user.data.avatar   The Users avatar.
 * @apiSuccess {String}   user.data.presentations   The ammount of other Talks the Users has.
 * @apiSuccess {String}   id            The id of the Talk.
 * @apiSuccess {String}   title         The title of the Talk.
 * @apiSuccess {String}   date          The date of the Talk.
 * @apiSuccess {String}   description   The description of the Talk.
 * @apiSuccess {String}   thumbnail     The Talk cover slide thumbnail.
 * @apiSuccess {Number}   views         The ammount of times the Talk has been viewed.
 * @apiSuccess {Number}   stars         The ammount of times the Talk has been starred.
 * @apiSuccess {String}   embed         The embed code for the Talk.
 * @apiSuccess {String}   download      The direct link to the Talks .pdf file.
 * @apiSuccess {Object[]} links         Array of hyperlinks related to the Talk.
 *
 * @apiError TalkNotFound   The <code>id</code> of the Talk was not found.
 **/


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
