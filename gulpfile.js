const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const watch = require('gulp-watch');

gulp.task('babel-schema', () => {
  return gulp.src('./schema/**/*.js')
  .pipe(babel({
    // plugins: ['transform-runtime'],
    presets: ['es2015', 'stage-0'],
  }))
  .pipe(gulp.dest('./schema-es5'));
});

gulp.task('sass', () => {
  gulp.src(`${__dirname}/views/**/*.scss`)
  .pipe(sass().on('error', sass.logError))
  .pipe(concat('style.css'))
  .pipe(gulp.dest('./public/css'));
});

gulp.task('watch', () => {
  gulp.watch(['./views/**/*.scss'], ['sass']);
  // gulp.watch(['./config/es6/*.js'], ['babel-config']);
});
