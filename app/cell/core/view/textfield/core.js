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
			type : {
				'textinput' : ['keyup', 'mouseup']
			},
			textinput : function(event){


				return {
					type : 'textinput',
					obj : event
				};
			}
		},
		output : {
			type : {
				'render' : ['render'],
			},
			render : function (state){
				return {
					type : 'html',
					state : state
				};
			}
		}
	};

var main = document.getElementsByTagName('main')[0];

main.innerHTML = template({});

export default textfield;