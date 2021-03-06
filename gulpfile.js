/**
 * Created by Administrator on 2017/2/9.
 */
var gulp = require('gulp'),
    connect = require('gulp-connect'),
    babel = require("gulp-babel"),
    sass = require('gulp-ruby-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    uglify=require('gulp-uglify'),
    browserSync = require('browser-sync'),
    nano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    concat  = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    clean = require('gulp-clean');

gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        ui: {
            port: 3002,/*PC端的UI控制界面端口*/
            weinre: {
                port: 3003/*手机端的UI控制界面端口*/
            }
        },
        port: 3001,
    });
});
gulp.task('html', function() {
    gulp.src('./src/*.html')
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.reload({stream: true}));
});
gulp.task('css', function() {
    gulp.src('./src/css/*.css')
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.reload({stream: true}));
});
gulp.task('sass', function() {
    sass('./src/sass/*.scss')
        .on('error', sass.logError)
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.reload({stream: true}))
        .pipe(nano({
            zindex: false,
            autoprefixer: false
        }))
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest('./dist/css'))

});

gulp.task('js', function() {
    gulp.src('./src/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/js'))
        .pipe(sourcemaps.write())
        .pipe(browserSync.reload({stream: true}))
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest('./dist/js'))
});
gulp.task('image', function() {
    gulp.src('./src/image/*.{png,jpeg,jpg,gif,svg,ico}')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/image'))
});
gulp.task('release', ['sass','css', 'html','js','image']);

gulp.task('watch', function() {
    gulp.watch('src/sass/*.scss', ['sass']); //监控scss文件
    gulp.watch('src/css/*.css', ['css']); //监控css文件
    gulp.watch(['src/*.html'], ['html']); //监控html文件
    gulp.watch(['src/js/*.js'], ['js']); //监控js文件
    gulp.watch(['src/image/*'], ['image']); //监控图片文件
});

gulp.task('clean', function(){
    return gulp.src('./dist/')
        .pipe(clean());
});

gulp.task('default', ['clean'],function () {
    gulp.start('release', 'server','watch');
});