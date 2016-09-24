'use strict';
import { R, cyto } from '../../etc';

var transfer = R.converge(R.compose(R.call(R.fromPairs), R.zip), [R.compose(R.last, Array), R.flip(R.props)]);

var input = {
		type : {
			'handler' : ['keyup'],
			'mouseHandler' : ['mouseup']
		},
		handler : function(event){
			
			var eventObject = transfer(event, ['type', 'key', 'keyCode']);

			return eventObject;
		},
		mouseHandler : function(event){
			return transfer(event, ['type', 'x', 'y']);
		}
	},
	output = {
		type : {
			'dom' : ['html']
		},

		canvas : function(context){

		},

		dom : function(context){

			return context;
		}
	},
	dom = {
		state : {
			dom : document
		},
		input : input,
		output : output
	};


export default dom;