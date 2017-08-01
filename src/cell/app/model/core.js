'use strict';
import { Cell, DATA } from '../../../etc';

export default new Cell({
	meta : {
		input : DATA.STATE,
		output : DATA.STATE
	},
	type : {
		'firstname' : ['textinput'],
		'lastname' : ['textinput']
	},
	proc : {
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
})
