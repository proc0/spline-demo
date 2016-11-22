'use strict';
module.exports = {
    entry: "./src/core",
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
			},
			{ test: /\.hbs$/, loader: "handlebars-loader" }
		]
	},
	devtools : '#cheap-eval-source-map'
};