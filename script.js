function tableArrowClicked(el) {
    if(el.textContent == "▼"){
        el.textContent = "▶︎";
        for (let i=1 ; i< el.parentNode.parentNode.children.length; i=i+1) {
            el.parentNode.parentNode.children[i].style.setProperty("display", "none");
        }
    }else{
        el.textContent = "▼";
        for (let i=1 ; i< el.parentNode.parentNode.children.length; i=i+1) {
            el.parentNode.parentNode.children[i].style.removeProperty("display");
        }
    }
}

function toggleClicked(el, tag_id) {
    var el_body;
    if(tag_id == "EnactStatement"){
        el_body = document.getElementsByClassName(tag_id)[0];
    }else{
        el_body = document.getElementById(tag_id);
    }
    if (el_body.style.getPropertyValue("display")){
        el.style.removeProperty("background-color");
        elements = document.querySelectorAll('[id^=toggle-' + tag_id + '-]');
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.removeProperty("background-color");
        }

        if(tag_id == "EnactStatement"){
            var elements = document.getElementsByClassName("EnactStatement")
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.removeProperty("display");
            }
        }else{
            el_body.style.removeProperty("display");
            var elements = document.querySelectorAll('[id^=' + tag_id + '-]');
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.removeProperty("display");
            }
        }

        var next_pos = 0;
        while(true){
            pos = tag_id.indexOf("-", next_pos);
            if(pos < 0)break;

            var element = document.getElementById(tag_id.substr(0, pos));
            if(element){
                element.style.removeProperty("display");
            }
            element = document.getElementById("toggle-" + tag_id.substr(0, pos));
            if(element){
                element.style.removeProperty("background-color");
            }

            next_pos = pos + 1
        }
    }else{
        el.style.setProperty("background-color", "black");
        elements = document.querySelectorAll('[id^=toggle-' + tag_id + '-]');
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.setProperty("background-color", "black");
        }
        if(tag_id == "EnactStatement"){
            var elements = document.getElementsByClassName("EnactStatement")
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.setProperty("display", "none");
            }
        }else{
            el_body.style.setProperty("display", "none");
            var elements = document.querySelectorAll('[id^=' + tag_id + '-]');
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.setProperty("display", "none");
            }
        }
    }
}

function toggleToc(){
    var el_body = document.getElementById("toc");
    if (el_body.style.getPropertyValue("display")){
        el_body.style.removeProperty("display");
    }else{
        el_body.style.setProperty("display", "none");
    }
}

function loadFinished(){
    // 削除された条文が指定された場合、直近の上位を表示
    var urlHash = location.hash.substring(1);
    for(let i = urlHash.length; i > 0; i--){
        if(document.getElementById(urlHash.substr(0, i))){
            location.hash = "#" + urlHash.substr(0, i);
            break;
        }
    }
}

window.addEventListener('load', loadFinished);