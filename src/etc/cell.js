'use strict';

import R from '../../node_modules/ramda/dist/ramda';

const hasProp = R.compose(R.converge(R.all(R.identity)), R.map(R.has)),
      validCell = hasProp(['type','maps']);

export default function Cell(dna){
	if(!validCell(dna))
		throw Error('Bad Cell formation');

	this.type = dna.type;
	this.maps = dna.maps;
};

Cell.prototype.of = function(dna){
      return new Cell(dna);
}

Cell.prototype.map = function(transform){
	return this.of(transform(this));
}

Cell.prototype.reduce = function(transform, monoid){
	return transform(monoid, this);
}