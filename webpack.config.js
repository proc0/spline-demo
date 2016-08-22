'use strict';
module.exports = {
    entry: "./app/core",
    output: {
        path: __dirname + "/build",
        filename: "bundle.js"
    },
    module : {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel',
				query: {
					presets: ['es2015']
				}
			}
		]
	},
	devtools : '#cheap-eval-source-map'
};