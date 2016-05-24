'use strict';
import { R, B } from '../../tool';
import * as events from './ui';

//initialize events
// export default function initEvents(state){

// 	var combine = R.compose(R.map(R.apply(R.call)), R.zip),
// 		extract = R.compose(R.apply(R.compose), R.prepend(R.values), R.of, R.mapObjIndexed), 
// 		//bind an array of elements to Bacon events
// 		bindElements = R.curry(function(handlers, elements){
// 			//use bindElement to bind to HTMLElement, bind to state Controller (not runtime)
// 			return R.map(R.curry(bindElement)(handlers).bind(state.data.meta), elements);
// 		}),
// 		bindEvents = extract(R.compose(bindElements, R.identity)),
// 		//bind all action creators to events
// 		initialize = R.converge(combine, [bindEvents, R.always(state.ui.elements)]);

// 	initialize(events);

// 	//initialize UI controllers
// 	//TODO: propagate and properly abstract
// 	//init function to all event handlers
// 	events.slider.init(state);

// 	return state;
// }


var eventTypes = {
	eventMap : {
		parseEvent : ['mousedown', 'mouseup', 'mousemove']
	},

	parseEvent : function(event, state){

		return {
			mouse : getMouse(state.context, event),
			index : state.points.length ? findPoint(mouse)(state.points) : state.points
		};
	}
};

/**
 * @type :: data :: IO -> State -> Data
 */
export default function init(inputData){

	var modelData,
		getHandler = R.compose(R.flip(R.gt)(0), R.length, R.filter(R.equals(inputData.input.type)));

	if(state)
		R.mapObjIndexed(function(dataList, handlerName){
			//if model has handler
			//get data handler
			if( getHandler(dataList) ){
				try { 
					// console.log(data.type); 
					modelData = eventTypes[handlerName](inputData);
				} catch(err){ 
					console.log(err) 
				}
			}
		}, events);

	return modelData;
}