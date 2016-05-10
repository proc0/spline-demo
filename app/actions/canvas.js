import { getMouse, findPoint } from '../util';
import model from '../model';

export default {
	//new point on double click
	dblclick : function(event){
		//closure the user clicked point
		model.points.push(getMouse(model.context, event));
		//render new curve from mouse model.points
		return model;
	},
	//check if point model.selected on mousedown
	mousedown : function(event){
	
		var mouse = getMouse(model.context, event),
			index = findPoint(mouse)(model.points);
		//needs to store in closure to communicate 
		//to mousemove event
		if(index > -1)
			model.selected.push(index);
	},
	//clear selection on mouseup
	mouseup : function(event){
		//clear selection
		model.selected = [];
	},
	//drag move the point if selection exists
	mousemove : function(event){
		//update model.points, if one is selected
		if(model.selected.length){
			model.points.splice(model.selected[0], 1, getMouse(model.context, event));
			return model;
		}
	}
};