'use strict';
import { R } from '../util';

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