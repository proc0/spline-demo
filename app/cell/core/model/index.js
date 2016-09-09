'use strict';

var props = {
		firstname : function(state){

			return function(action){

				return state;
			}
		},

		lastname : function (state){

			return function(action){

				return state;
			}
		}
	};

export default props;