// Configuration for Injector task(s)
// Injects Link/Import statements in to specified files
'use strict';

var _str = require('underscore.string');

var taskConfig = function(grunt) {

  grunt.config.set('injector', {
    options: {

    },<% if (htmlOption === 'jade') { %>
    // Inject application script files into index.html (doesn't include bower)
    jade: {
      options: {
        transform: function(filePath) {<% if (useServer) { %>
          filePath = filePath.replace('/server/templates/', '../');
          <% } else { %>
          filePath = filePath.replace('/client/templates/', '../');<% } %>
          return 'include ' + filePath;
        },
        starttag: '//- [injector:jade]',
        endtag: '//- [endinjector]'
      },
      files: {<% if (useServer) { %>
        '<%%= yeogurt.server %>/templates/layouts/base.jade'<% } else { %>
        '<%%= yeogurt.client %>/templates/layouts/base.jade'<% } %>: [
          '<% if (useServer) { %><%%= yeogurt.server %><% } else { %><%%= yeogurt.client %><% } %>/templates/modules/*.jade',
        ]
      }
    },<% } %><% if (htmlOption === 'swig') { %>
    // Inject application script files into index.html (doesn't include bower)
    swig: {
      options: {
        transform: function(filePath) {<% if (useServer) { %>
          filePath = filePath.replace('/server/templates/', '../');
          <% } else { %>
          filePath = filePath.replace('/client/templates/', '../');<% } %>
          var fileName = filePath.substring(filePath.lastIndexOf('/')+1).slice(0, -5);
          return '{% import "' + filePath + '" as ' + _str.camelize(fileName) + ' %}';
        },
        starttag: '{# [injector:swig] #}',
        endtag: '{# [endinjector] #}'
      },
      files: {<% if (useServer) { %>
        '<%%= yeogurt.server %>/templates/layouts/base.swig'<% } else { %>
        '<%%= yeogurt.client %>/templates/layouts/base.swig'<% } %>: [
          '<% if (useServer) { %><%%= yeogurt.server %><% } else { %><%%= yeogurt.client %><% } %>/templates/modules/*.swig',
        ]
      }
    },<% } %><% if (jsOption === 'none') { %>
    // Inject application script files into index.html (doesn't include bower)
    scripts: {
      options: {
        transform: function(filePath) {
          filePath = filePath.replace('/client/', '');
          return '<script src="/' + filePath + '"></script>';
        },<% if (htmlOption === 'jade') { %>
        starttag: '// [injector:js]',
        endtag: '// [endinjector]'<% } else { %>
        starttag: '<!-- [injector:js] -->',
        endtag: '<!-- [endinjector] -->'<% } %>
      },
      files: {<% if (singlePageApplication) { %>
        '<%%= yeogurt.client %>/index.html'<% } else if (useServer) { %>
        '<%%= yeogurt.server %>/templates/<% if (htmlOption === 'jade') { %>layouts/base.jade<% } else if (htmlOption === 'swig') { %>layouts/base.swig<% } %>'<% } else { %>
        '<%%= yeogurt.client %>/<% if (htmlOption === 'jade') { %>templates/layouts/base.jade<% } else if (htmlOption === 'swig') { %>templates/layouts/base.swig<% } %>'<% } %>: [<% if (jsFramework === 'angular') { %>
          '<%%= yeogurt.client %>/app/**/*.js',
          '!<%%= yeogurt.client %>/app/main.js',
          '!<%%= yeogurt.client %>/app/**/*.spec.js',
          '!<%%= yeogurt.client %>/app/**/*.mock.js',<% } else { %>
          '<%%= yeogurt.client %>/scripts/**/*.js',<% } %>
          '!<%%= yeogurt.client %>/scripts/main.js'<% if (singlePageApplication) { %>,<% if (jsFramework === 'backbone' && jsOption === 'none') { %>
          '!<%%= yeogurt.client %>/scripts/views/layouts/default.js',<% } %><% if (jsFramework !== 'angular') { %>
          '!<%%= yeogurt.client %>/scripts/routes.js'<% } %><% } %>
        ]
      }
    },<% } %><% if (cssOption === 'less') { %>
    // Inject component less into main.less
    less: {
      options: {
        transform: function(filePath) {<% if (jsFramework === 'angular') { %>
          if (filePath.indexOf('app') > -1) {
            filePath = filePath.replace('/client/', '../');
          }
          else {
            filePath = filePath.replace('/client/styles/', '');
          }<% } else { %>
          filePath = filePath.replace('/client/styles/', '');<% } %>
          return '@import \'' + filePath + '\';';
        },
        starttag: '// [injector]',
        endtag: '// [endinjector]'
      },
      files: {
        '<%%= yeogurt.client %>/styles/main.less': [
          '<%%= yeogurt.client %>/styles/**/*.less',
          '!<%%= yeogurt.client %>/styles/main.less'<% if (jsFramework === 'angular') { %>,
          '<%%= yeogurt.client %>/app/**/*.less'<% } %>
        ]
      }
    },<% } %><% if (cssOption === 'sass') { %>
    // Inject component scss into main.scss
    sass: {
      options: {
        transform: function(filePath) {<% if (jsFramework === 'angular') { %>
          if (filePath.indexOf('app') > -1) {
            filePath = filePath.replace('/client/', '../');
          }
          else {
            filePath = filePath.replace('/client/styles/', '');
          }<% } else { %>
          filePath = filePath.replace('/client/styles/', '');<% } %>
          filePath = filePath.replace(/(\/)(_)([a-zA-z]+\.[A-Za-z]*)/, '$1$3');
          <% if (sassSyntax === 'scss') { %>
          return '@import \'' + filePath.slice(0, -5) + '\';';<% } else { %>
          return '@import ' + filePath.slice(0, -5);<% } %>
        },
        starttag: '// [injector]',
        endtag: '// [endinjector]'
      },
      files: {<% if (sassSyntax === 'scss') { %>
        '<%%= yeogurt.client %>/styles/main.scss': [
          '<%%= yeogurt.client %>/styles/**/*.scss',
          '!<%%= yeogurt.client %>/styles/main.scss'<% if (jsFramework === 'angular') { %>,
          '<%%= yeogurt.client %>/app/**/*.scss'<% } %>
        ]<% } else { %>
        '<%%= yeogurt.client %>/styles/main.sass': [
          '<%%= yeogurt.client %>/styles/**/*.sass',
          '!<%%= yeogurt.client %>/styles/main.sass'<% if (jsFramework === 'angular') { %>,
          '<%%= yeogurt.client %>/app/**/*.sass'<% } %>
        ]<% } %>
      }
    },<% } %><% if (cssOption === 'stylus') { %>
    // Inject component scss into main.scss
    stylus: {
      options: {
        transform: function(filePath) {<% if (jsFramework === 'angular') { %>
          if (filePath.indexOf('app') > -1) {
            filePath = filePath.replace('/client/', '../');
          }
          else {
            filePath = filePath.replace('/client/styles/', '');
          }<% } else { %>
          filePath = filePath.replace('/client/styles/', '');<% } %>
          return '@import \'' + filePath.slice(0, -5) + '\';';
        },
        starttag: '// [injector]',
        endtag: '// [endinjector]'
      },
      files: {
        '<%%= yeogurt.client %>/styles/main.styl': [
          '<%%= yeogurt.client %>/styles/**/*.styl',
          '!<%%= yeogurt.client %>/styles/main.styl'<% if (jsFramework === 'angular') { %>,
          '<%%= yeogurt.client %>/app/**/*.styl'<% } %>
        ]
      }
    },<% } %><% if (cssOption === 'css') { %>
    // Inject component css into index.html
    css: {
      options: {
        transform: function(filePath) {
          filePath = filePath.replace('/client/', '');<% if (htmlOption === 'jade') { %>
          return 'link(rel=\'stylesheet\', href=\'/' + filePath + '\')';<% } else { %>
          return '<link rel="stylesheet" href="/' + filePath + '">';<% } %>
        },<% if (htmlOption === 'jade') { %>
        starttag: '// [injector:css]',
        endtag: '// [endinjector]'<% } else { %>
        starttag: '<!-- [injector:css] -->',
        endtag: '<!-- [endinjector] -->'<% } %>
      },
      files: {<% if (singlePageApplication) { %>
        '<%%= yeogurt.client %>/index.html'<% } else if (useServer) { %>
        '<%%= yeogurt.server %>/templates/<% if (htmlOption === 'jade') { %>layouts/base.jade<% } else if (htmlOption === 'swig') { %>layouts/base.swig<% } %>'<% } else { %>
        '<%%= yeogurt.client %>/<% if (htmlOption === 'jade') { %>templates/layouts/base.jade<% } else if (htmlOption === 'swig') { %>templates//layouts/base.swig<% } %>'<% } %>: [
          '<%%= yeogurt.client %>/styles/**/*.css',
          '!<%%= yeogurt.client %>/styles/main.css'<% if (jsFramework === 'angular') { %>,
          '<%%= yeogurt.client %>/app/**/*.css'<% } %>
        ]
      }
    }<% } %>
  });

};

module.exports = taskConfig;
