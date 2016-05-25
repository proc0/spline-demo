'use strict';
import { R, getProp } from '../../../../tool';

export default {
	eventMap : {
		selects : ['SELECT', 'DESELECT'],
		points 	: ['NEW_POINT', 'EDIT'],
		slider 	: ['BLUR_SLIDER', 'FOCUS_SLIDER'],
		options : ['OPTION']
	},

	points : function(action, state){

		var splice = action.data.splice,
			point = action.data.point;

		if(splice){
			state.points.splice(state.selects[0], 1, point);
		}
		else{
			state.points.push(point);
		}
		return state;

	},

	selects : function(action, state){
		var index = action.data.index;

		if(index && index > -1){
			state.selects.push(index);
		} else {
			state.selects = [];
		}

		return state;
	},

	options : function(action, state){
		var option = action.data,
			_name = option.name.split('.');

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
	},

	slider : function(action, state){
		state.ui.state.slider = action.data;

		return state;
	}
};