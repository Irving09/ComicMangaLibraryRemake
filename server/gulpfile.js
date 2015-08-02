var gulp = require('gulp');
var mocha = require('gulp-mocha');
var cover = require('gulp-coverage');

gulp.task('default', function () {
	return gulp.src('./test/*', {read: false})
		.pipe(cover.instrument({
            // pattern: ['**/test*'],
            pattern: ['./clearDB/*.js', './routes/*.js', './server.js'],
            debugDirectory: 'debug'
        }))
		.pipe(mocha({reporter: 'nyan'}))
        .pipe(cover.gather())
        .pipe(cover.format())
        .pipe(gulp.dest('reports'));
});