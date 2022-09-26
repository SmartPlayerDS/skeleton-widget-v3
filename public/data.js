(function(){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            window['skeleton-widget-v3'] = JSON.parse(xhr.response)
        }
    }
    xhr.open("GET", "./settings.json", false)
    xhr.send()
}())