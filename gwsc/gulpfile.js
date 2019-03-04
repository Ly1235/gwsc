const gulp = require("gulp");

const htmlminA = require("gulp-htmlmin");
const uglify = require('gulp-uglify');
const babel = require("gulp-babel");
const imagemin = require("gulp-imagemin");
const cssmin = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();


//压缩html
gulp.task("htmlmin", function(){

    gulp.src(["./src/*.html", "./src/*.htm"])
        .pipe(htmlminA({
            removeComments : true,//清除HTML注释
            collapseWhitespace : true,//压缩HTML
            collapseBooleanAttributes : true,//省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes : true,//删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes : true,//删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes : true,//删除<style>和<link>的type="text/css"
            minifyJS : true,//压缩页面JS
            minifyCSS : true//压缩页面CSS
        }))
        .pipe(gulp.dest("./dist"));
});
//压缩js
// 不想参与任务的文件,在文件路径的前面 !
gulp.task('jsmin', function(){
    gulp.src(['src/js/*','!src/js/lib']) //多个文件以数组形式传入
        .pipe(babel()) //注意,压缩js之前,就先要进行ES6的代码处理
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

//压缩,处理图片文件


gulp.task("imagemin", function(){
    // （**匹配src/js的0个或多个子文件夹）
    gulp.src(['./src/images/*.{png,jpg,gif,svg,jpeg}', './src/**/*.{png,jpg,gif,svg,jpeg}'])
        .pipe(imagemin({
            optimizationLevel : 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive : true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced : true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass : true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest("./dist/images"))

});


//压缩css
gulp.task('Cssmin', function(){
    gulp.src('src/css/*.css')
    //自动补全浏览器的私有前缀
        .pipe(autoprefixer({
            browsers : ['last 2 versions', 'Android >= 4.0'],
            cascade : true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove : true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css'));
});

gulp.task("run",["htmlmin", "jsmin", "imagemin", "Cssmin"]);

gulp.task("default", ["htmlmin", "jsmin", "imagemin", "Cssmin","browser-sync"]);

// 设置任务---使用代理
gulp.task('browser-sync', function () {
    browserSync.init({
        files:['./src/**'],
        //proxy:'localhost', // 设置本地服务器的地址
        port:8083,  // 设置访问的端口号
        server:{
            baseDir: "./"
        },
        directory:true
    });

    gulp.watch(["./src/*.html","./src/*.htm","./src/css/*.css","./src/js/*.js"],["htmlmin", "jsmin", "imagemin", "Cssmin"],browserSync.reload);
});
