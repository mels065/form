const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const pump = require('pump');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

const SRC_DIR = 'src';
const DEST_DIR = 'static';

gulp.task('nodemon', () => (
  plugins.nodemon({
    script: 'index.js',
    ext: 'pug scss',
    env: { 'NODE_ENV': 'development' },
    tasks: ['pug', 'scss']
  })
));

gulp.task('pug', () => (
  pump([
    gulp.src(`${SRC_DIR}/views/*.pug`),
    gulp.dest(`${SRC_DIR}/views`)
  ])
));

gulp.task('scss', () => (
  pump([
    gulp.src(`${SRC_DIR}/sass/*.scss`),
    plugins.sassBulkImport(),
    plugins.sass({ includePaths: ['sass'] }).on('error', plugins.sass.logError),
    plugins.autoprefixer(),
    plugins.csso(),
    gulp.dest(`${DEST_DIR}/css`)
  ])
    .on('error', function(err) {
      console.log(err.toString);
      this.emit('end');
    })
));

gulp.task('default', ['scss', 'pug', 'nodemon']);
