import {
	R,
	getMouse, 
	findPoint 
} from '../../../tool';
import * as types from './types';


// var eventTypes = {
// 	eventMap : {
// 		parseEvent : ['mousedown', 'mouseup', 'mousemove']
// 	},

// 	parseEvent : function(event, state){

// 		return {
// 			mouse : getMouse(state.context, event),
// 			index : state.points.length ? findPoint(mouse)(state.points) : state.points
// 		};
// 	}
// };

// /**
//  * @type :: data :: World -> Data
//  */
// export default function data(event, state){

// 	var inputData,
// 		getHandler = R.compose(R.flip(R.gt)(0), R.length, R.filter(R.equals(event.type)));

// 	if(state)
// 		R.mapObjIndexed(function(dataList, handlerName){
// 			//if model has handler
// 			//get data handler
// 			if( getHandler(dataList) ){
// 				try { 
// 					// console.log(data.type); 
// 					inputData = eventTypes[handlerName](event, state);
// 				} catch(err){ 
// 					console.log(err) 
// 				}
// 			}
// 		}, eventTypes.eventMap);

// 	return inputData;
// }
