import { R, B } from '../tool';
import data from './data/core';
import model from './model/core';
import Action from './data/types/action';
import State from './data/types/state';

var state;
/**
 * @type state :: IO -> (WorldData -> (InputData -> State))
 */ 
export default function state(world){
	var currentState = state || new State(world),
		isAction = function(a){ return a instanceof Action; },
		nextState = R.compose(R.ifElse(isAction, R.flip(model)(currentState), R.identity), R.flip(data)(currentState))(world);
	
	if(nextState instanceof State)
		return world.state = nextState;
	else
		return nextState;
};

// export default function (world){
// 	return {
// 		state : world.state || new state(world),
// 		data : data,
// 		model : model
// 	}
// }

// export default {
// 	state : {},
// 	State : State,
// 	data  : {
// 		state 	: State,
// 		model 	: Model,
// 		point 	: Point,
// 		action 	: Action
// 	},
// 	init : function(seed){
// 		var state = { data : this.data },
// 			attrs = R.merge(R.merge(Model, state), seed);
// 		//avoids the need to import into view
// 		state.data.meta = this;

// 		return this.state = new State(attrs);
// 	},
// 	get : function(){
// 		return this.state;
// 	},
// 	set : function(action){
// 		//for now state is modified in model
// 		return model(action, this.state);
// 	}
// };