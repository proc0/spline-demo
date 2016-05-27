import { R, B } from '../tool';
// import view from './view/core';
// import state from './state/core';

/**
 * @type world :: DOM -> IO
 */
// var world = R.compose(view, state);
var seed = {
		init : function(app){
			return document.addEventListener('DOMContentLoaded', app, false);
		},
		state : {}, 
		input : {},
		output : {}
	};

/* @name AppCore
 * @type init :: WorldData -> IO
 * @cyto app :: IO -> IO
 */
 export default function init(options){
 	seed.input = options;

	seed.state.dom = document;
	// seed.state.view = initElements(seed.state.dom);
	seed.state.context = document.getElementsByClassName('canvas')[0].getContext('2d');

 	seed.output = initElements();
 	// return R.converge(R.call, [view, state])(seed);

 	return seed;
 }

//attach UI elements to state
function initElements(){
	var extract = R.compose(R.apply(R.compose), R.prepend(R.values), R.of, R.mapObjIndexed), 
		getElements = extract(function(handlers, className){ 
			return document.getElementsByClassName(className); 
		});

	return getElements;
}