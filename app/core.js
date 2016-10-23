'use strict';
import { R, B, Cyto, Cell, State } from './etc';
import cells from './cell';
import ios from './io';
import options from '../options';

var app = new Cyto({ 
		state : {
			options : options
		}, 
		input : cells, 
		output : ios 
	}),
	main = document.getElementsByTagName('main')[0];


function init(seed){
	console.log(seed);
	// R.map(trace, seed);
	console.log( R.reduce(redx, "", seed) );
	console.log( R.reduce(redx2, [], seed) );

}

export default init(app);

function redx(a, b){
	var str;

	if(b instanceof Cyto){
		str = a + "\nCell";
	}
	
	if(b instanceof Cell){
		str = a + "\nCell";
	}

	if(b instanceof State){
		str = a + "\nState";
	}

	return str;
}

function redx2(a, b){
	if(b instanceof State === false){
		a.push(b);
	}
	return a;
}

function trace(a){
	console.log(a);

	return a;
}




// var cmp  = R.apply(R.compose),
// 	fst  = R.compose(R.head, Array),
// 	snd  = R.compose(R.last, Array),
// 	wrap = R.compose(cmp, R.prepend(cmp), R.append(R.of), Array),
// 	then = R.compose(R.apply(wrap), R.map(R.prepend), R.reverse, Array),
	
// 	getHandler 	= R.compose(R.flip(R.prop), fst),
// 	callHandler = R.compose(R.flip(R.call), snd),
// 	bindHandler = R.converge(R.compose, [callHandler, getHandler]),
// 	bindArrows	= R.pipe(DataType, then(R.flip(R.map), wrap(R.append(bindHandler)))),
// 	category = R.curry(function(arrows, data){ 
// 		return bindArrows(arrows.type)(data.type)(arrows, data);
// 	}),

// 	pipeSegment = R.pipe(category, then(R.head, lift)),
// 	buildPipeline = R.compose(R.apply(R.pipe), R.map(pipeSegment));
// /**
//  * @name Core
//  * @type core :: IO()
//  */
// export default cyto(app)(init);

// function init(dna){
// 		/*** 
// 		 *
// 		 **/
// 	var pipeline = R.flatten([dna.input, dna.output]),
// 		app = buildPipeline(pipeline),

// 		getElement = function(className){ 
// 			return document.getElementsByClassName(className)[0]; 
// 		},
// 		initEvents = function(compEvents, compName){
// 			var inputEvents = dna.input[0].type,
// 				htmlElement = getElement(compName),
				
// 				getEventList = R.compose(R.flatten, R.values),
// 				filterFields = R.filter(R.compose(R.not, R.equals('type'))),
// 				filterEvents = R.converge(R.compose(filterFields, R.intersection), [getEventList, snd]),

// 				handlError = R.compose(console.log, Error),
// 				isNotEmpty = R.converge(R.and, [R.compose(R.not, R.isNil), R.compose(R.not, R.isEmpty)]),

// 				bindEvent  = function(eventName){ return B.fromEvent(htmlElement, eventName).onValue(app) },
// 				initialize = R.compose(R.ifElse(isNotEmpty, R.map(bindEvent), handlError), filterEvents);

// 			return initialize( inputEvents, compEvents );
// 		},
// 		//TODO: cleanup method of initializing dom elements with comp states
// 		initUI = R.compose(R.mapObjIndexed(initEvents), R.prop('map'));
// 	//iterate through all ui elements, for each one get the mapping
// 	//which contains a map from the comp's css class to event names
// 	return R.map(initUI, dna.state.ui);
// }


// function lift(value){
// 	console.log(value);
// 	return value;
// }

// function DataType(data){

// 	return function(type){
// 		var handlers = [];

// 		R.mapObjIndexed(function(eventNames, handlerName){
// 			var match = R.filter(R.equals(type), eventNames);

// 			if(match.length)
// 				handlers.push(handlerName);

// 		}, data);

// 		return handlers;
// 	}
// }