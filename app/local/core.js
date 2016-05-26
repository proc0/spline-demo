import { R, B } from '../tool';
import view from './view/core';
import state from './state/core';

/**
 * @name AppCore
 * @type init :: WorldData -> IO
 * @cyto app :: IO -> IO
 */
 export default function(worldData){
 	return R.converge(R.call, [view, state])(worldData);
 }
