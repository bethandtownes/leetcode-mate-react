import React from 'react';
import ReactDOM from 'react-dom';

const viewport = document.getElementById('app');
const app = document.createElement('div');

app.id = 'root';

if (viewport) viewport.prepend(app);
import { LeetCodeMateSubmissionPanel } from "./modules/LeetCodeSubmissionPane.jsx";
import * as acquire from "../../lib/acquire.js";
import { injectJSListener } from "../../lib/utils.jsx";

injectJSListener();

/* chrome.storage.local.set({
 *     leetcodeEditorSettings: JSON.stringify({
 *   	bracketMatching: false,
 *   	blinkingCursor: true
 *     })
 * }, function() {
 *     console.log('default Editor setting is set');
 * }); */




ReactDOM.render(<LeetCodeMateSubmissionPanel />, document.getElementById('root'));
