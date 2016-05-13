'use strict';
//shortcut instantiation
export default function(type, data){
	return new Action(type, data);
}

function Action(type, data){
	return { 
		type : type, 
		data : data 
	};
}