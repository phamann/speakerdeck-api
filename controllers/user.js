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

    speakerdeck.getUser(req.params.user).then(function(data){
        data.user = decorateUser(data.user);
        data.talks = data.talks.map(decorateItem);
        decoratePagination(data);

        res.json(data);
        next();
    }).catch(function(err){
        res.status(500).json({ error: err });
    });

};
