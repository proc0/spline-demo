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

				return function(event){
					return event;
				};
			}
		},
		output : {
			textfield : function (state){

				return function(context){

				}
			}
		}
	};

export cyto(textfield);