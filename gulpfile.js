// -- imports -----------------------
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    shell = require('gulp-shell'),
    util = require('util'),
    path = require('path'),
    replace = require('gulp-replace');

// -- livereload config -------------
var lr;
var EXPRESS_ROOT = path.join(__dirname, "/release/doc/api");//__dirname;
var EXPRESS_PORT = 4000;
var LIVERELOAD_PORT = 35729;

// -- task hooks -----------------------
gulp.on('task_start', function(e) {
    console.log(util.format("Running %s task", e.task));
});

// -- tasks ----------------------------
gulp.task('default', ['release']);

// cleans up the release directory
gulp.task('clean-folders', function() {
    var folders = [
        'publish',
        'release'
    ];

    return gulp.src(folders, { read: false })
        .pipe(clean());
});

// cleans up the compiled project
gulp.task('clean-compile', function() {
    // invoke sbt
    return gulp.src('')
        .pipe(shell('sbt clean'));
});

// cleans up the release artifacts of the project
gulp.task('clean', ['clean-folders', 'clean-compile']);

// compiles the project
gulp.task('compile', ['clean'], function() {

    // invoke sbt
    return gulp.src('')
        .pipe(shell('sbt assembly'));
});

// check code style
gulp.task('style', ['clean'], function() {

    // invoke sbt
    return gulp.src('')
        .pipe(shell('sbt scalastyle'));
});

// TODO gulp.task('compile'), gulp.task('publish / release')

// -- helper functions ----------------------------

function startExpress() {
    var express = require('express');
    var app = express();
    app.use(require('connect-livereload')());
    app.use(express.static(EXPRESS_ROOT));
    app.listen(EXPRESS_PORT);
}

function startLivereload() {
    lr = require('tiny-lr')();
    lr.listen(LIVERELOAD_PORT);
}

function notifyLivereload(event) {
    // `gulp.watch()` events provide an absolute path
    // so we need to make it relative to the server root
    var fileName = path.relative(EXPRESS_ROOT, event.path);

    lr.changed({
        body: {
            files: [fileName]
        }
    });
}
