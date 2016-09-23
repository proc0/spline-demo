'use strict';
import { cyto } from '../../../../etc';
import template from './textfield.hbs';

var textfield = {
		state : {
			//auxiliary map for picking up which elements will bind to wich events
			map : {
				textfield : ['keyup', 'mouseup'],
			},
			secret : 'blah'
		},
		input : {
			textinput : function(event){

				return {
					type : 'textinput',
					value : event.target.value
				};
			}
		},
		output : {
			render : function (state){

				return {
					type : 'dom',
					render : function render(context){

					}
				};
			}
		}
	};

var main = document.getElementsByTagName('main')[0];

main.innerHTML = template({});

export default textfield;