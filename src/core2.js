'use strict';
import { B, Cyto, Cell, Colony, State } from './etc';
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
let comp = apply(compose),
	//fst :: a -> * -> a
	fst  = compose(head, Array),
	//lst :: a -> * -> b -> b
	lst  = compose(last, Array),
	//wrap :: (* -> *) -> (* -> *) --wraps functions in composition thunk builder
	wrap = compose(comp, prepend(comp), append(of)),
	//then :: * -> (* -> *) --takes functions, and wraps them ready to be called
	then = compose(apply(wrap), map(prepend), reverse, Array),
	
	getHandler 	= compose(flip(prop), fst),
	callHandler = compose(flip(call), lst),
	bindHandler = converge(compose, [callHandler, getHandler]),

	bindCell = pipe(DataType, then( flip(map), wrap([append(bindHandler)]) )),
	category = curry(function(cell, event){

		let handlerNames = [],
			handlers = [];

		mapObjIndexed(function(eventNames, handlerName){
			let match = filter(equals(event.type), eventNames);

			if(match.length)
				handlerNames.push(handlerName);
		}, cell.type);

		if(handlerNames.length){
			handlers = map(flip(prop)(cell.maps), handlerNames);
		}

		let a1 = bindCell(handlers),
			a2 = a1(event);
		// let a1 = bindCell(cell.type),
		// 	a2 = a1(event.type);

		return a2(cell.maps, event);

		// return event;
	}),

	pipeSegment = pipe(category),
	// pipeSegment = pipe(category, then(head, lift)),
	buildPipeline = compose(apply(pipe), map(pipeSegment));

function DataType(handlers){

	return function(event){
		return handlers;
	}
}
// function DataType(cellType){

// 	return function(eventType){
// 		let handlers = [];

// 		mapObjIndexed(function(eventNames, handlerName){
// 			let match = filter(equals(eventType), eventNames);

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
	map(trace, seed);

	const app = seed.focus(['L']).getCytos()[0],
		seedling = reduce(reducer, { input : [], output : [] }, seed),
		pipeline = buildPipeline(concat(seedling.input, seedling.output));
	
	// console.log( app );

	return bind(pipeline, app);
}

export default init(seed);

//reduce cyto structures
//to a list of input cells
//and output cells
function reducer(a, b){

	// const input = prop('input'),
	// 	output = prop('output'),
	// 	appendBranch = flip(invoker(1, 'push')),
	// 	pushBranch = {
	// 		input : compose(appendBranch, input),
	// 		output : compose(appendBranch, output)
	// 	},
	// 	//build a mutation push by invoking push on memo array
	// 	buildPush = converge(compose(apply(compose), Array), [compose(flip(call)(a), flip(call)(pushBranch)), identity]),
	// 	//builds a conditional that checks if either input/output is a Cell, than invokes push on "shadowed" method on pushBranch
	// 	pushCell = converge(ifElse, [compose(apply(compose), prepend(is(Cell)), of), buildPush, always(identity)]),
	// 	//final conditional that tests whether b is State, and then uses meta state to extract input/output cell; always return a
	// 	getCells = ifElse(is(State), compose(converge(always(a), [pushCell(input), pushCell(output)]), prop('meta')), always(a));

	// return getCells(b);

	if(b instanceof State){
		if(b.meta.input instanceof Cell){
			a.input = prepend(b.meta.input, a.input)
		}

		if(b.meta.output instanceof Cell){
			a.output = append(b.meta.output, a.output)
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
				
				// getEventList = compose(flatten, values),
				filterFields = filter(compose(not, equals('type'))),
				filterEvents = converge(compose(filterFields, intersection), [compose(flatten, values), lst]),

				handlError = compose(console.log, Error),
				isNotEmpty = converge(and, [compose(not, isNil), compose(not, isEmpty)]),

				bindEvent  = function(eventName){ 
					return B.fromEvent(htmlElement, eventName).onValue(pipeline) 
				},
				initialize = compose(ifElse(isNotEmpty, map(bindEvent), handlError), filterEvents);

			return initialize( inputEvents, compEvents );
		},
		//TODO: cleanup method of initializing dom elements with comp states
		initUI = compose(mapObjIndexed(initEvents), prop('maps'));
	//iterate through all ui elements, for each one get the mapping
	//which contains a map from the comp's css class to event names
	return map(initUI, app.state.ui);
}

function lift(value){
	console.log(value);
	return value;
}
