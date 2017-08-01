'use strict';

export default class Cell{

    constructor(dna){
    	if(dna && checkWith(['type','proc', 'meta'], dna)){
            this.type = dna.type;
            this.proc = dna.proc;
            this.meta = dna.meta;
        } else {
            throw Error('Bad Cell formation');
        }
    }

    of(dna){
          return new Cell(dna);
    }

    map(transform){
        return this.of(transform(this));
    }

    reduce(transform, monoid){
        return transform(monoid, this);
    }

    empty(){
        return {
            type: {},
            proc: {}
        }
    }
}
