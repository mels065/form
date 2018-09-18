const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const pump = require('pump');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const path = require('path');

const SRC_DIR = 'src';
const DEST_DIR = 'static';

gulp.task('browser-sync', ['nodemon'], () => {
  browserSync.init({
    proxy: 'localhost:3000',
    port: 5000,
    notify: true
  });
});

gulp.task('nodemon', (cb) => {
  let called = false;
  return plugins.nodemon({
    script: 'index.js',
    ignore: [
      'gulpfile.js',
      'node_modules/'
    ]
  })
  .on('start', () => {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', () => {
    setTimeout(() => reload, 1000)
  });
});

gulp.task('pug', () => (
  pump([
    browserSync.stream()
  ])
));

gulp.task('scss', () => (
  pump([
    gulp.src(`${SRC_DIR}/sass/*.scss`),
    plugins.sassBulkImport(),
    plugins.sass({ includePaths: ['sass'] }),
    plugins.csso(),
    gulp.dest(`${DEST_DIR}/css`),
    browserSync.stream()
  ])
));

gulp.task('default', ['browser-sync'], () => {
  gulp.watch(`${SRC_DIR}/sass/**/*.scss`, ['scss']);
  gulp.watch(`${SRC_DIR}/js/**/*.js`, ['js']);
  gulp.watch(`${SRC_DIR}/views/**/*.pug`, ['pug']);
});
