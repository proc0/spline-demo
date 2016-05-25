'use strict';
import { R, B } from '../../tool';
import data from './data/core';
import model from './model/core';
import State from './data/types/state';

var state = {};
/**
 * @type state :: IO -> (WorldData -> (InputData -> State))
 */ 
export default function init(world){
	var seed = { world : world },
		then = R.compose(R.apply(R.compose), R.prepend),
		reverseApply = R.compose(R.of, R.flip(R.apply), R.of);
		
	state = new State(seed);

	return function state(io){
		if(!io) return state;

		var processInput = R.flip(data)(state),
			processState = R.flip(model)(state),
			nextState = R.compose(then(processState), reverseApply, processInput);

		return nextState(io);
	};
};