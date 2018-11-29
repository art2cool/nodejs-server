const gulp = require('gulp');
const livereload = require('gulp-livereload');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

gulp.task('fonts', () => gulp.src('src/fonts/**/*.*')
  .pipe(gulp.dest('dist/fonts/'))
);

gulp.task('img', () => gulp.src(['src/img/**/*', '!src/img/svg'])
  .pipe(imagemin({
    interlaced: true,
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    plugins: [
      imageminJpegtran(),
      imageminPngquant({quality: '65-80'})
    ]
  }))
  .pipe(gulp.dest('dist/img'))
);

gulp.task('sass', () => gulp.src('src/scss/application.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(autoprefixer('last 2 version'))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('dist/css'))
);

gulp.task('scripts', () => gulp.src('src/js/*.js')
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'))
);

gulp.task('watch', ['sass', 'scripts', 'img', 'fonts'], () => {
  livereload.listen();

  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/js/*.js', ['scripts']);
  gulp.watch(['dist/application.css', 'dist/*.js'], files => livereload.changed(files) );
});

gulp.task('build', ['sass','scripts','fonts','img']);
