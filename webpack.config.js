'use strict';
module.exports = {
    entry: "./js/index",
    output: {
        path: __dirname + "/build",
        filename: "bundle.js"
    },
    module : {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel',
				query: {
					presets: ['es2015']
				}
			}
		]
	}
};