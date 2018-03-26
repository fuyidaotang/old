// Sass configuration
var gulp = require('../node_modules/gulp/index.js');
var sass = require('../node_modules/gulp-sass/index.js');

gulp.task('sass', function () {
    gulp.src('src/scss/common.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css'))
});

gulp.task('buildSass', ['sass'], function () {
    gulp.watch('src/scss/common.scss', ['sass']);
})