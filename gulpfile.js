const gulp         = require('gulp');
const sass         = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS     = require('gulp-clean-css');
const imagemin     = require('gulp-imagemin');
const htmlmin      = require('gulp-htmlmin');
const browserSync  = require('browser-sync').create();
const del          = require('del');

gulp.task('sass', function() {
  return gulp.src('src/styles/sass/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('src/styles'))
    .pipe(browserSync.stream());
});

gulp.task('mincss', function() {
  return gulp.src('src/styles/main.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('imagemin', function() {
  return gulp.src('src/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'));
});

gulp.task('htmlmin', function() {
  return gulp.src('src/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('server', ['sass'], function() {

  browserSync.init({server: 'src', notify: false});

  gulp.watch('src/styles/sass/**/*.sass', ['sass']);
  gulp.watch('src/images/**/*').on('change', browserSync.reload);
  gulp.watch('src/**/*.html').on('change', browserSync.reload);

});

gulp.task('rmdist', function() { return del.sync('dist'); });

gulp.task('build', ['rmdist', 'sass', 'mincss', 'imagemin', 'htmlmin']);

gulp.task('default', ['server']);
