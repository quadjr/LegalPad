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

let highlighted_article = null;

function refArrowClicked(key, force = false) {
    let elements = document.getElementsByClassName("ref_line");
    for (let i=0 ; i< elements.length; i=i+1) {
        elements[i].style.backgroundColor = "white";
    }
    let pre_highlighted_article = highlighted_article;
    if(highlighted_article){
        highlighted_article.style.removeProperty("background-color");
        highlighted_article = null;
    }

    let ref_box = document.getElementById("ref_box_" + key);

    let arrow = document.getElementById("ref_arrow_" + key);
    if(arrow.textContent == "▼" && ((force && ref_box == pre_highlighted_article) || !force)){
        arrow.textContent = "▶︎";
        for (let i=1 ; i< arrow.parentNode.parentNode.children.length; i=i+1) {
            arrow.parentNode.parentNode.children[i].style.setProperty("display", "none");
        }
        return false;
    }else{
        arrow.textContent = "▼";
        for (let i=1 ; i< arrow.parentNode.parentNode.children.length; i=i+1) {
            arrow.parentNode.parentNode.children[i].style.removeProperty("display");
        }

        let line = document.getElementById("ref_line_" + key);
        line.style.backgroundColor = "#E0E0E0";
        ref_box.style.backgroundColor = "#A0A0A0";
        highlighted_article = ref_box;
        return true;
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

var toolbar_mode = 'toc';

function toolbarClick(mode, force = false){
    var side_panel = document.getElementById("side_panel");
    let icon_toc = document.getElementById("icon_toc");
    let icon_refs = document.getElementById("icon_refs");

    if (mode == '' || (!force && mode == toolbar_mode)){
        side_panel.style.setProperty("display", "none");
        icon_refs.style.removeProperty("background-color");
        icon_toc.style.removeProperty("background-color");
        toolbar_mode = '';
    }else{
        side_panel.style.removeProperty("display");
        let toc = document.getElementById("toc");
        let refs = document.getElementById("refs");
        if(mode == 'toc'){
            toc.style.removeProperty("display");
            icon_toc.style.setProperty("background-color", "lightgray");
            refs.style.setProperty("display", "none");
            icon_refs.style.removeProperty("background-color");
        }else{
            toc.style.setProperty("display", "none");
            icon_toc.style.removeProperty("background-color");
            refs.style.removeProperty("display");
            icon_refs.style.setProperty("background-color", "lightgray");
        }
        toolbar_mode = mode;
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

    if(window == window.parent){
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

                    var article = values[0].match(/Mp(-At[_\d]+)(-Pr[_\d]+)*(-It[_\d]+)*/);
                    let key = article[0] + values[2] + values[3];
                    if(!(key in linked_label)){
                        if(!(article[0] in refs)){
                            refs[article[0]] = [];
                        }
                        refs[article[0]].push(values);
                        linked_label[key] = true;
                    }
                }
            }

            let side_panel = document.getElementById("side_panel");

            var keys = Object.keys(refs);
            keys.sort(function (val1, val2) {
                let val1_split = val1.split('-');
                let val2_split = val2.split('-');
                for(let i = 0; i < Math.min(val1_split.length, val2_split.length); i++){
                    let val1_sub = val1_split[i].split('_');
                    let val2_sub = val2_split[i].split('_');
                    for(let j = 0; j < Math.min(val1_sub.length, val2_sub.length); j++){
                        let num1, num2;
                        if (isNaN(val1_sub[j])){
                            num1 = val1_sub[j];
                        }else{
                            num1 = Number(val1_sub[j]);
                        }
                        if (isNaN(val2_sub[j])){
                            num2 = val2_sub[j];
                        }else{
                            num2 = Number(val2_sub[j]);
                        }
                        if(num1 < num2){
                            return -1;
                        }else if(num1 > num2){
                            return 1;
                        }
                    }
                }
                if(val1.length > val2.length){
                    return 1;
                }else{
                    return -1;
                }
            });

            let str = "";
            for (let key of keys) {
                el = document.getElementById(key);
                if(el){
                    const div = document.createElement("a");
                    div.className = "ref_box";
                    div.id = "ref_box_" + key;
                    div.href = "#ref_" + key;
                    div.title = "被引用（" + refs[key].length + "件）";
                    div.onclick = function(){
                        if(refArrowClicked(key, true)){
                            toolbarClick("refs", true);
                        }
                    }
                    // div.innerHTML = refs[key].length;
                    const refs_div = document.createElement("div");
                    refs_div.className = "refs_box";
                    div.appendChild(refs_div);

                    let replaces = [
                        ['Mp', ""], ['Apn_', "別記"], ['Apt_', "別表"], ['Apg_', "別図"], ['Apf_', "別記書式"],
                        ['Aps_', "別記様式"], ['Ap_', "付録"], ['Spa_', "附則付録"],
                        ['Spt_', "附則別表"], ['Sps_', "附則様式"], ['Sp_', "附則"],
                        ['Es_', "制定文"], ['Pm_', "前文"], ['Apn', "別記"], ['Apt', "別表"], ['Apg', "別図"], ['Apf', "別記書式"], ['Aps', "別記様式"],
                        ['Ap', "付録"], ['Spa', "附則付録"], ['Spt', "附則別表"], ['Sps', "附則様式"], ['Sp', "附則"], ['Es', "制定文"], ['Pm', "前文"],
                        [/-At_([_\d]+)/, '$1条'], [/-Pr_([_\d]+)/, '$1項'], [/-It_([_\d]+)/, '$1号'], [/_/g, 'の']
                    ];

                    let title = key;
                    for(let i = 0; i < replaces.length; i++){
                        title = title.replace(replaces[i][0], replaces[i][1]);
                    }
                    str += "<div class='ref_line' id='ref_line_" + key + "'><div class='ref_title' id='ref_" + key + "'>"
                    str += "<div class='table_arrow' id='ref_arrow_" + key + "' onclick='refArrowClicked(\"" + key + "\")'>▶︎</div>\n" 
                    str += "<a href='#" + key + "' onclick='refArrowClicked(\"" + key + "\")'>" + title + "</a>（" + refs[key].length + "件）</div>";

                    refs[key].sort(function (a, b) {
                        if(a[2] == b[2]){
                            return a[3] > b[3];
                        }else{
                            return a[2] > b[2];
                        }
                    });

                    str += "<div style='display: none'>"
                    pre_law = ""
                    refs[key].forEach(ref => {
                        let label = ref[3];
                        for(let i = 0; i < replaces.length; i++){
                            label = label.replace(replaces[i][0], replaces[i][1]);
                        }

                        if(pre_law != ref[2]){
                            str += "<div class='ref_law'>" + ref[1] + "</div>";
                            str += "<a class='ref_links' data-key='" + key + "' href='L_" + ref[2] + ".html#" + ref[3] + "' onmouseover='linkMouseOver(this)' onmouseout='linkMouseOut(this)'>" + label + "</a><br/>";
                            pre_law = ref[2];
                        }else{
                            str += "<a class='ref_links' data-key='" + key + "' href='L_" + ref[2] + ".html#" + ref[3] + "' onmouseover='linkMouseOver(this)' onmouseout='linkMouseOut(this)'>" + label + "</a><br/>";
                        }
                    });
                    str += "</div></div>"

                    el.insertBefore(div, el.firstChild);
                }
            }
            const ref_div = document.createElement("div");
            ref_div.id = "refs"
            ref_div.style.display = "none";
            ref_div.innerHTML = str;
            side_panel.appendChild(ref_div);
        })
        // 通信が失敗したとき
        .catch(function(error) {
            console.error('Error:', error);
        });
    }
}

var preview_el = null;

function respondToVisibility(element, callback) {
    var options = {
      root: document.documentElement,
    };
  
    var observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        callback(entry.intersectionRatio > 0);
      });
    }, options);
  
    observer.observe(element);
}

function linkMouseOver(el){
    var el_body = document.getElementById("body");
    if(preview_el)
        preview_el.remove();
    preview_el = document.createElement("iframe");
    preview_el.id = "preview_el";
    preview_el.className = "preview_el";
    preview_el.style.setProperty("top", (el.getBoundingClientRect().bottom - el_body.getBoundingClientRect().top) + el_body.scrollTop);
    preview_el.setAttribute('sandbox', "allow-scripts allow-same-origin");
    preview_el.src = el.href;

    // Some tricks to prevent scroll of parent window
    preview_el.style.setProperty("display", "none");
    preview_el.onload = function(){
        preview_el.contentWindow.document.getElementById('body').scrollTop = 0;
        let splits = el.href.split('#');
        if(splits.length > 1){
            respondToVisibility(preview_el, function(event){
                if(event){
                    preview_el.contentWindow.document.getElementById('body').scrollTop = 
                        preview_el.contentWindow.document.getElementById(splits[1]).getBoundingClientRect().top - preview_el.contentWindow.document.getElementById('body').getBoundingClientRect().top;
                }
            })
        }

        if(el.className == "ref_links"){
            let links = preview_el.contentWindow.document.getElementsByClassName('reference_link');
            for(let i = 0; i < links.length; i++){
                let href = location.href.split('#')[0];
                if(links[i].href == href + "#" + el.dataset.key){
                    console.log(links[i].href);
                    links[i].style.backgroundColor = "yellow";
                }
            }
        }

        preview_el.style.removeProperty("display");
    }

    el_body.appendChild(preview_el);
}
function linkMouseOut(el){
    if(preview_el){
        preview_el.remove();
        preview_el = null;
    }
}

if(window != window.parent){
    toolbarClick('');
    let enacts = document.getElementsByClassName("toolbar")
    for (var j = 0; j < enacts.length; j++) {
        enacts[j].style.setProperty("display", "none");
    }
    enacts = document.getElementsByClassName("header")
    for (var j = 0; j < enacts.length; j++) {
        enacts[j].style.setProperty("display", "none");
    }
}

function notscroll(event) {
    if(preview_el){
        event.preventDefault();
        preview_el.contentWindow.document.getElementById('body').scrollTop += event.deltaY;
    }
}

if(window == window.parent){
    document.addEventListener("wheel", notscroll, { passive: false });
    let icon_toc = document.getElementById("icon_toc");
    icon_toc.style.setProperty("background-color", "lightgray");
}
window.addEventListener('load', loadFinished);
