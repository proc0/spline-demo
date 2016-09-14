'use strict';
import { cyto } from '../../../../etc';
import template from './textfield.hbs';

var textfield = {
		state : {
			name : 'textfield',
			map : {
				keyup : ['keyup']
			},
			secret : 'blah'
		},
		input : {
			keyup : function(event){

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

var main = document.getElementsByTagName('main')[0];

main.innerHTML = template({});

export default textfield;