'use strict';
import { R, cyto } from './tool';
import local from './local/core';
import world from './world/core';
import options from '../options';
/**
 * @type init :: IO{Event} -> IO{a}
 */
// var app = function init(options){
// 		var route = [
// 				world.output, 
// 				local.output, 
// 				local.input,
// 				world.input
// 			],
// 			seed = { 
// 				state : options, 
// 				input : {}
// 			};
// 		//return a function that returns a function that will apply options
// 		//to then be initialized and routed to the processing route
// 		return R.compose(R.compose(R.apply(R.compose, route), R.compose(local, world)), R.flip(R.set(R.lensProp('input'))(seed) );
// 	};

// var app = function init(options){
// 	return R.compose(R.apply(R.pipe(local, world)), R.prepend(options), Array);
// };


export default cyto(local, world, options);

