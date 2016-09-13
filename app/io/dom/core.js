'use strict';
import { R, cyto } from '../../etc';

var input = {
		keyup : function(event){

			return event;
		}
	},
	output = {
		canvas : function(state){

			return function(comp){

			}
		},

		dom : function(state){
			
			return function(comp){

				return comp();
			}
		}
	},
	dom = {
		state : {
			document,
			events : R.keys(input)
		},
		input : input,
		output : output
	};

export default dom;