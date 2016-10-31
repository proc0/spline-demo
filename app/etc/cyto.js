'use strict';

import R from '../../node_modules/ramda/dist/ramda';
import Cell from './cell';
import State from './state';
import Colony from './colony';

	
var isCell = function(c){ return c instanceof Cell },
	isCyto = function(c){ return c instanceof Cyto },
	isList = function(a){ return a instanceof Array },
	checkLength = R.compose(R.length, R.filter(R.identity), R.map(isCyto)),
	validLength = R.ifElse(isList, checkLength, R.F),
	validColony = R.converge(R.equals, [R.length, validLength]),
	validBranch = R.converge(R.either, [validColony, isCell]),
	
	hasOwnProp = R.flip(R.invoker(1, 'hasOwnProperty')),
	checkProps = R.compose(R.prepend(R.all(R.identity)), R.append(hasOwnProp)),
	validProps = R.compose(R.apply(R.compose), checkProps, R.of, R.flip(R.map)),

	validCyto = validProps(['input', 'state', 'output']);

export default function Cyto(seed){
	if(!seed) return this.empty();

	if(!validCyto(seed) || !validBranch(seed.input) || !validBranch(seed.output)) 
		throw Error('Bad Cyto formation');

	this.state = new State(seed.state, this);
	this.input = validColony(seed.input) ? new Colony(seed.input) : seed.input;
	this.output = validColony(seed.output) ? new Colony(seed.output) : seed.output;
};

Cyto.prototype.empty = function(){
	return new Cyto({
		input : [],
		state : {},
		output : []
	});
}

Cyto.prototype.map = function(transform){
	return new Cyto({
		input : R.map(transform, this.input),
		output : R.map(transform, this.output),
		state : transform(this.state)
	});
}

Cyto.prototype.reduce = function(transform, monoid){
	var newState = transform(monoid, this.state),
		newInput = R.reduce(transform, newState, this.input),
		newOutput = R.reduce(transform, newInput, this.output);

	return newOutput;
}

Cyto.prototype.concat = function(cyto){
	var newCyto = new Cyto();

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
	// R.map(function(f){
		
	// }, functor)
}

Cyto.prototype.of = function(seed){
	return new Cyto(seed);
}

Cyto.prototype.traverse = function(f){

}

Cyto.prototype.chain = function(f){

}

Cyto.prototype.equals = function(node){


}