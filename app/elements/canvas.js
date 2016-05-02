import { getMouse, findPoint } from '../util';
import { render } from '../view';
import data from '../data';

export default {
	//new point on double click
	dblclick : function(event){
		//closure the user clicked point
		data.points.push(getMouse(data.context, event));
		//render new curve from mouse data.points
		return render(data.context, data.options, data.points);
	},
	//check if point data.selected on mousedown
	mousedown : function(event){
	
		var mouse = getMouse(data.context, event),
			index = findPoint(mouse)(data.points);
		//needs to store in closure to communicate 
		//to mousemove event
		return index > -1 && data.selected.push(index);
	},
	//clear selection on mouseup
	mouseup : function(event){
		//clear selection
		data.selected = [];
	},
	//drag move the point if selection exists
	mousemove : function(event){
		//update data.points, if one is selected
		if(data.selected.length){
			data.points.splice(data.selected[0], 1, getMouse(data.context, event));

			return render(data.context, data.options, data.points);
		}
	}
};