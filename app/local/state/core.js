import { R, B } from '../tool';
import data from './data/core';
import model from './model/core';
import State from './data/types/state';

var state;
/**
 * @type state :: IO -> (WorldData -> (InputData -> State))
 */ 
export default function init(io){
	var currentState = state || new State(io),
		processInput = R.flip(data)(currentState),
		processState = R.flip(model)(currentState),
		nextState = R.compose(R.apply(R.compose), R.prepend(processState), R.of, processInput);

	return function(input){ 
		return state = nextState(input); 
	};
};