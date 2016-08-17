'use strict';
import { R, cyto } from './meta';
import input from './input/core';
import output from './output/core';
import options from '../options';

var app = { 
		state : {}, 
		input : input, 
		output : output 
	},
	seed = {
		//init flag
		init : {
			options : options
		}
	};
/**
 * @name Core
 * @type core :: IO()
 */
export default cyto(app)(seed);

