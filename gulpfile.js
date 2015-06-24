'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var nodemon = require('gulp-nodemon');

gulp.task('lint', function() {
    return gulp.src(['./main.js', './controllers/*.js'])
            .pipe(jshint())
            .pipe(jshint.reporter(stylish));
});

gulp.task('run', function(){
    nodemon({
        script: 'main.js',
        ext: 'js'
    });
});
