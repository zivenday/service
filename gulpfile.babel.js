import gulp from 'gulp';
import watch from 'gulp-watch';
import babel from 'gulp-babel';

gulp.task('transform', () => {
  return gulp.src('lib/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('src'));
});

gulp.task('watch', () => {
  return gulp.src('lib/**/*.js')
    .pipe(watch('lib/**/*.js', {
      verbose: true
    }))
    .pipe(babel())
    .pipe(gulp.dest('src'));
});

gulp.task('default', () => {
  gulp.start('transform');
});