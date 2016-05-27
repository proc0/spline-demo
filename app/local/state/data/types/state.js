'use strict';
import { R } from '../../../../tool';

export default function State(seed){
	if(seed instanceof this)
		return true;
	//shallow assign,
	//TODO: smarter object inheritance from seed
	R.mapObjIndexed(function(value, label){
		this[label] = value;
	}.bind(this), seed);
}

// export default {
// 	points 	: [],
// 	selects : [],
// 	ui 		: {
// 		elements : [],
// 		view : {
// 			curve : [] 
// 		},
// 		state : {
// 			slider : {}
// 		}
// 	}
// };