import React from 'react';
import ReactDOM from 'react-dom';

const viewport = document.getElementById('app');
const app = document.createElement('div');

app.id = 'root';

if (viewport) viewport.prepend(app);
import { LeetCodeMate } from "./modules/LeetCodeMate.jsx";
import * as acquire from "../../lib/acquire.js";
import { injectJSListener } from "../../lib/utils.jsx";

injectJSListener();


ReactDOM.render(
	<LeetCodeMate />, document.getElementById('root')
);
