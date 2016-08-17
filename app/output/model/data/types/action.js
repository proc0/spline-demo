'use strict';
import { R } from '../../../../tool';

//shortcut instantiation
export default R.curry(function(type, data){
	return new Action(type, data);
});

function Action(type, data){
	return { 
		type : type, 
		data : data 
	};
}