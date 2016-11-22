'use strict';

import R from '../../node_modules/ramda/dist/ramda';
import Cyto from './cyto';

const checkLength = R.compose(R.filter(R.identity), R.map(R.is(Cyto))),
      validLength = R.ifElse(R.is(Array), R.compose(R.length, checkLength), R.always(0)),
      validColony = R.converge(R.equals, [R.length, validLength]);

export default function Colony(cytos){
      if(!validColony(cytos))
            throw Error('Bad Colony formation.')

	this.value = cytos;
}

Colony.prototype.empty = function(){

}

Colony.prototype.getCytos = function(){
      return this.value;
}

Colony.prototype.of = function(cytos){
      return new Colony(cytos);
}

Colony.prototype.concat = function(colony){
	return this.value.concat(colony);
}

Colony.prototype.reduce = function(transform, monoid){
	return R.reduce(R.reduce(transform), monoid, this.value);
};

Colony.prototype.map = function(transform){
	return this.of(R.map(transform, this.value));
};