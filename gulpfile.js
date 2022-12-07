const { src, dest, series, watch} = require('gulp');
const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const image = require('gulp-image');
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const sass = require('gulp-sass')(require('sass'));
const gulpif = require('gulp-if');
const argv = require('yargs').argv;
const changed = require('gulp-changed');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttftowoff2');
const browserSync = require('browser-sync').create();

const clean = () => {
  return del(['dist'])
}

const fonts = (done) => {
  src('src/fonts/**/*.ttf')
		.pipe(changed('dist/fonts', {
			extension: '.woff2',
			hasChanged: changed.compareLastModifiedTime
		}))
		.pipe(ttf2woff2())
		.pipe(dest('dist/fonts'))

    src('src/fonts/**/*.ttf')
		.pipe(changed('dist/fonts', {
			extension: 'woff',
			hasChanged: changed.compareLastModifiedTime
		}))
		.pipe(ttf2woff())
		.pipe(dest('dist/fonts'))
    done();
}

const preproc = () => {
  return src('src/styles/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(argv.prod, sourcemaps.write()))
    .pipe(dest('src/styles'))
    .pipe(browserSync.stream())
}

const styles = () => {
  return src('src/styles/**/*.css')
  .pipe(sourcemaps.init())
  .pipe(concat('main.css'))
  .pipe(autoprefixer({
    cascade: false
  }))
  .pipe(gulpif(argv.prod, cleanCSS()))
  .pipe(gulpif(argv.prod, sourcemaps.write()))
  .pipe(dest('dist/styles'))
  .pipe(browserSync.stream())
}

const htmlMinify = () => {
  return src('src/**/*.html')
  .pipe(gulpif(argv.prod, htmlMin({
    collapseWhitespace: true,
  })))
  .pipe(dest('dist'))
  .pipe(browserSync.stream())
}

const scripts = () => {
  return src([
    'src/js/components/**/*.js',
    'src/js/main.js'
  ])
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(concat('app.js'))
  .pipe(gulpif(argv.prod, uglify().on('error', notify.onError())))
  .pipe(gulpif(argv.prod, sourcemaps.write()))
  .pipe(dest('dist/scripts'))
  .pipe(browserSync.stream())
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
}

const images = () => {
  return src([
    'src/images/**/*.jpg',
    'src/images/**/*.jpeg',
    'src/images/**/*.png',
    'src/images/*.svg'
  ])
  .pipe(gulpif(argv.prod, image()))
  .pipe(dest('dist/img'))
}

watch('src/**/*.html', htmlMinify)
watch('src/styles/**/*.scss', preproc)
watch('src/styles/**/*.css', styles)
watch('src/js/**/*.js', scripts)

exports.fonts = fonts
exports.styles = styles
exports.htmlMinify = htmlMinify
exports.scripts = scripts
exports.preproc = preproc
exports.default = series(clean, fonts, htmlMinify, scripts, preproc, styles, images, watchFiles)
