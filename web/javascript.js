/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var req;
var completeField;
var completeTable;
var autoRow;

function init() {
    completeField = document.getElementById("complete-field");
    completeTable = document.getElementById("complete-table");
    autoRow = document.getElementById("auto-row");
    completeTable.style.top = getElementY(autoRow) + "px";
}

function doCompletion() {
    var url = "autocomplete?action=complete&id=" + escape(completeField.value);
    req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.onreadystatechange = callback;
    req.send(null);
}

function callback() {
    clearTable();
    if (req.readyState == 4 && req.status == 200) {
        parseMessages(req.responseXML);
    }
}

function parseMessages(responseXML) {
    var composers = responseXML.getElementsByTagName("composers")[0];
    var n = composers.childNodes.length;
    if (n > 0) {
        completeTable.setAttribute("bordercolor", "black");
        completeTable.setAttribute("border", "1");
        for (var i = 0; i < n; i++) {
            var composer = composers.childNodes[i];
            var firstName = composer.getElementsByTagName("firstname")[0].childNodes[0].nodeValue;
            var lastName = composer.getElementsByTagName("lastname")[0].childNodes[0].nodeValue;
            var composerId = composer.getElementsByTagName("id")[0].childNodes[0].nodeValue;
            appendComposer(firstName, lastName, composerId);
        }
    }
}

function appendComposer(firstName, lastName, composerId) {
    var row;
    var cell;
    var linkElement;
    completeTable.style.display = 'table';
    row = document.createElement("tr");
    cell = document.createElement("td");
    row.setAttribute("onclick","tableListener(this);")
    row.appendChild(cell);
    completeTable.appendChild(row);
    cell.className = "popupCell";
    linkElement = document.createElement("a");
    linkElement.className = "popupItem";
    linkElement.setAttribute("href", "autocomplete?action=lookup&id=" + composerId);
    linkElement.appendChild(document.createTextNode(firstName + " " + lastName));
    cell.appendChild(linkElement);
}

function fillComposersList(firstName, lastName, composerId) {
    var option = document.createElement("option");
    option.value = firstName + " " + lastName;
    composersList.appendChild(option);
}

function clearTable() {
    if (completeTable.getElementsByTagName("tr").length > 0) {
        completeTable.style.display = 'none';
        for (loop = completeTable.childNodes.length -1; loop >= 0 ; loop--) {
            completeTable.removeChild(completeTable.childNodes[loop]);
        }
    }
}

function getElementY(element) {
    var targetTop = 0;
    if (element.offsetParent) {
        while (element.offsetParent) {
            targetTop += element.offsetTop;
            element = element.offsetParent;
        }
    }
    else if (element.y) {
        targetTop += element.y;
    }
    return targetTop;
}

function tableListener(element) {
    document.getElementById("main-content").innerHTML = element.childNodes[0].childNodes[0].innerHTML;
}


