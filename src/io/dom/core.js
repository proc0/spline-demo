'use strict';
import { R, Cyto, Cell, DATA } from '../../etc';

const input = {
		meta : {
			input: DATA.USER_EVENT,
			output: DATA.UI_EVENT
		},
		type : {
			'handler' : ['keyup'],
			'mouseHandler' : ['mouseup']
		},
		proc : {
			handler : function(event){
				return pick(['type', 'key', 'keyCode'], event)
			},
			mouseHandler : function(event){
				return pick(['type', 'x', 'y'], event)
			}
		}
	},
	output = {
		meta : {
			input: DATA.CONTEXT,
			output: DATA.VOID
		},
		type : {
			'dom' : ['html']
		},
		proc : {
			canvas : function(context){

			},

			dom : function(html){

				var main = document.getElementsByTagName('main')[0];

				main.innerHTML = html;
				// main.HTML
			}
		}
	},
	dom = {
		state : {
			dom : document,
			name : 'dom'
		},
		input : new Cell(input),
		output : new Cell(output)
	};


export default new Cyto(dom);