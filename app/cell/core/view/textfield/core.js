'use strict';
import { cyto } from '../../../../etc';
import template from './textfield.hbs';

var textfield = {
		state : {
			textfield : {
				secret : 'blah'
			}
		},
		input : {
			firstname : function(event){

				return event.target.value;
			}
		},
		output : {
			dom : function (state){

				return function render(context){

				}	
			}
		}
	};

export default textfield;