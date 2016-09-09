'use strict';
import { cyto } from '../../../../etc';

var textfield = {
		state : {
			textfield : {
				active : true
			}
		},
		input : {
			mouseup : function(state){

				return function onMouseUp(event){
					return event;
				};
			}
		},
		output : {
			dom : function (state){

				return function render(context){

				}
			}
		}
	};

export default cyto(textfield);