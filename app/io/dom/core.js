'use strict';
import { R, cyto } from '../../etc';

var transfer = R.converge(R.compose(R.call(R.fromPairs), R.zip), [R.compose(R.last, Array), R.flip(R.props)]);

var input = {
		handler : function(event){
			
			return transfer(event, ['key', 'keyCode']);
		},
		mouseHandler : function(event){
			return transfer(event, ['x', 'y']);
		}
	},
	output = {
		canvas : function(comp){

		},

		dom : function(comp){

			return comp();
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