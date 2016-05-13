import { 
	getMouse, 
	findPoint 
} from '../../util';
import action from '../../data/action';

/**
 * @type { eventName : handler :: Event -> Action }
 */
export default {
	/**
	 * @desc new point on double click
	 */
	dblclick : function(event, model){
		return action('NEW_POINT', getMouse(model.context, event));
	},
	/**
	 * @desc check if point model.selected on mousedown
	 */	
	mousedown : function(event, model){
	
		var mouse = getMouse(model.context, event),
			index = findPoint(mouse)(model.points);

		return action(index > -1 ? 'SELECT' : 'DESELECT', index);
	},
	/*
	 * @desc clear selection on mouseup
	 */
	mouseup : function(event, model){
		return action('DESELECT');
	},
	/*
	 * @desc drag move the point if selection exists
	 */
	mousemove : function(event, model){
		var type = model.selects.length ? 'EDIT' : 'NOTHING';
		return action(type, getMouse(model.context, event));
	}
};