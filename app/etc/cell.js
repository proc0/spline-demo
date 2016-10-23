'use strict';

import R from '../../node_modules/ramda/dist/ramda';

export default function Cell(cell){
	if(!cell || !cell.type || !cell.maps)
		throw Error('Bad Cell formation');

	this.type = cell.type;
	this.maps = cell.maps;
};

Cell.prototype.map = function(transform){
	return new Cell(transform(this));
}

Cell.prototype.reduce = function(transform, monoid){
	return transform(monoid, this);
}