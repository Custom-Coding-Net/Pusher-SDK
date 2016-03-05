﻿/// <binding />
// include plug-ins
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var del = require('del');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var config = {
    //Include all js files but exclude any min.js files
    browserify: {
        src: './Source/pusher.js',
        opts: {
            standalone: 'Pusher'
        }
    }
}

//delete the output file(s)
gulp.task('clean', function () {
    //del is an async function and not a gulp plugin (just standard nodejs)
    //It returns a promise, so make sure you return that from this task function
    //  so gulp knows when the delete is complete
    return del(['Dist/*.js']);
});

//delete the output file(s)
gulp.task('cleanMin', function () {
    //del is an async function and not a gulp plugin (just standard nodejs)
    //It returns a promise, so make sure you return that from this task function
    //  so gulp knows when the delete is complete
    return del(['Dist/*.min.js']);
});

// Combine and minify all files from the app folder
// This tasks depends on the clean task which means gulp will ensure that the 
// Clean task is completed before running the scripts task.
gulp.task('build', ['clean'], function () {
    return browserify(config.browserify.src, config.browserify.opts)
        .bundle()
        .pipe(source('pusher.sdk.js'))
        .pipe(gulp.dest('./Dist'));
});

gulp.task('buildMin', ['cleanMin'], function () {
    return browserify(config.browserify.src, config.browserify.opts)
        .bundle()
        .pipe(source('pusher.sdk.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./Dist'));
});

//Set a default tasks
gulp.task('default', ['build', 'buildMin'], function () { });