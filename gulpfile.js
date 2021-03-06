//引入gulp和gulp插件，
var gulp = require('gulp'),
  assetRev = require('gulp-asset-rev'),
  runSequence = require('run-sequence'),
  rev = require('gulp-rev'),
  revCollector = require('gulp-rev-collector');

//定义css、js源文件路径
var cssSrc = 'WebContent/static/css/*.css',  // 注意这里修改为你的源文件路径，例如笔者的项目css文件，设置为 static/css/main/*.css ，js同理。
  jsSrc = 'WebContent/static/js/*.js';

//为css中引入的图片/字体等添加hash编码
gulp.task('assetRev', function(){
  return gulp.src(cssSrc)  //该任务针对的文件
   .pipe(assetRev()) //该任务调用的模块
   .pipe(gulp.dest(cssSrc)); //编译后的路径
});

//CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revCss', function(){
  return gulp.src(cssSrc)
    .pipe(rev())
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/css'));
});

//js生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revJs', function(){
  return gulp.src(jsSrc)
    .pipe(rev())
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/js'));
});

//Html替换css、js文件版本
gulp.task('revHtml', function() {
  return gulp.src(['rev/**/*.json', 'View/*.html']) // 这里的View/*.html是项目html文件路径，如果gulpfile.js和html文件同在一级目录下，修改为return gulp.src(['rev/**/*.json', '*.html']);
    .pipe(revCollector())
    .pipe(gulp.dest('View'));// 注意这里是生成的新的html文件，如果设置为你的项目html文件所在文件夹，会覆盖旧的html文件，若上面的View/*.html修改了，这里也要相应修改，如果gulpfile.js和html文件同在一级目录下，修改为  .pipe(gulp.dest(''));
});

//开发构建
gulp.task('default', function(done) {
  condition = false;
  runSequence(    //需要说明的是，用gulp.run也可以实现以上所有任务的执行，只是gulp.run是最大限度的并行执行这些任务，而在添加版本号时需要串行执行（顺序执行）这些任务，故使用了runSequence.
    ['assetRev'],
    ['revCss'],
    ['revJs'],
    ['revHtml'],
    done);
});