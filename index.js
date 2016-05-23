var build = require('webpack-build');
 
build({
  config: './webpack.config.js',
  watch: true
}, function(err, data) {
});