console.log("[status]: page_script fired")

window.addEventListener("EDITOR_GRAB", function test() {
    console.log("[status]: event listener [EDITOR GRAB] injected");
    window.postMessage({action: 'EDITOR_VALUE', payout: document.querySelector(".CodeMirror").CodeMirror.getValue()});
});


