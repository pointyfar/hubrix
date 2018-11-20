const gulp = require('gulp');
const exec = require('child_process').exec;
const fs = require('fs-extra');
const concat = require('gulp-concat');
const gzip = require('gulp-gzip');


gulp.task("build:prod-nohash", function(done){
  exec(`ng build --prod --aot --output-hashing none --output-path tmp/dist/` , function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    done(err);  
  })
});

gulp.task("build:prod", function(done){
  exec(`ng build --prod --output-path tmp/dist/` , function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    done(err);  
  })
});

gulp.task("build:elements", function(done){
  console.log('---------- BUILDING ----------');
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
              .pipe(gzip())
              .pipe(gulp.dest('./dist/'));
  

})

function COPY(src, dest) {
  return gulp.src([src])
             .pipe(gulp.dest(dest));
};

gulp.task("copy:licenses", function(done){
  COPY('./tmp/dist/3rdpartylicenses.txt', 'dist/');
  done();
})

gulp.task("copy:dist", function(done){
  COPY('./tmp/dist/**/*.css', 'dist/');
  COPY('./tmp/dist/assets/**/*', 'dist/assets/');
  
  done();
})

const pack = gulp.series(
  "build:prod",
  "copy:licenses",
  "build:prod-nohash",
  "build:elements",
  "copy:dist"
);

gulp.task('pack', pack);



