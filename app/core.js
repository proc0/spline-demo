'use strict';
import { R, cyto } from './meta';
import input from './input/core';
import output from './output/core';
import options from '../options';

var app = { 
		state : {
			options : options
		}, 
		input : input, 
		output : output 
	};
/**
 * @name Core
 * @type core :: IO()
 */
export default cyto(app)();

