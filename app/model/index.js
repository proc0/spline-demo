'use strict';

import { R } from '../util';

//type classes
export { default as point } from './point';
export { default as action } from './action';

//closures for state
var model = new Model();

function Model(attrs){
	this.context = {};
	this.options = {};
	this.points  = [];
	this.selects = [];
};

export default { 
	init : function(context, options){
		//assign closures
		model.context = context;
		model.options = options;
		return model;
	},
	state : function(action){
		switch(action.type){
			case 'NEW_POINT' :
				return points(action.data);
			case 'SELECT' :
				return selects(action.data);
			case 'DESELECT' :
				return model.selects = [];
			case 'EDIT' :
				return points(action.data, true);
			case 'OPTION' : 
				return options(action.data);
			case 'NOTHING' : 
				return null;
			default : 
				return model;
		}
	},
	getState : function(){
		return model;
	},
	getInstance : function(){
		return Model;
	}
};

function points(point, splice){

	if(splice)
		model.points.splice(model.selects[0], 1, point);
	else
		model.points.push(point);

	return model;
}

function selects(index){

	if(index > -1){
		model.selects.push(index);
		return model;
	} else {
		model.selects = [];
		return null;
	}
}

function options(option){
	var _name = option.name.split('.');

	if(_name.length > 1){
		var localName = _name.splice(1)[0],

			_options = getProp(_name[0], model.options);

		_options[localName] = option.value;

	} else if(_name.length){
		model.options[localName] = option.value;
	} else {
		return null;
	}

	return model;
}

function getProp(str, obj){
	// reduce a list of functions that return properties w/ obj
	return R.reduce(R.flip(R.call), obj, R.map(R.prop, str.split('.'))); 
}
