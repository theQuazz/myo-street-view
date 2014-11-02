var gulp       = require('gulp');
var browserify = require('gulp-browserify');

gulp.task('default', ['watch']);

gulp.task('build', ['build:html', 'build:js']);

gulp.task('build:js', function() {
	return gulp.src('src/*.js')
		.pipe(browserify({}))
		.pipe(gulp.dest('build'));
});

gulp.task('build:html', function() {
	return gulp.src('src/*.html')
		.pipe(gulp.dest('build'));
});

gulp.task('watch', ['build'], function() {
	gulp.watch('src/*', ['build']);
});
