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
	}),
	main = document.getElementsByTagName('main')[0];

var 	cmp  = R.apply(R.compose),
	fst  = R.compose(R.head, Array),
	snd  = R.compose(R.last, Array),
	wrap = R.compose(cmp, R.prepend(cmp), R.append(R.of), Array),
	then = R.compose(R.apply(wrap), R.map(R.prepend), R.reverse, Array),
	
	getHandler 	= R.compose(R.flip(R.prop), fst),
	callHandler = R.compose(R.flip(R.call), snd),
	bindHandler = R.converge(R.compose, [callHandler, getHandler]),
	bindArrows	= R.pipe(DataType, then(R.flip(R.map), wrap(R.append(bindHandler)))),
	category = R.curry(function(arrows, data){ 
		return bindArrows(arrows.type)(data.type)(arrows, data);
	}),

	pipeSegment = R.pipe(category, then(R.head, lift)),
	buildPipeline = R.compose(R.apply(R.pipe), R.map(pipeSegment));

function trace(a){
	console.log(a);
	return a;
}

function init(seed){
	R.map(trace, seed);

	const view = seed.focus(['L']).getCytos()[0],
		seedling = R.reduce(reducer, { input : [], output : [] }, seed),
		app = buildPipeline(R.flatten(R.append(R.reverse(seedling.input), seedling.output)));
	
	// console.log( app );

	return bind(app, view);
}

export default init(seed);

//reduce cyto structures
//to a list of input cells
//and output cells
function reducer(a, b){

	const input = R.prop('input'),
		output = R.prop('output'),
		appendBranch = R.flip(R.invoker(1, 'push')),
		pushBranch = {
			input : R.compose(appendBranch, input),
			output : R.compose(appendBranch, output)
		},
		//build a mutation push by invoking push on memo array
		buildPush = R.converge(R.compose(R.apply(R.compose), Array), [R.compose(R.flip(R.call)(a), R.flip(R.call)(pushBranch)), R.identity]),
		//builds a conditional that checks if either input/output is a Cell, than invokes push on "shadowed" method on pushBranch
		pushCell = R.converge(R.ifElse, [R.compose(R.apply(R.compose), R.prepend(R.is(Cell)), R.of), buildPush, R.always(R.identity)]),
		//final conditional that tests whether b is State, and then uses meta state to extract input/output cell; always return a
		getCells = R.ifElse(R.is(State), R.compose(R.converge(R.always(a), [pushCell(input), pushCell(output)]), R.prop('meta')), R.always(a));

	return getCells(b);
}



function bind(app, view){

	const getElement = function(className){ 
			return document.getElementsByClassName(className)[0]; 
		},
		initEvents = function(compEvents, compName){
			const inputEvents = view.input.type,
				htmlElement = getElement(compName),
				
				// getEventList = R.compose(R.flatten, R.values),
				filterFields = R.filter(R.compose(R.not, R.equals('type'))),
				filterEvents = R.converge(R.compose(filterFields, R.intersection), [R.values, snd]),

				handlError = R.compose(console.log, Error),
				isNotEmpty = R.converge(R.and, [R.compose(R.not, R.isNil), R.compose(R.not, R.isEmpty)]),

				bindEvent  = function(eventName){ 
					return B.fromEvent(htmlElement, eventName).onValue(app) 
				},
				initialize = R.compose(R.ifElse(isNotEmpty, R.map(bindEvent), handlError), filterEvents);

			return initialize( inputEvents, compEvents );
		},
		//TODO: cleanup method of initializing dom elements with comp states
		initUI = R.compose(R.mapObjIndexed(initEvents), R.prop('maps'));
	//iterate through all ui elements, for each one get the mapping
	//which contains a map from the comp's css class to event names
	return R.map(initUI, view.state.ui);
}

function lift(value){
	console.log(value);
	return value;
}

function DataType(data){

	return function(type){
		var handlers = [];

		R.mapObjIndexed(function(eventNames, handlerName){
			var match = R.filter(R.equals(type), eventNames);

			if(match.length)
				handlers.push(handlerName);

		}, data);

		return handlers;
	}
}