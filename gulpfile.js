'use strict';

const project_folder = './dist/kanban/';
const path = {
  html: './dist/kanban/*.html',
  css: './dist/kanban/*.css',
  js: './dist/kanban/*.js',
  img: './dist/kanban/assets/*',
}

const gulp = require('gulp'),
  { parallel } = require('gulp'),
  imagemin = require('gulp-imagemin'),
  htmlmin = require('gulp-htmlmin'),
  cleanCSS = require('gulp-clean-css'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify-es').default;

gulp.task('minimize-img', () =>
  gulp.src(path.img)
    .pipe(imagemin())
    .pipe(gulp.dest(project_folder + 'assets/'))
)

gulp.task('minify-html', () =>
  gulp.src(path.html)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(project_folder))
  );

gulp.task('minify-css', () =>
  gulp.src(path.css)
    .pipe(sourcemaps.init())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(project_folder))
  );

gulp.task('minify-js', () =>
  gulp.src(path.js)
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(project_folder))
  );

gulp.task('build', parallel('minify-js', 'minimize-img', 'minify-html', 'minify-css'));
