const gulp = require('gulp');
const exec = require('child_process').exec;
const fs = require('fs-extra');
const concat = require('gulp-concat');
const gzip = require('gulp-gzip');
const del = require("del");
const log = require('fancy-log')
const rename = require('gulp-rename');
const pj = require('./package.json');

gulp.task("build:prod-nohash", function(done){
  exec(`ng build --prod --aot --output-hashing none --output-path tmp/dist/` , function (err, stdout, stderr) {
    log(stdout);
    log(stderr);
    done(err);  
  })
});

gulp.task("build:prod", function(done){
  exec(`ng build --prod --output-path tmp/dist/` , function (err, stdout, stderr) {
    log(stdout);
    log(stderr);
    done(err);  
  })
});

gulp.task("build:elements", function(done){
  log('---------- BUILDING ----------');
  const dist = "./tmp/dist";
  const f = [ 
              `${dist}/runtime.js`,
              `${dist}/polyfills.js`,
              `${dist}/scripts.js`,
              `${dist}/main.js`
            ]

  return  gulp.src(f)
              .pipe(concat('hubrix.js'))
              .pipe(gulp.dest('./dist/'))
              .pipe(rename(`hubrix.${pj.version}.js`))
              .pipe(gulp.dest('./dist/'));
  
  /*return  gulp.src(f)
              .pipe(concat('hubrix.js'))
              .pipe(gulp.dest('./dist/'))
              .pipe(gzip())
              .pipe(gulp.dest('./dist/'));
  */

})

gulp.task("build:zip", function(done){
  log('---------- ZIPPING ----------');

  return  gulp.src('./dist/*.js')
              .pipe(gzip())
              .pipe(gulp.dest('./dist/'));
})

function COPY(src, dest) {
  return gulp.src([src])
             .pipe(gulp.dest(dest));
};

function CLEAN (target) {
  log('---------- CLEANING ' + target + ' ----------');
  return del.sync(target);
}

gulp.task("copy:licenses", function(done){
  COPY('./tmp/dist/3rdpartylicenses.txt', 'dist/');
  done();
})

gulp.task("clean:dist", function(done){
  CLEAN('./tmp/dist/**');
  CLEAN('./dist/**');
  done()
})

gulp.task("copy:dist", function(done){
  
  COPY('./tmp/dist/**/*.css', 'dist/')
  COPY('./tmp/dist/assets/**/*', 'dist/assets/')
  return gulp.src(['./tmp/dist/styles.css'])
        .pipe(rename(`styles.${pj.version}.css`))
        .pipe(gulp.dest('./dist/'))
  
})

const pack = gulp.series(
  "clean:dist",
  "build:prod",
  "copy:licenses",
  "build:prod-nohash",
  "build:elements",
  "build:zip",
  "copy:dist"
);

gulp.task('pack', pack);



