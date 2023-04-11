const { src, dest, watch, series, lastRun } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const rename = require('gulp-rename')
const plumber = require('gulp-plumber')
const changed = require('gulp-changed')
const del = require('del')


const originFolder = 'src'
const outputFolder = 'weapp-dist'

const srcOptions = { base: originFolder }
const watchOptions = { events: ['add', 'addDir', 'change', 'unlink', 'unlinkDir'] }

// 文件匹配路径
const globs = {
  js: `${originFolder}/**/*.js`, // 匹配 js 文件
  wxml: `${originFolder}/**/*.wxml`, // 匹配 wxml 文件
  wxs: `${originFolder}/**/*.wxs`, // 匹配 wxs 文件
  json: `${originFolder}/**/*.json`, // 匹配 json 文件
  sass: `${originFolder}/**/*.scss`, // 匹配 sass 文件
  wxss: `${originFolder}/**/*.wxss`, // 匹配 wxss 文件
  png: `${originFolder}/**/*.png`, // 匹配 png 文件
}

// 匹配需要拷贝的文件
globs.copy = [
  `**/assets/**`,
  `${globs.js}`,
  `${globs.wxs}`,
  `${globs.json}`,
  `${globs.wxss}`,
  `${globs.wxml}`,
  `${globs.png}`,
]

// 包装 gulp.lastRun, 引入文件 ctime 作为文件变动判断另一标准
// https://github.com/gulpjs/vinyl-fs/issues/226
const since = (task) => (file) => (lastRun(task) > file.stat.ctime ? lastRun(task) : 0);


/** 
 * `gulp clear`
 * 清理文件
 **/
const clearTask = () => del(`${outputFolder}/**`)

/** 
 * `gulp copy`
 * 移动文件
 **/
const copyTask = () =>
  src(globs.copy, { ...srcOptions, since: since(copyTask) })
    .pipe(changed(outputFolder)) // 过滤掉未改变的文件
    .pipe(dest(outputFolder))

/**
 * `gulp sass`
 * 编译 sass
 */
const sassTask = () =>
  src(globs.sass, { ...srcOptions, since: since(sassTask) })
    //展开编译的文件
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(
      plumber({
        errorHandler: (err) => {
          console.log(err);
          tasks.handleError(err.message);
        },
      }),
    )
    //后缀名改为wxss
    .pipe(rename(function(path){
        path.extname = '.wxss'
    }))
    .pipe(dest(outputFolder))

/**
 * `gulp wxml`
 * 处理wxml
 **/
const wxmlTask = () => 
  src(globs.wxml, { ...srcOptions, since: since(wxmlTask) })
    .pipe(dest(outputFolder))

/**
 * `gulp wxss`
 * 处理wxss
 **/
const wxssTask = () => 
  src(globs.wxss, { ...srcOptions, since: since(wxssTask) })
    .pipe(dest(outputFolder))

/**
 * `gulp wxs`
 * 处理wxss
 **/
 const wxsTask = () => 
 src(globs.wxs, { ...srcOptions, since: since(wxsTask) })
   .pipe(dest(outputFolder))

/**
 * `gulp js`
 * 处理js
 **/
const jsTask = () =>
  src(globs.js, { ...srcOptions, since: since(jsTask) })
    .pipe(dest(outputFolder))

/**
 * `gulp json`
 * 处理json
 **/
const jsonTask = () =>
  src(globs.json, { ...srcOptions, since: since(jsonTask) })
    .pipe(dest(outputFolder))

/**
 * `gulp png`
 * 处理png
 **/
 const pngTask = () =>
 src(globs.png, { ...srcOptions, since: since(pngTask) })
   .pipe(dest(outputFolder))

/**
 * `gulp build`
 * 构建
 **/
const buildTask = series(
  clearTask,
  sassTask,
  copyTask
)

/**
 * `gulp watch`
 * 监听
 **/
const watchTask = () => {
  copyTask()
  sassTask()
  watch(globs.js, watchOptions, jsTask)
  watch(globs.wxml, watchOptions, wxmlTask)
  watch(globs.wxs, watchOptions, wxsTask)
  watch(globs.wxss, watchOptions, wxssTask)
  watch(globs.json, watchOptions, jsonTask)
  watch(globs.sass, watchOptions, sassTask)
  watch(globs.png, watchOptions, pngTask)
}


module.exports = {
  clear: clearTask,
  build: buildTask,
  watch: watchTask,
  default: buildTask,
}
