'use strict';
module.exports = {
    entry: "./app/main",
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
	}
};