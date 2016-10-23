'use strict';

import R from '../../node_modules/ramda/dist/ramda';
import Cell from './cell';
import State from './state';
import Colony from './colony';

	
var isCell = function(c){ return c instanceof Cell },
	isCyto = function(c){ return c instanceof Cyto },
	isArray = function(a){ return a instanceof Array },
	checkLength = R.compose(R.length, R.filter(R.identity), R.map(isCyto)),
	validLength = R.ifElse(isArray, checkLength, R.F),
	isColony = R.converge(R.equals, [R.length, validLength]),
	isValid = R.converge(R.either, [isColony, isCell]),
	hasProp = function(o){ return function(prop){ return this.hasOwnProperty(prop) }.bind(o); },
	// mustHave = R.compose(R.apply(R.compose), R.append(hasProp), R.of, R.flip(R.map)),
	insertLengthCheck = R.converge(R.concat, [R.compose(R.append(R.length), R.of, R.head), R.compose(R.of, R.last)]),
	validate = R.converge(R.compose(R.apply(R.compose), insertLengthCheck, R.append(hasProp), Array), [R.compose(R.equals, R.length), R.flip(R.map)]);

export default function Cyto(seed){
	if(!seed.input || !seed.output || !seed.state)
	// if(validate(['input', 'state', 'output'])(seed))
		throw Error('Bad Cyto formation');

	if(!isValid(seed.input) || !isValid(seed.output))
		throw Error('Bad Colony formation');

	this.state = new State(seed.state, this);
	this.input = isColony(seed.input) ? new Colony(seed.input) : seed.input;
	this.output = isColony(seed.output) ? new Colony(seed.output) : seed.output;
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