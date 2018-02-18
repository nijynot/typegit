const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const watch = require('gulp-watch');

gulp.task('babel-schema', () => {
  return gulp.src('./src/schema/**/*.js')
  .pipe(babel({
    presets: ['es2015', 'stage-0'],
    plugins: ['transform-runtime'],
  }))
  .pipe(gulp.dest('./lib/schema'));
});
gulp.task('babel-config', () => {
  return gulp.src('./src/config/**/*.js')
  .pipe(babel({
    presets: ['es2015', 'stage-0'],
    plugins: ['transform-runtime'],
  }))
  .pipe(gulp.dest('./lib/config'));
});

gulp.task('sass', () => {
  gulp.src(`${__dirname}/src/views/**/*.scss`)
  .pipe(sass().on('error', sass.logError))
  .pipe(concat('style.css'))
  .pipe(gulp.dest('./public/css'));
});

gulp.task('watch', () => {
  gulp.watch(['./src/views/**/*.scss'], ['sass']);
  // gulp.watch(['./config/es6/*.js'], ['babel-config']);
});
