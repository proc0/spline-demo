'use strict';
import { R, B } from '../../tool';
import input from './input/core';
import output from './output/core';

export default {
	init : function(state){
		initElements(state);
		this.output = output(state);
	},
	input : input
}


//attach UI elements to state
function initElements(state){
	var extract = R.compose(R.apply(R.compose), R.prepend(R.values), R.of, R.mapObjIndexed), 
		getElements = extract(function(handlers, className){ 
			return document.getElementsByClassName(className); 
		});

	state.ui.elements = getElements(events);

	return state;
}

/**
 * @type init :: State -> IO
//  */
// function init(state){
// 		//load view properties to be used when rendering 
// 		//and other view tasks, uses Assignable convention
// 	var load = R.mapObjIndexed(function(loader, prop){ 
// 			return this[prop] = loader.bind(this)(state.context); 
// 		}.bind(state.ui.view)),
// 		//render default state		
// 		initView = R.compose(render, initEvents, initElements);

// 	return load(props) && initView(state);
// }
// var hasInit;

// export default function(state){
// 	if(!hasInit){
// 		init(state);
// 		hasInit = true;
// 	}
// 	// if(state instanceof State)
// 	// 	output(state);
// 	// else
// 	// 	input(state);
// }

