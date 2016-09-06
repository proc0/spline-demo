'use strict';
import { R, getProp } from '../../../tool';
import ui from './ui';

/**
 * @type model :: WorldData -> State -> State
 */
export default R.curry(function initIo(data, state){

	if(!data){
		if(!data.type)
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
						nextState = ui[handlerName](data, state); 
					} catch(err){ 
						console.log(err) 
					}
			}, ui.eventMap);
		
		// if(!nextState)
		// 	throw Error('No state was processed!');

		return nextState;
	} else {
		return state;
	}
});

