'use strict';
import { R, cyto } from '../../etc';

var copyFrom = R.converge(R.compose(R.call(R.fromPairs), R.zip), [R.compose(R.last, Array), R.flip(R.props)]);

var input = {
		type : {
			'handler' : ['keyup'],
			'mouseHandler' : ['mouseup']
		},
		handler : function(event){
			
			var eventObject = copyFrom(event, ['type', 'key', 'keyCode']);

			return eventObject;
		},
		mouseHandler : function(event){
			return copyFrom(event, ['type', 'x', 'y']);
		}
	},
	output = {
		type : {
			'dom' : ['html']
		},

		canvas : function(context){

		},

		dom : function(html){

			var main = document.getElementsByTagName('main')[0];

			main.innerHTML = html;
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