'use strict';
import { R, Cyto, State } from '../../etc';
import model from './model/core';
import view from './view';

var app = {
		state : {
			ui : R.reduce(function(arr, cellorState){
                              if(cellorState instanceof State)
                                    arr.push(cellorState);

                              return arr;
                        }, [], view)
		},
		input : model,
		output : view
	};

export default new Cyto(app);