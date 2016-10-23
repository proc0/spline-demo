'use strict';

import R from '../../node_modules/ramda/dist/ramda';
import Cell from './cell';
import Cyto from './cyto';
import State from './state';

export default function Colony(cytos){
	this.value = cytos;
}

Colony.prototype.reduce = function(transform, monoid){
	return R.reduce(R.reduce(transform), monoid, this.value);
};

Colony.prototype.map = function(transform, monoid){
	return R.map(R.map(transform), this.value);
};