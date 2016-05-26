'use strict';
import { R, B } from '../../tool';
import data from './data/core';
import model from './model/core';
import State from './data/types/state';

var state = {};
/**
 * @type init :: WorldData -> (IO -> State)
 */ 
export default function init(world){
	var seed = { world : world };

	state = new State(seed);

	return meta;
};
/**
 * @type meta :: IO -> State
 */ 
function meta(io){
	if(!io) return state;

	var then = R.compose(R.apply(R.compose), R.prepend),
		reverseApply = R.compose(R.of, R.flip(R.apply), R.of),
		processInput = R.flip(data)(state),
		processState = R.flip(model)(state),
		nextState = R.compose(then(processState), reverseApply, processInput);

	return nextState(io);
}