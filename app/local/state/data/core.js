'use strict';
import {
	R,
	getMouse, 
	findPoint 
} from '../../../tool';
import * as data from './types';

var eventTypes = {
	eventMap : {
		parseEvent : ['mousedown', 'mouseup', 'mousemove']
	},

	parseEvent : function(worldData){
		var event = worldData.input,
			state = worlData.state;

		return {
			input : {
				type : event.type,
				mouse : getMouse(state.context, event),
				index : state.points.length ? findPoint(mouse)(state.points) : state.points
			},
			output : data.action
		};
	}
};

/**
 * @type :: data :: IO -> State -> Data
 */
export default R.curry(function init(event, state){

	if(event){
		var inputData,
			worldData = {
				input : event,
				state : state
			},
			getHandler = R.compose(R.flip(R.gt)(0), R.length, R.filter(R.equals(event.type)));
		
		R.mapObjIndexed(function(dataList, handlerName){
			//if model has handler
			//get data handler
			if( getHandler(dataList) ){
				try { 
					// console.log(data.type); 
					inputData = eventTypes[handlerName](worldData);
				} catch(err){ 
					console.log(err) 
				}
			}
		}, eventTypes.eventMap);

		return inputData;
	} else {
		return state;
	}
});