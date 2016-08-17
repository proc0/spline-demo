'use strict';
import { R, B, cyto } from '../../tool';
import types from './data/types';

// var state = {},
// 	then = R.compose(R.apply(R.compose), R.prepend),
// 	reverseApply = R.compose(R.of, R.flip(R.apply), R.of);
// /**
//  * State Monad
//  * @type init :: {Object} -> (IO -> {State})
//  */ 
// export default function init(seed){
// 	seed.meta = State;
// 	state = new State(seed);
// 	return meta;
// };
// /**
//  * @type meta :: IO -> State
//  */ 
// function meta(io){

// 	if(!io) return state;

// 	var processInput = R.flip(data)(state),
// 		processState = R.flip(model)(state),
// 		getNextState = R.compose(then(processState), reverseApply, processInput);

// 	return getNextState(io);
// }

export default function init(seed){
	var state = seed.init;
}

