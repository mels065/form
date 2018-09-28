const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const pump = require('pump');
const browserSync = require('browser-sync').create();

const SRC_DIR = 'src';
const DEST_DIR = 'static';

gulp.task('browser-sync', ['nodemon'], () => {
  browserSync.init(null, {
    proxy: "http://localhost:3000",
    files: ["static/**/*.*", "views/**/*.*"],
    port: 5000
  });
});

gulp.task('nodemon', (cb) => {
  let started = false;
  return plugins.nodemon({
    script: 'app.js',
    ext: 'scss',
    env: { 'NODE_ENV': 'development' },
    tasks: ['scss']
  })
    .on('start', () => {
      if (!started) {
        cb();
        started = true;
      }
    })
});

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

gulp.task('default', ['scss', 'browser-sync']);
