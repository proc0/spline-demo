'use strict';
import { Cyto, Cell } from '../../../../etc';
import template from './textfield.hbs';

var textfield = {
		state : {
			//auxiliary map for picking up which elements will bind to wich events
			maps : {
				textfield : ['keyup', 'mouseup'],
			},
			secret : 'blah'
		},
		input : new Cell({
			type : {
				'textinput' : ['keyup', 'mouseup']
			},
			maps :{
				textinput : function(event){

					console.log(event);
					return {
						type : 'textinput',
						obj : event
					};
				}
			}
		}),
		output : new Cell({
			type : {
				'render' : ['render'],
			},
			maps : {
				render : function (state){
					return {
						type : 'html',
						html : template({})
					};
				}
			}
		})
	},
	main = document.getElementsByTagName('main')[0];

main.innerHTML = main.HTML + template({});
export default new Cyto(textfield);