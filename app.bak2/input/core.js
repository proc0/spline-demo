import { R, cyto } from '../meta';
// import view from './view/core';
// import events from './view/events';
// import model from './model/core';

var seed = 	{
		state : {
			view : {
				elements : []
				// events : events
			},
			points : []
		},
		// input : model,
		// output : view
		input : function iIi(initState){

			return function Ii(state){
				return state;
			};
		},
		output : function iIo(initState){

			return function Io(state){
				return state;
			};
		}
	};

export default cyto(seed);