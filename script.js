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

function toggleClicked(el, tag_id, tag_id_full) {
    let elements = document.querySelectorAll('[data-id^=toggle-' + tag_id + '-]');
    for (var i = 0; i < elements.length; i++) {
        elements[i].checked = el.checked;
    }

    if (el.checked){
        var next_pos = 0;
        while(true){
            pos = tag_id.indexOf("-", next_pos);
            if(pos < 0)break;

            element = document.getElementById("toggle-" + tag_id.substr(0, pos));
            if(element){
                element.checked = true;
            }

            next_pos = pos + 1
        }
        next_pos = 0;
        while(true){
            pos = tag_id_full.indexOf("-", next_pos);
            if(pos < 0)break;

            element = document.getElementById("toggle-" + tag_id_full.substr(0, pos));
            if(element){
                element.checked = true;
            }

            next_pos = pos + 1
        }
    }

    elements = document.querySelectorAll('[data-id^=toggle-]');
    let all_off = true;
    for (var i = 0; i < elements.length; i++) {
        if(elements[i].checked && !elements[i].id.match(/((Pa)|(Ch)|(Se)|(Ss)|(Di))/) && elements[i].id != "toggle-Mp"){
            all_off = false;
            break;
        }
    }
    if(all_off){
        for (var i = 0; i < elements.length; i++) {
            elements[i].checked = false;
        }
    }

    for (var i = 0; i < elements.length; i++) {
        tag = elements[i].id.replace("toggle-", "");

        if(tag == "Es"){
            enacts = document.getElementsByClassName("EnactStatement")
            for (var j = 0; j < enacts.length; j++) {
                if(all_off || elements[i].checked){
                    enacts[j].style.removeProperty("display");
                }else{
                    enacts[j].style.setProperty("display", "none");
                }
            }
        }else{
            let element = document.getElementById(elements[i].id.replace("toggle-", ""));
            if(all_off || elements[i].checked){
                element.style.removeProperty("display");
            }else{
                element.style.setProperty("display", "none");
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

                var article = values[0].match(/Mp-At[_\d]+/);
                let key = article + values[2] + values[3];
                if(!(key in linked_label)){
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
                    const refs_div = document.createElement("div");
                    refs_div.className = "refs_box";
                    div.appendChild(refs_div);

                    div.onclick = function () {
                        if(refs_div.children.length > 0){
                            while (refs_div.lastElementChild) {
                                refs_div.removeChild(refs_div.lastElementChild);
                            }
                        }else{
                            const ref_div = document.createElement("div");
                            let str = "";
                            refs[key].forEach(ref => {
                                let label = ref[3];
                                label = label.replace('Mp', "");
                                label = label.replace('Apn_', "別記");
                                label = label.replace('Apt_', "別表");
                                label = label.replace('Apg_', "別図");
                                label = label.replace('Apf_', "別記書式");
                                label = label.replace('Aps_', "別記様式");
                                label = label.replace('Ap_', "付録");
                                label = label.replace('Spa_', "附則付録");
                                label = label.replace('Spt_', "附則別表");
                                label = label.replace('Sps_', "附則様式");
                                label = label.replace('Sp_', "附則");
                                label = label.replace('Es_', "制定文");
                                label = label.replace('Pm_', "前文");
                                label = label.replace('Apn', "別記");
                                label = label.replace('Apt', "別表");
                                label = label.replace('Apg', "別図");
                                label = label.replace('Apf', "別記書式");
                                label = label.replace('Aps', "別記様式");
                                label = label.replace('Ap', "付録");
                                label = label.replace('Spa', "附則付録");
                                label = label.replace('Spt', "附則別表");
                                label = label.replace('Sps', "附則様式");
                                label = label.replace('Sp', "附則");
                                label = label.replace('Es', "制定文");
                                label = label.replace('Pm', "前文");
                                label = label.replace(/-At_([_\d]+)/, '$1条');
                                label = label.replace(/-Pr_([_\d]+)/, '$1項');
                                label = label.replace(/-It_([_\d]+)/, '$1号');
                                label = label.replace(/_/g, 'の');
                                str += "<a class='ref_links' href='L_" + ref[2] + ".html#" + ref[3] + "' onmouseover='linkMouseOver(this)' onmouseout='linkMouseOut(this)'>" + ref[1] + "　" + label + "</a><br/>";
                            });
                            ref_div.innerHTML = str;
                            refs_div.appendChild(ref_div);
                        }
                    };
                    title[0].before(div);
                }
            }
        }
    })
    // 通信が失敗したとき
    .catch(function(error) {
        console.error('Error:', error);
    });

    if(window != window.parent){
        toggleToc();
        
        let enacts = document.getElementsByClassName("header")
        for (var j = 0; j < enacts.length; j++) {
            enacts[j].style.setProperty("display", "none");
        }
        enacts = document.getElementsByClassName("table_of_contents_icon")
        for (var j = 0; j < enacts.length; j++) {
            enacts[j].style.setProperty("display", "none");
        }
    }
}

function linkMouseOver(el){
    var el_body = document.getElementById("body");
    const preview_el = document.createElement("iframe");
    preview_el.id = "preview_el";
    preview_el.className = "preview_el";
    preview_el.style.setProperty("top", (el.getBoundingClientRect().bottom - el_body.getBoundingClientRect().top) + el_body.scrollTop);
    preview_el.setAttribute('sandbox', "allow-scripts");
    preview_el.src = el.href;

    el_body.appendChild(preview_el);
}
function linkMouseOut(el){
    var preview_el = document.getElementById("preview_el");
    preview_el.remove();
}


window.addEventListener('load', loadFinished);
