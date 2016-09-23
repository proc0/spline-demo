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
	IOEventData = {
		'handler' : ['keyup'],
		'mouseHandler' : ['mouseup']
	},
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
		// comps = inputs[1],
		outputs = app.outputs,
		state = app.state,
		events = state.events,
		ui = state.ui;

	var getElement = function(className){ 
			return document.getElementsByClassName(className)[0]; 
		},

		fst = R.compose(R.head, Array),
		snd = R.compose(R.last, Array),
		toComp = R.apply(R.compose),
		comply = R.compose(toComp, R.prepend(toComp), R.append(R.of), Array),
		
		getHandler 	= R.compose(R.flip(R.prop), fst),
		callHandler = R.compose(R.flip(R.call), snd),
		bindHandler = R.converge(R.compose, [callHandler, getHandler]),
		handler 	= comply(R.append(bindHandler)),

		bindType = comply(R.prepend(handler), R.prepend(R.flip(R.map))),
		//bind an element to a Bacon Events
		bindElement = function (event){

			var IOEvent = DataType(IOEventData),
				IO = bindType(IOEvent)(event.type),
				eventObj = IO(inputs[0], event);

			console.log(eventObj);
		},

		initEvents = function(eventList, compName){
			var element = getElement(compName),
				crossCheckEvents = R.compose(R.flip(R.intersection)(eventList), R.flatten, R.values),
				isNotEmpty = R.converge(R.and, [R.compose(R.not, R.isNil), R.compose(R.not, R.isEmpty)]),
				bindEvent = function(eventName){
					B.fromEvent(element, eventName).onValue(bindElement);
				},
				init = R.ifElse(isNotEmpty, R.map(bindEvent), console.log);

			return R.compose(init, crossCheckEvents)(IOEventData);

		};
	//iterate through all ui elements, for each one get the mapping
	//which contains a map from the comp's css class to event names
	R.map(R.compose(R.mapObjIndexed(initEvents), R.prop('map')), ui);
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