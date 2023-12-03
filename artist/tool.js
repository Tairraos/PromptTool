if (document.getElementById("nav")) {
    document.getElementById("nav").addEventListener("click", function (e) {
        document.getElementById("preview").src = e.target.dataset.target;
    })
}

if (document.getElementById("tags")) {
    document.getElementById("tags").addEventListener("click", function (e) {
        let td = e.target;
        if (td.innerText) {
            navigator.clipboard.writeText(td.innerText);
        }
    });
}
