'use strict';

const gulp         = require('gulp');
const sass         = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglify');
const cleanCSS     = require('gulp-clean-css');
const cache        = require('gulp-cache');
const imagemin     = require('gulp-imagemin');
const htmlmin      = require('gulp-htmlmin');
const browserSync  = require('browser-sync').create();
const del          = require('del');
const ftp          = require('gulp-ftp');
const gutil        = require('gulp-util');

gulp.task('sass', function() {
  return gulp.src('src/styles/sass/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('src/styles'))
    .pipe(browserSync.stream());
});

gulp.task('js', function() {
  return gulp.src(['!src/scripts/main.js', 'src/scripts/**/*.js'])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('src/scripts'))
    .pipe(browserSync.stream());
});

gulp.task('mincss', function() {
  return gulp.src('src/styles/main.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('minjs', function() {
  return gulp.src('src/scripts/main.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('imagemin', function() {
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('htmlmin', function() {
  return gulp.src('src/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('server', ['sass', 'js'], function() {

  browserSync.init({server: 'src', notify: false});

  gulp.watch('src/styles/sass/**/*.sass', ['sass']);
  gulp.watch('src/scripts/common.js', ['js']);
  gulp.watch('src/images/**/*').on('change', browserSync.reload);
  gulp.watch('src/**/*.html').on('change', browserSync.reload);

});

gulp.task('rmdist', function() { return del.sync('dist', {read: false}); });

gulp.task('ftp', ['build'], function() {
  return gulp.src('dist/**/*')
    .pipe(ftp({
      host: 'host',
      user: 'user',
      pass: 'pass',
      remotePath: '/'
    }))
    .pipe(gutil.noop());
});

gulp.task('build', ['rmdist', 'sass', 'js', 'mincss', 'minjs', 'imagemin', 'htmlmin']);

gulp.task('default', ['server']);
