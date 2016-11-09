var fs = require('fs');
var pkg = require('./package');

var minor_version = pkg.version.replace(/\.(\d)*$/, '');
var major_version = pkg.version.replace(/\.(\d)*\.(\d)*$/, '');
var path = require('path');

function rename_release (v) {
  return function (d, f) {
    var dest = path.join(d, f.replace(/(\.min)?\.js$/, '-'+ v + "$1.js"));
    return dest;
  };
}

module.exports = function(grunt) {
  grunt.initConfig({
    connect: {
      dev: {
        options: {
          base:  ["example", "build", "."],
          hostname: '0.0.0.0',
          port: 9999
        }
      },
      example: {
        options: {
          base:  ["example", "build", "."],
          hostname: '0.0.0.0',
          port: 3000
        }
      },
      example_https: {
        options: {
          base:  ["example", "build", "."],
          port:  3000,
          protocol: 'https',
          hostname: '*',
          cert: fs.readFileSync(__dirname + '/test/https_test_certs/server.crt').toString(),
          key:  fs.readFileSync(__dirname + '/test/https_test_certs/server.key').toString(),
        }
      }
    },
    browserify: {
      dist: {
        files: {
          'build/auth0.js': ['standalone.js'],
        },
        options: {
          debug: true
        }
      }
    },
    uglify: {
      options: {
        ascii: true
      }, min: {
        files: {
          'build/auth0.min.js': ['build/auth0.js']
        }
      }
    },
    copy: {
      release: {
        files: [
          { expand: true, flatten: true, src: 'build/*', dest: 'release/', rename: rename_release(pkg.version) },
          { expand: true, flatten: true, src: 'build/*', dest: 'release/', rename: rename_release(minor_version) },
          { expand: true, flatten: true, src: 'build/*', dest: 'release/', rename: rename_release(major_version) }
        ]
      }
    },
    clean: {
      build: ["release/", "build/"],
    },
    watch: {
      another: {
        files: ['node_modules', 'standalone.js', 'index.js', 'lib/*.js'],
        tasks: ['build']
      }
    },
    exec: {
      'test-integration': {
        cmd: 'node_modules/.bin/zuul --concurrency 1 -- test/*.js',
        stdout: true,
        stderr: true
      },
      'test-phantom': {
        cmd: 'node_modules/.bin/zuul --disable-tunnel --phantom 9999 -- test/*.js',
        stdout: true,
        stderr: true
      }
    },
    /* Checks for outdated npm dependencies before release. */
    outdated: {
      release: {
        development: false
      }
    },
    aws_s3: {
      options: {
        accessKeyId:     process.env.S3_KEY,
        secretAccessKey: process.env.S3_SECRET,
        bucket:          process.env.S3_BUCKET,
        region:          process.env.S3_REGION,
        uploadConcurrency: 5,
        params: {
          CacheControl: 'public, max-age=300'
        },
        //debug: true //<<< use this option to test changes
      },
      clean: {
        files: [
          { action: 'delete', dest: 'w2/auth0-' + pkg.version   + '.js'     },
          { action: 'delete', dest: 'w2/auth0-' + pkg.version   + '.min.js' },
          { action: 'delete', dest: 'w2/auth0-' + major_version + '.js'     },
          { action: 'delete', dest: 'w2/auth0-' + major_version + '.min.js' },
          { action: 'delete', dest: 'w2/auth0-' + minor_version + '.js'     },
          { action: 'delete', dest: 'w2/auth0-' + minor_version + '.min.js' }
        ]
      },
      publish: {
        files: [
          {
            expand: true,
            cwd:    'release/',
            src:    ['**'],
            dest:   'w2/'
          }
        ]
      }
    },
    http: {
      purge_js: {
        options: {
          url: process.env.CDN_ROOT + '/w2/auth0-' + pkg.version + '.js',
          method: 'DELETE'
        }
      },
      purge_js_min: {
        options: {
          url: process.env.CDN_ROOT + '/w2/auth0-' + pkg.version + '.min.js',
          method: 'DELETE'
        }
      },
      purge_major_js: {
        options: {
          url: process.env.CDN_ROOT + '/w2/auth0-' + major_version + '.js',
          method: 'DELETE'
        }
      },
      purge_major_js_min: {
        options: {
          url: process.env.CDN_ROOT + '/w2/auth0-' + major_version + '.min.js',
          method: 'DELETE'
        }
      },
      purge_minor_js: {
        options: {
          url: process.env.CDN_ROOT + '/w2/auth0-' + minor_version + '.js',
          method: 'DELETE'
        }
      },
      purge_minor_js_min: {
        options: {
          url: process.env.CDN_ROOT + '/w2/auth0-' + minor_version + '.min.js',
          method: 'DELETE'
        }
      }
    }
  });

  // Loading dependencies
  for (var key in grunt.file.readJSON("package.json").devDependencies) {
    if (key !== "grunt" && key.indexOf("grunt") === 0) grunt.loadNpmTasks(key);
  }

  grunt.registerTask("build",         ["clean", "browserify:dist", "uglify:min"]);
  grunt.registerTask("example",       ["build", "connect:example", "watch"]);
  grunt.registerTask("example_https", ["build", "connect:example_https", "watch"]);

  grunt.registerTask("dev",           ["build", "connect:dev", "watch"]);
  grunt.registerTask("integration",   ["build", "exec:test-integration"]);
  grunt.registerTask("phantom",       ["build", "exec:test-phantom"]);

  grunt.registerTask('purge_cdn',     ['http:purge_js', 'http:purge_js_min', 'http:purge_major_js', 'http:purge_major_js_min', 'http:purge_minor_js', 'http:purge_minor_js_min']);

  grunt.registerTask("cdn",           ["build", "copy:release", "aws_s3", "purge_cdn"]);

  grunt.registerTask('ci', function() {
    grunt.task.run(process.env.SAUCE_USERNAME ? 'integration' : 'phantom');
  });
};
