import { R, B } from '../tool';
import data from './data/core';
import model from './model/core';

function State(seed){
	//shallow assign,
	//TODO: smarter object inheritance from seed
	R.mapObjIndexed(function(value, label){
		this[label] = value;
	}.bind(this), seed);
}

/**
 * @type state :: Data -> State
 */ 
export default function state(world){
	var currentState = world.state || new State(world),
		nextState = R.compose(R.flip(model)(currentState), data);
		
	return world.state = nextState(world);
};


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