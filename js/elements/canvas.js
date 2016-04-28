import view from '../view';
import closures from '../closures';

export default {
	//new point on double click
	dblclick : function(event){
		//closure the user clicked point
		closures.points.push(view.getMouse(closures.context, event));
		//render new curve from mouse closures.points
		return view.render(closures.context, closures.options, closures.points);
	},
	//check if point closures.selected on mousedown
	mousedown : function(event){
	
		var mouse = view.getMouse(closures.context, event),
			index = view.findPoint(mouse)(closures.points);
		//needs to store in closure to communicate 
		//to mousemove event
		return index > -1 && closures.selected.push(index);
	},
	//clear selection on mouseup
	mouseup : function(event){
		//clear selection
		closures.selected = [];
	},
	//drag move the point if selection exists
	mousemove : function(event){
		//update closures.points, if one is selected
		if(closures.selected.length){
			closures.points.splice(closures.selected[0], 1, view.getMouse(closures.context, event));

			return view.render(closures.context, closures.options, closures.points);
		}
	}
};