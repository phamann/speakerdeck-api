/**
 * @api {get} /:user Read data of a User
 * @apiVersion 0.0.1
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiDescription Get user data from speakerdeck.com
 *
 * @apiParam {String} user The Users ID.
 * @apiParam {Number} [page] The page to query.
 *
 * @apiExample Example usage:
 * curl -i http://speakerdeck-api.herokuapp.com/patrickhamann
 *
 * @apiSuccess {Object}   user          The User object.
 * @apiSuccess {String}   user.data.id   The Users id.
 * @apiSuccess {String}   user.data.name   The Users name.
 * @apiSuccess {String}   user.data.bio    The Users bio.
 * @apiSuccess {String}   user.data.avatar   The Users avatar.
 * @apiSuccess {Number}   count         Count of Talks returned in current query.
 * @apiSuccess {Object[]} talks         Array of Talks by the User.
 * @apiSuccess {String}   talks.data.id     The id of the Talk.
 * @apiSuccess {String}   talks.data.title  The title of the Talk.
 * @apiSuccess {String}   talks.data.date   The date of the Talk.
 * @apiSuccess {Number}   talks.data.slides   The total number of slides within the Talk.
 * @apiSuccess {String}   talks.data.thumbnail   The talks cover slide thumbnail.
 * @apiSuccess {Object[]}   talks.links   Array of hyperlinks related to the Talk.
 * @apiSuccess {Object}   pagination    Pagination data.
 * @apiSuccess {Number}   pagination.currentPage   The index of the current page.
 * @apiSuccess {Number}   [pagination.nextPage]      The index of the next page.
 * @apiSuccess {Number}   [pagination.previousPage]      The index of the next page.
 * @apiSuccess {Object[]}   pagination.links       Array of hyperlinks related to the pagination.
 *
 * @apiError UserNotFound   The <code>id</code> of the User was not found.
 **/

"use strict";
var speakerdeck = require('speakerdeck-scraper');

function decorateItem(item) {
    var links = [
        { rel: 'external', href: item.url },
        { rel: 'api', href: item.url.replace('https://speakerdeck.com', '') }
    ];
    delete item.url;
    return {
        data: item,
        links: links
    };
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

function decoratePagination(data) {
    var links = [];
    var userId = data.user.data.id;
    var pagination = {
        totalPages: data.pages,
        currentPage: data.currentPage,
    };

    data.pagination = pagination;

    if(data.currentPage < data.pages) {
        data.pagination.nextPage = data.nextPage;
        delete data.nextPage;
        links.push({ rel: 'next', href: '/' + userId + '?page=' + (data.currentPage + 1) });
    }

    if(data.currentPage > 1) {
        data.previousPage = data.currentPage - 1;
        links.push({ rel: 'previous', href: '/' + userId + '?page=' + (data.currentPage - 1) });
    }

    if(links.length > 0) {
        data.pagination.links = links;
    }

    delete data.pages;
    delete data.currentPage;

    return data;

}

module.exports = function(req, res, next) {

    var page = req.query.page || 1;

    speakerdeck.getUser(req.params.user, page).then(function(data){
        data.user = decorateUser(data.user);
        data.talks = data.talks.map(decorateItem);
        decoratePagination(data);

        res.json(data);
        next();
    }).catch(function(err){
        res.status(500).json({ error: err });
    });

};
