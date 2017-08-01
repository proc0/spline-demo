'use strict';

import { default } from './utils';
import State from './state';
import Cell from './cell';
import Colony from './colony';

export default class Cyto {

	DATA(){
		return {
			META : [
				'state', 
				'input', 
				'output'
			],	
			BRANCHES :[
				'Cell',
				'Colony'
			]
		}
	}

	of(seed){
		return new Cyto(seed)
	}

	init(_seed){
		const seed = merge(_seed, {
				state : new State(_seed.state, this)
			})

		map(function(phase){ 
			this[phase] = seed[phase]
		}.bind(this), this.DATA().META)
	}

	bindMethod(method){
		return this[method].bind(this)
	}

	constructor(seed) {
		const bindIf = compose(apply(ifElse), map(this.bindMethod.bind(this)))
		return bindIf(['maybe', 'init', 'halt'])(seed)
	}

	maybe(seed){
		const _ = this.DATA(),
			dataValid = checkWith(_.META),

			//a valid branch is either a colony or a cell
			isBranch = converge(or, map(equals, _.BRANCHES)),
			checkBranch = compose(isBranch, getProp('constructor.name')),
			//exclude state from being a branch
			branchesValid = checkWith(checkBranch, tail(_.META)),

			isValid = and(branchesValid, dataValid)
			
		//lets put it all together
		return seed && ifElse(isValid, identity, F)(seed)
	}

	empty(){
		return this.of({
			input : Cell.empty(),
			state : State.empty(),
			output : Cell.empty()
		})
	}

	map(transform){
		return this.of({
			input : map(transform, this.input),
			output : map(transform, this.output),
			state : transform(this.state)
		})
	}

	reduce(transform, monoid){
		const newState = transform(monoid, this.state),
			newInput = reduce(transform, newState, this.input),
			newOutput = reduce(transform, newInput, this.output)

		return newOutput
	}

	concat(cyto){
		const newCyto = this.empty()

		if(Cell.maybe(this.input) && Cell.maybe(cyto.input)){
			this.input = merge(this.input, cyto.input)
		} else if(Cell.maybe(this.input) && Colony.maybe(cyto.input)){
			newCyto.input = this.input 
			this.input = cyto.input.concat(newCyto)
		} else if(Colony.maybe(this.input) && Cell.maybe(cyto.input)){
			newCyto.input = cyto.input
			this.input.concat(newCyto)
		} else if(Colony.maybe(this.input) && Colony.maybe(cyto.input)){
			this.input.concat(cyto.input)
		}

		if(Cell.maybe(this.output) && Cell.maybe(cyto.output)){
			this.output = merge(this.output, cyto.output)
		} else if(Cell.maybe(this.output) && Colony.maybe(cyto.output)){
			newCyto.output = this.output 
			this.output = cyto.output.concat(newCyto)
		} else if(Colony.maybe(this.output) && Cell.maybe(cyto.output)){
			newCyto.output = cyto.output
			this.output.concat(newCyto)
		} else if(Colony.maybe(this.output) && Colony.maybe(cyto.output)){
			this.output.concat(cyto.output)
		}

		this.state = merge(this.state, cyto.state)

		return this
	}

	ap(functor){
		// return map(flip(map)(this), functor)
	}

	traverse(f, of){


	}

	chain(f){

	}

	equals(node){


	}

	focus(dir, node){
		const directions = typeof dir === 'string' ? [dir] : dir,
			destination = reduce(flip(this.selectNode.bind(this)), node || this, directions)
		return destination
	}

	selectNode(direction, node){
		//left is input, right is output		
		const io = prop(direction, { 
				'L': 'input',
				'R': 'output'
			}),
			condition = (isType, move) => {
				return ifElse(isType, move, identity)
			},
			applyCondition = compose(apply(condition), flatten, tail, Array),
			//reducer which takes (node, condition) and returns a selection
			reduceCondition = converge(call, [applyCondition, identity]),
			//if cyto, selection is either input or output
			selectCyto = prop(io),
			//if colony, selection is the selection of its cytos
			selectColony = compose(map(selectCyto), prop('value')),
			//call this function with same direction
			recurse = curry(this.selectNode.bind(this))(direction),
			//... for each element in array, then flatten it 
			//(since element Colonies return Arrays)
			selectArray = compose(flatten, map(recurse)),
			//condition order matters, check for Array first
			//because when True, 'memo' gets passed on directly
			conditions = [
				[ is(Array), selectArray ],
				[ is(Colony), selectColony ],
				[ is(Cyto), selectCyto ]]

		return reduce(reduceCondition, node, conditions)
	}

	halt(seed){ 
		console.log(seed)
		throw Error('Bad Cyto formation.')
	}
}
