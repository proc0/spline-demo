'use strict';
import { R } from './tool';
import local from './local/core';
import world from './world/core';
import options from '../options';
/**
 * @type init :: () -> IO
 */
var app = function init(event){
		return R.compose(local, world)(options);
	};

world.init(app);
