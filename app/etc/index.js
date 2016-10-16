'use strict';

import R from '../../node_modules/ramda/dist/ramda';

export function Cell(cell){
	if(!cell || !cell.type || !cell.maps)
		throw Error('Bad Cell formation');

	this.type = cell.type;
	this.maps = cell.maps
};

Cell.prototype.map = function(transform){
	return new Cell(transform(this));
}

Cell.prototype.reduce = function(transform, monoid){
	return transform(monoid, this);
}

function State(obj){
	var s = this;
	R.mapObjIndexed(function(val, key, obj){
		s[key] = val;
	}, obj);
}

function Branch(cytos){
	this.value = cytos;
}

function Leaf(cells){
	this.value = cells;
}

function Node(nodes){
	if(nodes instanceof Array == false || !nodes.length)
		throw Error('Bad Node formation.');

	return nodes[0] instanceof Cyto ? new Branch(nodes) 
			: nodes[0] instanceof Cell ? new Leaf(nodes)
			: Error('Bad Node formation');
}

Node.prototype.reduce = function(transform, monoid){
	return R.reduce(R.reduce(transform), monoid, this.value);
};

Node.prototype.map = function(transform, monoid){
	return R.map(R.map(transform), this.value);
};

Leaf.prototype = Branch.prototype = Node.prototype;

export function Cyto(seed){
	if(!seed.input || !seed.output || !seed.state)
		throw Error('Bad Cyto formation');
	
	this.state = new State(seed.state);
	this.input = seed.input.length ? Node(seed.input) : seed.input;
	this.output = seed.output.length ? Node(seed.output) : seed.output;
};

Cyto.prototype.map = function(transform){
	
	return new Cyto({
		input : R.map(transform, this.input),
		output : R.map(transform, this.output),
		state : transform(this.state)
	});

}

Cyto.prototype.reduce = function(transform, monoid){
	return R.reduce(transform, R.reduce(transform, transform(monoid, this.state), this.input), this.output);
}

Cyto.prototype.concat = function(f){

}

Cyto.prototype.empty = function(f){

}


Cyto.prototype.ap = function(f){

}

Cyto.prototype.of = function(f){

}


Cyto.prototype.traverse = function(f){

}

Cyto.prototype.chain = function(f){

}

Cyto.prototype.equals = function(node){


}

export function cyto(seed){

	// R.map(trace, seed);
	console.log( R.reduce(redx, "", seed) );

	console.log( R.reduce(redx2, [], seed) );

	return function _cyto(init){

	}

}

	
var meta = {
	state : {},
	input : [],
	output : []
};

function redx(a, b){
	var str;

	if(b instanceof Cyto){
		str = a + "\nCell";
	}
	
	if(b instanceof Cell){
		str = a + "\nCell";
	}

	if(b instanceof State){
		str = a + "\nState";
	}

	return str;
}

function redx2(a, b){
	if(b instanceof State === false){
		a.push(b);
	}
	return a;
}

function trace(a){
	console.log(a);

	return a;
}
// export var cyto = function cyto(seed){
// 	//merge all incoming states
// 	meta.state = R.merge(meta.state, seed.state || {});
// 	//last call will be root
// 	return function _cyto(init){

// 		var input = seed.input,
// 			output = seed.output;
		
// 		if(input instanceof Array && input.length > 0){
// 			R.map(R.compose(R.flip(R.call)({}), cyto), input);
// 		} else if(input){
// 			meta.input.push(input);
// 		}

// 		if(output instanceof Array && output.length > 0){
// 			R.map(R.compose(R.flip(R.call)({}), cyto), output);
// 		} else if(output){
// 			meta.output.push(output);
// 		}

// 		//pass the state back up to leaves
// 		//get input and output functions
// 		// var input = seed.input(meta.state),
// 		// 	output = seed.output(meta.state);

// 		// if(typeof input === 'function')
// 		// 	meta.input.push(input);

// 		// if(typeof output === 'function')
// 		// 	meta.output.push(output);

// 		// if(input instanceof Array)
// 		// 	meta.input = R.concat(meta.input, input);

// 		// if(output instanceof Array)
// 		// 	meta.input = R.concat(meta.output, output);

// 		//only root cell will return input and output as Cyto
// 		if(typeof init === 'function'){
// 			return init({
// 					state : meta.state,
// 					input : R.reverse(meta.input),
// 					output : meta.output
// 				});
// 		} else {
// 			return meta;
// 		}

// 	}
// };

export { default as R } from '../../node_modules/ramda/dist/ramda';
export { default as B } from '../../node_modules/baconjs/dist/Bacon';
