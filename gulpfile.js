var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglify'),
    cleanCSS     = require('gulp-clean-css'),
    cache        = require('gulp-cache'),
    imagemin     = require('gulp-imagemin'),
    htmlmin      = require('gulp-htmlmin'),
    browserSync  = require('browser-sync').create(),
    del          = require('del'),
    ftp          = require('gulp-ftp'),
    gutil        = require('gulp-util');

gulp.task('sass', function() {
  return gulp.src('src/styles/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('src/styles'))
    .pipe(browserSync.stream());
});

gulp.task('js', function() {
  return gulp.src([
    'src/scripts/libs/jquery-3.2.1.js',
    'src/scripts/custom.js'
    ])
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

  gulp.watch('src/styles/scss/**/*', ['sass']);
  gulp.watch('src/scripts/custom.js', ['js']);
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
