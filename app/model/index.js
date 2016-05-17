'use strict';
import { R } from '../util';
import actions from './actions';
/**
 * @type model :: Action -> State -> State
 * @desc takes an action and a previous State,
 *		 and returns a next State. If action
 *		 is initial action, create a new Model
 */
export default function model(action, state){

	if(!action || !action.type)
		throw Error('No action to process.');

	if(action.type === 'NOTHING')
		return null;

	var nextState,
		getHandler = R.compose(R.flip(R.gt)(0), R.length, R.filter(R.equals(action.type)));

	if(state)
		R.mapObjIndexed(function(actionList, handlerName){
			//if model has handler
			//get action handler
			if(getHandler(actionList))
				try { 
					// console.log(action.type); 
					nextState = actions[handlerName](action, state); 
				} catch(err){ 
					console.log(err) 
				}
		}, actions.eventMap);
	
	if(!nextState)
		throw Error('No state was processed!');

	return nextState;
}
