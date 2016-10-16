'use strict';

var props = {
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

export default props;