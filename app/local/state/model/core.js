'use strict';
import { R, getProp } from '../../util';
import props from './props';

/**
 * @type model :: Data -> State -> State
 */
export default function model(data, state){

	if(!data || !data.type)
		throw Error('No data to process.');

	if(data.type === 'NOTHING')
		return null;

	var nextState,
		getHandler = R.compose(R.flip(R.gt)(0), R.length, R.filter(R.equals(data.type)));

	if(state)
		R.mapObjIndexed(function(dataList, handlerName){
			//if model has handler
			//get data handler
			if( getHandler(dataList) )
				try { 
					// console.log(data.type); 
					nextState = props[handlerName](data, state); 
				} catch(err){ 
					console.log(err) 
				}
		}, props.eventMap);
	
	// if(!nextState)
	// 	throw Error('No state was processed!');

	return nextState;
}
