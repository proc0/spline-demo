'use strict';
import { R, B, cyto } from './etc';
import cells from './cell';
import ios from './io';
import options from '../options';

var app = { 
		state : {
			options : options
		}, 
		input : cells, 
		output : ios 
	},
	// IOEventData = {
	// 	'handler' : ['keyup'],
	// 	'mouseHandler' : ['mouseup']
	// },
	EventData = {
		'textinput' : ['textinput'],
		'mouseup' : ['increment']
	},
	ActionData = {
		'textinput' : ['name'],
		'increment' : ['testnum']
	},
	StateData = {
		'name' : ['render'],
		'testnum' : ['render']
	},
	ContextData = {
		'render' : ['dom']
	};


/**
 * @name Core
 * @type core :: IO()
 */
export default cyto(app)(init);

function init(app){
	var inputs = app.input,
		IOEventData = inputs[0].type,
		outputs = app.outputs,
		state = app.state,
		ui = state.ui,

		fst = R.compose(R.head, Array),
		snd = R.compose(R.last, Array),
		toComp = R.apply(R.compose),
		comply = R.compose(toComp, R.prepend(toComp), R.append(R.of), Array),
		
		getHandler 	= R.compose(R.flip(R.prop), fst),
		callHandler = R.compose(R.flip(R.call), snd),
		bindHandler = R.converge(R.compose, [callHandler, getHandler]),
		handler 	= comply(R.append(bindHandler)),

		bindType = comply(R.prepend(handler), R.prepend(R.flip(R.map))),

		category = R.curry(function(arrows, data){
			var typeMap = DataType(arrows.type),
				buildType = bindType(typeMap),
				getFunctors = buildType(data.type);
			return getFunctors(arrows, data);
		}),

		//bind an element to a Bacon Events
		bindElement = function (event){

			var eventObj = category(inputs[0], event);

			console.log(eventObj[0]);
		},
		getElement = function(className){ 
			return document.getElementsByClassName(className)[0]; 
		},
		initEvents = function(eventList, compName){
			var element = getElement(compName),
				bindEvent = function(eventName){
					B.fromEvent(element, eventName).onValue(bindElement);
				},

				ignoreTypesField = R.filter(R.compose(R.not, R.equals('type'))),
				getIOEventList = R.compose(R.flatten, R.values),
				crossCheckIOEvents = R.converge(R.compose(ignoreTypesField, R.intersection), [getIOEventList, snd]),

				oopsies = R.compose(console.log, Error),
				isNotEmpty = R.converge(R.and, [R.compose(R.not, R.isNil), R.compose(R.not, R.isEmpty)]),
				init = R.compose(R.ifElse(isNotEmpty, R.map(bindEvent), oopsies), crossCheckIOEvents);

			return init(IOEventData, eventList);
		},
		initComps = R.compose(R.mapObjIndexed(initEvents), R.prop('map'));

	//iterate through all ui elements, for each one get the mapping
	//which contains a map from the comp's css class to event names
	return R.map(initComps, ui);
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