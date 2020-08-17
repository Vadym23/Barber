const gulp = require('gulp');
const sass = require('gulp-sass');
const jsonServer = require("gulp-json-srv");
const server = jsonServer.create();
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del'); 
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const csso = require('gulp-csso');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;

const jsFiles = [
  'source/js/getResourse.js',
  'source/js/createElement.js',
  'source/js/showFilter.js',
  'source/js/showBasket.js',
  'source/js/mobileNav.js',
  'source/js/formCheckout.js',
  'source/js/function.js',
  'source/js/app.js',
  '!source/js/build.min.js',
]
 
gulp.task('scss', function () {
  return gulp.src('source/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.write('.'))
    // .pipe(gulp.dest('source/css'))
    .pipe(gulp.dest('build/css'))
});

gulp.task('json-server', function() {
  return gulp.src("data.json")
    .pipe(server.pipe());
});

gulp.task('html', function() {
  return gulp.src("source/*.html")
    .pipe(gulp.dest('build/'));
});

gulp.task('data', function() {
  return gulp.src("data.json")
    .pipe(gulp.dest('build/'));
});

gulp.task('del', function() {
  return del('build')
});

gulp.task('watchCss', function () {
  gulp.watch('source/sass/**/*.scss', gulp.parallel('scss'));
});

gulp.task('imageMin', () => {
  return gulp.src('source/assets/img/**/*')
    .pipe(imagemin())    //времезатратно
    .pipe(gulp.dest('build/assets/img'));
})

gulp.task('js',() => {
  return gulp.src(jsFiles)
    .pipe(sourcemaps.init())
    // .pipe(babel()) //не работает babel
    .pipe(concat('build.min.js'))  
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/js'))
    // .pipe(gulp.dest('source/js'))
})

gulp.task('watchJs', function () {
  gulp.watch(jsFiles, gulp.parallel('js'));
});

gulp.task('build', gulp.series('del','html','scss','js','imageMin','data')); 

gulp.task('start', gulp.parallel('watchCss','json-server','watchJs'));
