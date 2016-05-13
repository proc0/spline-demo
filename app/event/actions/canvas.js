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
	dblclick : function(event, state){
		return action('NEW_POINT', getMouse(state.context, event));
	},
	/**
	 * @desc check if point state.selected on mousedown
	 */	
	mousedown : function(event, state){
	
		var mouse = getMouse(state.context, event),
			index = findPoint(mouse)(state.points);

		return action(index > -1 ? 'SELECT' : 'NOTHING', index);
	},
	/*
	 * @desc clear selection on mouseup
	 */
	mouseup : function(event, state){
		return action('DESELECT', null);
	},
	/*
	 * @desc drag move the point if selection exists
	 */
	mousemove : function(event, state){
		var type = state.selects.length ? 'EDIT' : 'NOTHING';
		return action(type, getMouse(state.context, event));
	}
};