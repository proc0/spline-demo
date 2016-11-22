'use strict';
import { Cell } from '../../../etc';

const props = {
		type : {
			'firstname' : ['textinput'],
			'lastname' : ['textinput']
		},
		maps : {
			firstname : function(action){	
				return {
					type : 'render'
				};
			},

			lastname : function (action){
				
				return {
					type : 'render'
				};
			}
		}
	};

export default new Cell(props);