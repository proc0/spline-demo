'use strict';
import { cyto } from './etc';
import cells from './cell';
import ios from './io';
import options from '../options';

var app = { 
		state : {
			options : options
		}, 
		input : cells, 
		output : ios 
	};

function init(app){
	console.log(app);
	// return R.pipe(app.input, app.output)(app.state);
}

/**
 * @name Core
 * @type core :: IO()
 */
export default cyto(app)(init);
