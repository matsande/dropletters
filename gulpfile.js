'use strict';

var gulp = require('gulp');
var Jasmine = require('jasmine');
var jspm = require('jspm');
var sass = require('gulp-sass');
var spawn = require('child_process').spawn;
var htmlReplace = require('gulp-html-replace');
var path = require('path');

const isWin = /^win/.test(process.platform);
const cmd = target => isWin ? `${target}.cmd` : target;
const output = './dist';

function runSass(dest, options) {
    return gulp.src('./style/app.scss')
        .pipe(sass(options).on('error', sass.logError))
        .pipe(gulp.dest(dest));
}

gulp.task('build', [
    'tsc',
    'copy-html',
    'copy-resources',
    'copy-dependencies',
    'sass-dist',
    'bundle'
]);

gulp.task('bundle', done => {

    jspm.setPackagePath('.');
    jspm.bundle('src/app', `${output}/bundle.js`, {
        minify: true,
        mangle: true,
        sourceMaps: false,
    })
        .then(() => done());
});

gulp.task('copy-html', () => {
    return gulp.src('./index.html')
        .pipe(htmlReplace({
            'bundle': '<script src="bundle.js"></script>'
        }))
        .pipe(gulp.dest(output));
});

gulp.task('copy-css', () => {
    return gulp.src('./style/**/*.css')
        .pipe(gulp.dest(`${output}/style`));
});

gulp.task('copy-resources', () => {
    return gulp.src('./res/**/*.*')
        .pipe(gulp.dest(`${output}/res`));
});

gulp.task('copy-dependencies', ['jspm-deps', 'root-deps']);

gulp.task('jspm-deps', () => {
    return gulp.src([
        './jspm_packages/system.js',
        './jspm_packages/system-polyfills.js'
    ]).pipe(gulp.dest(`${output}/jspm_packages`));
});

gulp.task('root-deps', () => {
    return gulp.src([
        './config.js',
    ]).pipe(gulp.dest(`${output}`));
});


gulp.task('sass-dist', () => {
    return runSass(`${output}/style`, { outputStyle: 'compact' });
});

gulp.task('sass:watch', done => {
    gulp.watch('./style/**/*.scss', file => {
        console.log(`Changed: ${path.basename(file.path)} compiling...`);
        runSass('./style');
    });
});

gulp.task('test', done => {
    var jasmine = new Jasmine();

    jasmine.loadConfig({
        spec_dir: './test',
        spec_files: ['./**/*_spec.js']
    });

    jasmine.onComplete(passed => {
        if (passed) {
            console.log('All specs passed');
        } else {
            console.log('One or more specs failed');
        }

        done();
    });

    jasmine.execute();
});

gulp.task('tsc', done => {

    const tsc = spawn(cmd('tsc'), ['--listFiles']);
    tsc.stdout.on('data', data => {
        console.log(data.toString());
    });

    tsc.stderr.on('data', data => {
        console.log(`ERROR: ${data}`);
    })

    tsc.on('close', () => done());
});