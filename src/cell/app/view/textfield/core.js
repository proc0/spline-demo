'use strict';
import { Cyto, Cell, DATA } from '../../../../etc';
import template from './textfield.hbs';

export default new Cyto({
	state : {
		name : 'textfield'
	},
	input : new Cell({
		meta : {
			input : DATA.UI_EVENT,
			output: DATA.STATE
		},
		type : {
			'textfield' : ['keyup', 'mouseup']
		},
		proc :{
			textfield : function(event){

				console.log(event);
				return {
					type : 'textfield',
					obj : event
				};
			}
		}
	}),
	output : new Cell({
		meta : {
			input : DATA.STATE,
			output: DATA.OUTPUT
		},
		type : {
			//handler : ['type1', 'type2']
			'render' : ['render'],
		},
		proc : {
			init : function(){
				return {
					type : 'html',
					html : template({})
				};
			},
			render : function (state){
				return {
					type : 'html',
					html : template({})
				};
			}
		}
	})
})
