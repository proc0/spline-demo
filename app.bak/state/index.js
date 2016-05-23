'use strict';

import { R } from '../util';
import model from '../model';
import Model from './data/model';
import Point from './data/point';
import Action from './data/action';

function State(attrs){
	//shallow assign,
	//TODO: smarter object inheritance from seed
	R.mapObjIndexed(function(value, label){
		this[label] = value;
	}.bind(this), attrs);
}

export default {
	state : {},
	State : State,
	data  : {
		state 	: State,
		model 	: Model,
		point 	: Point,
		action 	: Action
	},
	init : function(seed){
		var state = { data : this.data },
			attrs = R.merge(R.merge(Model, state), seed);
		//avoids the need to import into view
		state.data.meta = this;

		return this.state = new State(attrs);
	},
	get : function(){
		return this.state;
	},
	set : function(action){
		//for now state is modified in model
		return model(action, this.state);
	}
};

