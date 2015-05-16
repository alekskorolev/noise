var gulp = require('gulp'),
  nodemon = require('nodemon'),
  mocha = require('gulp-mocha');

gulp.task('serve', function (cb) {
  nodemon({
    script: 'server/app.js',
    watch: ['server/**/*.js', 'server/*.js']
  });
});

gulp.task('unit', function (cb) {
  return gulp.src('test/common.js', {
    read: false
  })
    .pipe(
      mocha({
        reporter: 'spec'
      })
    );  
});

gulp.task('unit-watch', function (cb) {
  gulp.start('unit');
  gulp.watch(['test/*.js', 'server/**/*.js', 'server/*.js'], ['unit']);
});

