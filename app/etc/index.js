'use strict';

import R from '../../node_modules/ramda/dist/ramda';

// var isCyto = function(obj){
// 	return obj.hasOwnProperty('state') && obj.hasOwnProperty('input') && obj.hasOwnProperty('output');
// }

var meta = {
		state : {},
		input : [],
		output: []
	};

export var cyto = function cyto(seed){
	//merge all incoming states
	meta.state = R.merge(meta.state, seed.state || {});
	//last call will be root
	return function _cyto(init){

		var input = seed.input,
			output = seed.output;
		
		if(input instanceof Array && input.length > 0){
			R.map(R.compose(R.flip(R.call)({}), cyto), input);
		} else {
			meta.input.push(input);
		}

		if(output instanceof Array && output.length > 0){
			R.map(R.compose(R.flip(R.call)({}), cyto), output);
		} else {
			meta.output.push(output);
		}

		//pass the state back up to leaves
		//get input and output functions
		// var input = seed.input(meta.state),
		// 	output = seed.output(meta.state);

		// if(typeof input === 'function')
		// 	meta.input.push(input);

		// if(typeof output === 'function')
		// 	meta.output.push(output);

		// if(input instanceof Array)
		// 	meta.input = R.concat(meta.input, input);

		// if(output instanceof Array)
		// 	meta.input = R.concat(meta.output, output);

		//only root cell will return input and output as Cyto
		if(typeof init === 'function'){
			return init({
					state : meta.state,
					input : R.reverse(meta.input),
					output : meta.output
				});
		} else {
			return meta;
		}

	}
};

export { default as R } from '../../node_modules/ramda/dist/ramda';
export { default as B } from '../../node_modules/baconjs/dist/Bacon';
