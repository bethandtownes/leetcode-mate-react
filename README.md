![Logo](logo.png)

> A Chrome extension to improve your LeetCode Experience! 


### Main Feature
* A draggable, resizable submission dialog to make submission and get submission results.
* The same dialog can also be used to run tests. 
* Supports both `LeetCode` and `LeetCode-CN`
* Toggle cursor blinking (for CodeMirror only)
* Toggel bracket matching (for CodeMirror only)

### Feature(s) in development
* Timer
* Make use of Google Drive API to create personal repo.


### Usage
* Use `Ctrl + Enter` to submit current code and display submission result
* Use `Alt + Enter` to test run default test cases and run test cases (Mac users use `Cmd + Enter`)
* Use `Alt + i` to toggle LeetCode Mate UI (Mac users use `Cmd +i`)
* Use `Alt + k` to toggle LeetCode Mate Editor (Mac users use `Cmd +k`)

* To use it in LeetCode-CN, please disable the default `ctrl-enter` shortcuts.


### Demo
[YouTube](https://youtu.be/-EERA_JScJE)
[Bilibili](https://www.bilibili.com/video/BV1p54y147zK/)

 <img src="demo.gif" style="width:600px;height:479px">
 
### Installation (Build from scratch)
* Clone this repo.
* In command line, run `npm install` to install required dependencies.
* In command line, run `npm run build` to build the package.
* Open up `Google Chrome` or `Chromium` and select `Manage Extensions`
* Turn on `Developr Mode` button (upper right hand corner) in the `Extension` page.
* Click `Load unpacked` and select `build` folder and we are done!


### Installation (Using shipped latest production build)
* Clone this repo.
* Open up `Google Chrome` or `Chromium` and select `Manage Extensions`
* Turn on `Developr Mode` button (upper right hand corner) in the `Extension` page.
* Click `Load unpacked` and select `latest_production_build` folder and we are done!


### Installation (Chrome Web Store)
> https://chrome.google.com/webstore/detail/leetcode-mate/phdjfdamgpemogokbkjeidpekchgmhem
