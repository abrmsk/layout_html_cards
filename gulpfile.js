const gulp = require('gulp');
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const del = require('del');

// Таск для сборки PUG файлов
gulp.task('pug', function(callback) {
	return gulp.src('./src/pug/pages/**/*.pug')
		.pipe( plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Pug',
					sound: false,
					message: err.message
				}
			})
		}))
		.pipe( pug({
			pretty: true
		}) )
		.pipe( gulp.dest('./build/') )
		.pipe( browserSync.stream() )
	callback();
});

// Таск для компиляции SCSS в CSS
gulp.task('scss', function(callback) {
	return gulp.src('./src/scss/main.scss')
		.pipe( plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Styles',
			        sound: false,
			        message: err.message
				}
			})
		}))
		.pipe( sourcemaps.init() )
		.pipe( sass() )
		.pipe( autoprefixer({
			overrideBrowserslist: ['last 4 versions']
		}) )
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest('./build/css/') )
		.pipe( browserSync.stream() )
	callback();
});

// Копирование Изображений
gulp.task('copy:img', function(callback) {
	return gulp.src('./src/img/**/*.*')
	  .pipe(gulp.dest('./build/img/'))
	callback();
});

// Копирование Скриптов
gulp.task('copy:js', function(callback) {
	return gulp.src('./src/js/**/*.*')
	  .pipe(gulp.dest('./build/js/'))
	callback();
});

// Копирование Fonts
gulp.task('copy:fonts', function(callback) {
	return gulp.src('./src/fonts/**/*.*')
	  .pipe(gulp.dest('./build/fonts/'))
	callback();
});

// Слежение за HTML и CSS и обновление браузера
gulp.task('watch', function() {

	// Следим за картинками и скриптами и обновляем браузер
	gulp.watch('./build/(js | img | fons)/**/*.*', gulp.parallel(browserSync.reload) );

	// Запуск слежения и компиляции SCSS с задержкой
	gulp.watch('./src/scss/**/*.scss', gulp.parallel('scss'))

	// Слежение за PUG и сборка
	gulp.watch('./src/pug/**/*.pug', gulp.parallel('pug'))

	// Следим за картинками и скриптами, и копируем их в build
	gulp.watch('./src/img/**/*.*', gulp.series('clean:img', 'copy:img'))
	gulp.watch('./src/js/**/*.*', gulp.parallel('copy:js'))

});

// Задача для старта сервера из папки app
gulp.task('server', function() {
	browserSync.init({
		server: {
			baseDir: "./build/"
		}
	})
});

gulp.task('clean:build', function() {
	return del('./build')
});

gulp.task('clean:img', function() {
	return del('./build/img')
});

// Дефолтный таск (задача по умолчанию)
// Запускаем одновременно задачи server и watch
gulp.task(
		'default', 
		gulp.series( 
			gulp.parallel('clean:build'),
			gulp.parallel('scss', 'pug', 'copy:img', 'copy:js', 'copy:fonts'), 
			gulp.parallel('server', 'watch'), 
			)
	);
