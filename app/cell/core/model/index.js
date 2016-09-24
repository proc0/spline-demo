'use strict';

var state = {
	type : ''
};
var props = {
		type : {
			'firstname' : ['textinput'],
			'lastname' : ['textinput']
		},
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
	};

export default props;