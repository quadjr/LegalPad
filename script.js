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

function visibilityClicked(el, tag_id) {
    var el_body;
    if(tag_id == "EnactStatement"){
        el_body = document.getElementsByClassName(tag_id)[0];
    }else{
        el_body = document.getElementById(tag_id);
    }
    if (el_body.style.getPropertyValue("display")){
        el.style.removeProperty("background-color");
        elements = document.querySelectorAll('[id^=visibility-' + tag_id + '-]');
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].style.getPropertyValue("background-color")){
                elements[i].style.removeProperty("background-color");
            }
        }

        if(tag_id == "EnactStatement"){
            var elements = document.getElementsByClassName("EnactStatement")
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].style.getPropertyValue("display")){
                    elements[i].style.removeProperty("display");
                }
            }
        }else{
            el_body.style.removeProperty("display");
            var elements = document.querySelectorAll('[id^=' + tag_id + '-]');
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].style.getPropertyValue("display")){
                    elements[i].style.removeProperty("display");
                }
            }
        }

        var next_pos = 0;
        while(true){
            pos = tag_id.indexOf("-", next_pos);
            if(pos < 0)break;

            var element = document.getElementById(tag_id.substr(0, pos));
            if(element){
                if (element.style.getPropertyValue("display")){
                    element.style.removeProperty("display");
                }
            }
            element = document.getElementById("visibility-" + tag_id.substr(0, pos));
            if(element){
                if (element.style.getPropertyValue("background-color")){
                    element.style.removeProperty("background-color");
                }
            }

            next_pos = pos + 1
        }
    }else{
        el.style.setProperty("background-color", "black");
        elements = document.querySelectorAll('[id^=visibility-' + tag_id + '-]');
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

function tocClicked(tag_id){
    document.getElementById("body").scrollTop = document.getElementById(tag_id).offsetTop - document.getElementById("body").offsetTop;
}

function page_loaded(){
    let param = location.search.substring(1).split('&');
    let param_dic = new Object;
    for (let i = 0; i < param.length; i++) {
        let key_val = param[i].split('=');
        param_dic[key_val[0]] = decodeURI(key_val[1]);
    }
    if("line" in param_dic){
        let name = param_dic["line"];
        name = name.replace("第一項", "");
        name = name.replace("各条", "第一条");
        name = name.replace("各項", "");
        name = name.replace("各号", "第一号");
        let el_body = document.getElementsByClassName("ref_" + name);
        if(el_body.length > 0){
            document.getElementById("body").scrollTop = el_body[0].offsetTop - document.getElementById("body").offsetTop;
        }
    }
    
    window.addEventListener('popstate', function(event) {
        document.getElementById("body").scrollTop = history.state;
    },false );
}

function refClicked(ref_id){
    let el_body = document.getElementsByClassName("ref_" + ref_id);
    if(el_body.length > 0){
        history.replaceState(document.getElementById("body").scrollTop, null)
        history.pushState(el_body[0].offsetTop - document.getElementById("body").offsetTop, null);
    }else{
        console.log("ref_" + ref_id)
        console.log(el_body)
    }
}

function refLawClicked(ref_url){
    history.replaceState(document.getElementById("body").scrollTop, null)
    window.location.href = ref_url;
}