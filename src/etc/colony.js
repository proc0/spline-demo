'use strict';

import Cyto from './cyto';

export default class Colony {

      of(cytos){
            return new Colony(cytos);
      }
      
      init(colony){
            this.value = colony
      }

      bindMethod(method){
            return this[method].bind(this)
      }

      constructor(colony) {
            this.focus = flip(curry(Cyto.prototype.focus.bind(Cyto.prototype)))(this)
            const bindIf = compose(apply(ifElse), map(this.bindMethod.bind(this)))
            return bindIf(['maybe', 'init', 'halt'])(colony)
      }

      maybe(colony){
            const isCyto = compose(equals('Cyto'), prop('name'), prop('constructor')),
                  checkLength = compose(filter(identity), map(isCyto)),
                  validLength = ifElse(is(Array), compose(_length, checkLength), always(0)),
                  validColony = converge(equals, [_length, validLength])

            return colony && validColony(colony)
      }

      empty(){
            return this.of([Cyto.empty()]);
      }

      getCytos(){
            return this.value;
      }

      concat(colony){
            return this.value.concat(colony);
      }

      reduce(transform, monoid){
            return reduce(reduce(transform), monoid, this.value);
      }

      map(transform){
            return this.of(map(transform, this.value));
      }

      halt(colony){ 
            console.log(colony)
            throw Error('Bad Colony formation.')
      }   
}