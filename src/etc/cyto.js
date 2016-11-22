'use strict';

import R from '../../node_modules/ramda/dist/ramda';
import Colony from './colony';
import State from './state';
import Cell from './cell';

	
const handleError = function(seed){ 
		console.log(seed); 
		throw Error('Bad Cyto formation.'); 
	},

	validBranch = R.converge(R.or, [R.is(Colony), R.is(Cell)]),
	checkBranch = R.compose(R.apply(R.compose), R.prepend(validBranch), R.of, R.prop),
	
	allPass = R.all(R.identity),
	hasProp = R.compose(R.converge(allPass), R.map(R.has)),
	isValid = R.converge(R.compose(allPass, Array), [checkBranch('input'), checkBranch('output')]),
	checkCyto = R.and(hasProp(['input', 'state', 'output']), isValid),

	validate = R.ifElse(checkCyto, R.identity, handleError);

export default function Cyto(seed){
	if(!seed) return this.empty();
	else validate(seed);

	this.state = new State(seed.state, this);
	this.input = seed.input;
	this.output = seed.output;
};

Cyto.prototype.of = function(seed){
	return new Cyto(seed);
}

Cyto.prototype.focus = function(directions){
	let head = undefined,
	changeDir = function(dir){
		if(dir === 'R')
			head = this.goRight(head || this);
		else if(dir === 'L')
			head = this.goLeft(head || this);

		return head;
	}.bind(this);

	for(var d in directions){
		changeDir(directions[d])
	}

	return head;
}

Cyto.prototype.goLeft = function(branch){

	if(R.is(Colony, branch))
		return R.map(R.prop('input'), branch.value);
	else if(R.is(Cell, branch))
		return branch;
	else if(R.is(Array, branch))
		return R.flatten(R.map(R.ifElse(R.is(Cyto), R.prop('input'), R.prop('value')), branch))
	else if(R.is(Cyto, branch))
		return branch.input
}

Cyto.prototype.goRight = function(branch){

	if(R.is(Colony, branch))
		return R.map(R.prop('output'), branch.value);
	else if(R.is(Cell, branch))
		return branch;
	else if(R.is(Array, branch))
		return R.flatten(R.map(R.ifElse(R.is(Cyto), R.prop('output'), R.prop('value')), branch))
	else if(R.is(Cyto, branch))
		return branch.output;
}

Cyto.prototype.empty = function(){
	return this.of({
		input : [],
		state : {},
		output : []
	});
}

Cyto.prototype.map = function(transform){
	return this.of({
		input : R.map(transform, this.input),
		output : R.map(transform, this.output),
		state : transform(this.state)
	});
}

Cyto.prototype.reduce = function(transform, monoid){
	const newState = transform(monoid, this.state),
		newInput = R.reduce(transform, newState, this.input),
		newOutput = R.reduce(transform, newInput, this.output);

	return newOutput;
}

Cyto.prototype.concat = function(cyto){
	const newCyto = this.empty();

	if(isCell(this.input) && isCell(cyto.input)){
		this.input = R.merge(this.input, cyto.input);
	} else if(isCell(this.input) && validColony(cyto.input)){
		newCyto.input = this.input; 
		this.input = cyto.input.concat(newCyto);
	} else if(validColony(this.input) && isCell(cyto.input)){
		newCyto.input = cyto.input;
		this.input.concat(newCyto);
	} else if(validColony(this.input) && validColony(cyto.input)){
		this.input.concat(cyto.input);
	}

	if(isCell(this.output) && isCell(cyto.output)){
		this.output = R.merge(this.output, cyto.output);
	} else if(isCell(this.output) && validColony(cyto.output)){
		newCyto.output = this.output; 
		this.output = cyto.output.concat(newCyto);
	} else if(validColony(this.output) && isCell(cyto.output)){
		newCyto.output = cyto.output;
		this.output.concat(newCyto);
	} else if(validColony(this.output) && validColony(cyto.output)){
		this.output.concat(cyto.output);
	}

	this.state = R.merge(this.state, cyto.state);

	return this;
}

Cyto.prototype.ap = function(functor){
	// return R.map(R.flip(R.map)(this), functor);
}

Cyto.prototype.traverse = function(f, of){


}

Cyto.prototype.chain = function(f){

}

Cyto.prototype.equals = function(node){


}