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

    var ref_file = window.location.href.split('/').pop();
    ref_file = "./" + ref_file.split('.')[0] + '.ref';
    console.log(ref_file)

    // Fetch APIの実行
    fetch(ref_file)
    // 通信が成功したとき
    .then(function(response) {
        return response.text();
    })
    .then(function(data) {
        let refs = {};
        let rows = data.split("\n");
        let linked_label = {};
        for(var i=0;i<rows.length;++i){
            let values = rows[i].split(',');
            if(values[0] != ""){
                var sp = values[3].match(/Sp/);
                if(sp)continue;

                let key = values[2] + values[3];
                if(!(key in linked_label)){
                    var article = values[0].match(/Mp-At[_\d]+/);
                    if(!(article in refs)){
                        refs[article] = [];
                    }
                    refs[article].push(values);
                    linked_label[key] = true;
                }
            }
        }
        for (let key in refs) {
            el = document.getElementById(key);
            if(el){
                title = el.getElementsByClassName("ArticleTitle");
                if(title.length > 0){
                    const div = document.createElement("div");
                    div.className = "ref_box";
                    div.innerHTML = "委任/被引用 " + refs[key].length + " 件";
                    div.onclick = function () {
                        console.log(div.children);
                        if(div.children.length > 0){
                            while (div.lastElementChild) {
                                div.removeChild(div.lastElementChild);
                            }
                        }else{
                            const ref_div = document.createElement("div");
                            let str = "";
                            refs[key].forEach(ref => {
                                let label = ref[3];
                                label = label.replace('Mp', "");
                                label = label.replace('Sp', "");
                                label = label.replace(/-At_([_\d]+)/, '第$1条');
                                label = label.replace(/-Pr_([_\d]+)/, '第$1項');
                                label = label.replace(/-It_([_\d]+)/, '第$1号');
                                label = label.replace(/_/g, 'の');
                                str += "<a class='ref_links' href='L_" + ref[2] + ".html#" + ref[3] + "'>" + ref[1] + " " + label + "</a><br/>";
                            });
                            ref_div.innerHTML = str;
                            div.appendChild(ref_div);
                        }
                    };
                    title[0].before(div);
                }
            }
        }
        console.log(refs);
    })
    // 通信が失敗したとき
    .catch(function(error) {
        console.error('Error:', error);
    });
}

window.addEventListener('load', loadFinished);