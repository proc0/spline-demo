'use strict';

import { R } from '../util';

//closure
var state;

function State(attrs){
	this.context = attrs.context || {};
	this.options = attrs.options || {};
	this.points  = [];
	this.selects = [];
	this.ui = {
		elements : [],
		view : { curve : [] },
		state : {
			slider : {}
		}
	};
};

export default { 
	init : function(initState){
		return state = new State(initState);
	},
	state : function(action){
		switch(action.type){
			case 'NEW_POINT' :
				return points(action.data);
			case 'SELECT' :
				return selects(action.data);
			case 'DESELECT' :
				return state.selects = [];
			case 'EDIT' :
				return points(action.data, true);
			case 'OPTION' : 
				return options(action.data);
			case 'NOTHING' : 
				return null;
			default : 
				return state;
		}
	},
	getState : function(){
		return state;
	},
	getInstance : function(){
		return State;
	}
};

function points(point, splice){

	if(splice)
		state.points.splice(state.selects[0], 1, point);
	else
		state.points.push(point);

	return state;
}

function selects(index){

	if(index > -1){
		state.selects.push(index);
		return state;
	} else {
		state.selects = [];
		return null;
	}
}

function options(option){
	var _name = option.name.split('.');

	if(_name.length > 1){
		var localName = _name.splice(1)[0],

			_options = getProp(_name[0], state.options);

		_options[localName] = option.value;

	} else if(_name.length){
		state.options[localName] = option.value;
	} else {
		return null;
	}

	return state;
}

function getProp(str, obj){
	// reduce a list of functions that return properties w/ obj
	return R.reduce(R.flip(R.call), obj, R.map(R.prop, str.split('.'))); 
}
