'use strict';
import { R, B, Cyto, Cell, Colony, State } from './etc';
import cells from './cell';
import ios from './io';
import options from '../options';

const seed = new Cyto({ 
		state : {
			options : options
		}, 
		input : cells, 
		output : ios 
	});
	// main = document.getElementsByTagName('main')[0];

	//comp :: [(* -> *)] -> (* -> *)
var 	comp  = R.apply(R.compose),
	//fst :: a -> * -> a
	fst  = R.compose(R.head, Array),
	//lst :: a -> * -> b -> b
	lst  = R.compose(R.last, Array),
	//wrap :: (* -> *) -> (* -> *) --wraps functions in composition thunk builder
	wrap = R.compose(comp, R.prepend(comp), R.append(R.of)),
	//then :: * -> (* -> *) --takes functions, and wraps them ready to be called
	then = R.compose(R.apply(wrap), R.map(R.prepend), R.reverse, Array),
	
	getHandler 	= R.compose(R.flip(R.prop), fst),
	callHandler = R.compose(R.flip(R.call), lst),
	bindHandler = R.converge(R.compose, [callHandler, getHandler]),

	bindCell = R.pipe(DataType, then( R.flip(R.map), wrap([R.append(bindHandler)]) )),
	category = R.curry(function(cell, event){

		var handlerNames = [],
			handlers = [];

		R.mapObjIndexed(function(eventNames, handlerName){
			var match = R.filter(R.equals(event.type), eventNames);

			if(match.length)
				handlerNames.push(handlerName);
		}, cell.type);

		if(handlerNames.length){
			handlers = R.map(R.flip(R.prop)(cell.maps), handlerNames);
		}

		var a1 = bindCell(handlers),
			a2 = a1(event);
		// var a1 = bindCell(cell.type),
		// 	a2 = a1(event.type);

		return a2(cell.maps, event);

		// return event;
	}),

	pipeSegment = R.pipe(category),
	// pipeSegment = R.pipe(category, then(R.head, lift)),
	buildPipeline = R.compose(R.apply(R.pipe), R.map(pipeSegment));

function DataType(handlers){

	return function(event){
		return handlers;
	}
}
// function DataType(cellType){

// 	return function(eventType){
// 		var handlers = [];

// 		R.mapObjIndexed(function(eventNames, handlerName){
// 			var match = R.filter(R.equals(eventType), eventNames);

// 			if(match.length)
// 				handlers.push(handlerName);

// 		}, cellType);

// 		return handlers;
// 	}
// }

function trace(a){
	console.log(a);
	return a;
}

function init(seed){
	R.map(trace, seed);

	const app = seed.focus(['L']).getCytos()[0],
		seedling = R.reduce(reducer, { input : [], output : [] }, seed),
		pipeline = buildPipeline(R.concat(seedling.input, seedling.output));
	
	// console.log( app );

	return bind(pipeline, app);
}

export default init(seed);

//reduce cyto structures
//to a list of input cells
//and output cells
function reducer(a, b){

	// const input = R.prop('input'),
	// 	output = R.prop('output'),
	// 	appendBranch = R.flip(R.invoker(1, 'push')),
	// 	pushBranch = {
	// 		input : R.compose(appendBranch, input),
	// 		output : R.compose(appendBranch, output)
	// 	},
	// 	//build a mutation push by invoking push on memo array
	// 	buildPush = R.converge(R.compose(R.apply(R.compose), Array), [R.compose(R.flip(R.call)(a), R.flip(R.call)(pushBranch)), R.identity]),
	// 	//builds a conditional that checks if either input/output is a Cell, than invokes push on "shadowed" method on pushBranch
	// 	pushCell = R.converge(R.ifElse, [R.compose(R.apply(R.compose), R.prepend(R.is(Cell)), R.of), buildPush, R.always(R.identity)]),
	// 	//final conditional that tests whether b is State, and then uses meta state to extract input/output cell; always return a
	// 	getCells = R.ifElse(R.is(State), R.compose(R.converge(R.always(a), [pushCell(input), pushCell(output)]), R.prop('meta')), R.always(a));

	// return getCells(b);

	if(b instanceof State){
		if(b.meta.input instanceof Cell){
			a.input = R.prepend(b.meta.input, a.input)
		}

		if(b.meta.output instanceof Cell){
			a.output = R.append(b.meta.output, a.output)
		}	
	}

	return a;
}



function bind(pipeline, app){

	const getElement = function(className){ 
			return document.getElementsByClassName(className)[0]; 
		},
		initEvents = function(compEvents, compName){
			const inputEvents = app.output.value[0].input.type,
				htmlElement = getElement(compName),
				
				// getEventList = R.compose(R.flatten, R.values),
				filterFields = R.filter(R.compose(R.not, R.equals('type'))),
				filterEvents = R.converge(R.compose(filterFields, R.intersection), [R.compose(R.flatten, R.values), lst]),

				handlError = R.compose(console.log, Error),
				isNotEmpty = R.converge(R.and, [R.compose(R.not, R.isNil), R.compose(R.not, R.isEmpty)]),

				bindEvent  = function(eventName){ 
					return B.fromEvent(htmlElement, eventName).onValue(pipeline) 
				},
				initialize = R.compose(R.ifElse(isNotEmpty, R.map(bindEvent), handlError), filterEvents);

			return initialize( inputEvents, compEvents );
		},
		//TODO: cleanup method of initializing dom elements with comp states
		initUI = R.compose(R.mapObjIndexed(initEvents), R.prop('maps'));
	//iterate through all ui elements, for each one get the mapping
	//which contains a map from the comp's css class to event names
	return R.map(initUI, app.state.ui);
}

function lift(value){
	console.log(value);
	return value;
}
