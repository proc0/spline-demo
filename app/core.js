'use strict';
import { R } from 'tool';
import local from 'local/core';
import world from 'world/core';
import options from '../options';
/**
 * @type app :: IO -> IO
 */
var app = R.compose(local.core, world.core)(options);
//start on DOM loaded
//document.addEventListener('DOMContentLoaded', app, false);
