'use strict';
import { R, Cyto, Cell } from '../../etc';

const copyFrom = R.converge(R.compose(R.call(R.fromPairs), R.zip), [R.compose(R.last, Array), R.flip(R.props)]);

const input = {
		type : {
			'handler' : ['keyup'],
			'mouseHandler' : ['mouseup']
		},
		maps : {
			handler : function(event){
				
				var eventObject = copyFrom(event, ['type', 'key', 'keyCode']);

				return eventObject;
			},
			mouseHandler : function(event){
				return copyFrom(event, ['type', 'x', 'y']);
			}
		}
	},
	output = {
		type : {
			'dom' : ['html']
		},
		maps : {
			canvas : function(context){

			},

			dom : function(html){

				var main = document.getElementsByTagName('main')[0];

				main.innerHTML = html;
			}
		}
	},
	dom = {
		state : {
			dom : document
		},
		input : new Cell(input),
		output : new Cell(output)
	};


export default new Cyto(dom);