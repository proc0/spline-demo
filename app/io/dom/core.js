'use strict';
import { cyto } from '../../etc';

var dom = {
		state : document,
		input : {
			event : function(state){

				return function(event){

					return event;
				}
			}
		},
		output : {
			canvas : function(state){

				return function(comp){

				}
			},

			dom : function(state){
				
				return function(comp){

				}
			}
		}
	};

export default cyto(dom);