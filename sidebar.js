
// browser.runtime.getBackgroundPage().then(background => {
//     let obj = background.document.getElementById("background-object");
//     let existing = document.getElementById("background-object");
//     console.log(document.body);
//     // document.body.appendChild(obj);
//     // console.log(obj)
// })

function handleResponse(response) {
    console.log(response)
}

function handleError() {
    console.log({error_args: arguments})
}

document.getElementById("myButton").addEventListener('click', () => {
    browser.runtime.sendMessage({
        method: "getElement"
    }).then(handleResponse, handleError)
});
