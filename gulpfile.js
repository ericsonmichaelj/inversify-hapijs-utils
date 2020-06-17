const gulp = require("gulp"),
    tslint = require("gulp-tslint"),
    tsc = require("gulp-typescript"),
    mocha = require("gulp-mocha"),
    istanbul = require("gulp-istanbul"),
    sourcemaps = require("gulp-sourcemaps"),
    del = require('del'),
    { execFile, exec } = require('child_process');


//******************************************************************************
//* CLEAN
//******************************************************************************
gulp.task("clean", function () {
    return del([
        "src/**/*.js",
        "src/*.js",
        "test/*.spec.js",
        "lib",
        "es",
        "amd"
    ]);
});

//******************************************************************************
//* LINT
//******************************************************************************
gulp.task("lint", function() {

    var config = {
        fornatter: "verbose",
        emitError: false
    };

    return gulp.src([
            "src/**/**.ts",
            "test/**/**.spec.ts"
        ])
        .pipe(tslint(config))
        .pipe(tslint.report());
});

//******************************************************************************
//* SOURCE
//******************************************************************************
var tsLibProject = tsc.createProject("tsconfig.json", {
    module: "commonjs"
});

gulp.task("build-lib", function() {
    return gulp.src([
            "src/**/*.ts"
        ])
        .pipe(tsLibProject())
        .on("error", function(err) {
            process.exit(1);
        })
        .js.pipe(gulp.dest("lib/"));
});

var tsEsProject = tsc.createProject("tsconfig.json", {
    module: "es2015"
});

gulp.task("build-es", function() {
    return gulp.src([
            "src/**/*.ts"
        ])
        .pipe(tsEsProject())
        .on("error", function(err) {
            process.exit(1);
        })
        .js.pipe(gulp.dest("es/"));
});

var tsDtsProject = tsc.createProject("tsconfig.json", {
    declaration: true,
    noResolve: false
});

gulp.task("build-dts", function() {
    return gulp.src([
            "src/**/*.ts"
        ])
        .pipe(tsDtsProject())
        .on("error", function(err) {
            console.log(err.message)
            process.exit(1);
        })
        .dts.pipe(gulp.dest("dts"));

});

//******************************************************************************
//* TESTS
//******************************************************************************
var tstProject = tsc.createProject("tsconfig.json");

gulp.task("build-src", function() {
    return gulp.src([
            "src/**/*.ts"
    ])
        .pipe(sourcemaps.init())
        .pipe(tstProject())
        .on("error", function(err) {
            process.exit(1);
        })
        .js.pipe(sourcemaps.write(".", {
            sourceRoot: function (file) {
                return file.cwd + '/src';
            }
        }))
        .pipe(gulp.dest("src/"));
});

var tsTestProject = tsc.createProject("tsconfig.json");

gulp.task("test:latest", function(cb) {
    exec("./node_modules/.bin/nyc --reporter=lcov ./node_modules/.bin/ts-mocha test/**/*.spec.ts --unhandled-rejections=strict", (err, stdout, stderr) => {
        console.log(stdout);
        console.error(stderr);
        if(err) throw err;
        cb()
    });
});

gulp.task("test:hapi18", function(cb) {
    execFile('./test_hapiv18.sh', (error, stdout, stderr) => {
        console.log(stdout);
        console.error(stderr);
        if(error) throw error
        cb()
    });
});

gulp.task("test", gulp.series("test:latest", "test:hapi18"))

gulp.task("build",gulp.parallel(["build-src", "build-es", "build-lib", "build-dts"]))

//******************************************************************************
//* DEFAULT
//******************************************************************************

exports.default = gulp.series("clean", "build", "test")
exports.watch = function() {
    gulp.watch('src/*.ts',gulp.series("clean", "build"))
};