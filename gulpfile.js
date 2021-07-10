const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');

const browserSync = require('browser-sync').create();
function style() {
    return gulp.src('./scss/**/*.scss').pipe(sass())
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream())
}
function minify() {
    return gulp.src('js/index.js')
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))     
        .pipe(gulp.dest('./jss'))
}
gulp.task('default', () =>
    gulp.src('js/index.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('jss'))
);
function watch() {
    browserSync.init({
        files: ['./index.html','./search_result.html'],
        server: {
            baseDir: './',
            index: 'index.html'
        }
    })
    gulp.watch('./scss/**/*.scss', style);
    gulp.watch('./*.html').on('change', browserSync.reload);
}
exports.style = style;
exports.minify = minify
exports.watch = watch;