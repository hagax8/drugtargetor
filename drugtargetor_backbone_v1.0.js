var scaledCanvas;
var atcfile;
var atcFile;
var drugpath;
var connectionpath;
var filterDrugs = false;
var printall = false;
var printalldrugs = false;
var limitdrugs = 30;
var limittargets = 30;
var setDrugs = false;
var setTargets = false;
var setConnections = false;
var drawView = false;
var targetset;
var drugset;
var atcList = [];
var phenotypeList = [];
var tissueCategoryList = [];
var connectionset;
var connectors = [];
var connectorcolor = [];
var connectorwidth = [];
var throwerr = true;
var tissuecat = "Nervous";
var phenotypecode = "DEPR01"
var phenotypefileG = "working_data/phenGene-"+tissuecat+"/" + phenotypecode;
var phenotypefileD = "working_data/phenDrug/" + phenotypecode;



function characterConverter(str) {
var n = "id";
    for(i=0;i<str.length;i++){
    n = n + 'c' + str.charCodeAt(i).toString();
    }
    return n;
}


function getGradColorFromPercentile(startcolor, endcolor, percent) {
    startcolor = startcolor.replace(/^\s*#|\s*$/g, '');
    endcolor = endcolor.replace(/^\s*#|\s*$/g, '');
    if (startcolor.length == 3) {
        startcolor = startcolor.replace(/(.)/g, '$1$1');
    }
    if (endcolor.length == 3) {
        endcolor = endcolor.replace(/(.)/g, '$1$1');
    }
    var startR = parseInt(startcolor.substr(0, 2), 16),
        startG = parseInt(startcolor.substr(2, 2), 16),
        startB = parseInt(startcolor.substr(4, 2), 16);
    var endR = parseInt(endcolor.substr(0, 2), 16),
        endG = parseInt(endcolor.substr(2, 2), 16),
        endB = parseInt(endcolor.substr(4, 2), 16);
    var diffR = endR - startR;
    var diffG = endG - startG;
    var diffB = endB - startB;
    diffR = ((diffR * percent) + startR).toString(16).split(".")[0];
    diffG = ((diffG * percent) + startG).toString(16).split(".")[0];
    diffB = ((diffB * percent) + startB).toString(16).split(".")[0];
    if (diffR.length == 1) {
        diffR = '0' + diffR;
    }
    if (diffG.length == 1) {
        diffG = '0' + diffG;
    }
    if (diffB.length == 1) {
        diffB = '0' + diffB;
    }
    return '#' + diffR + diffG + diffB;
}

function hasSetDrugs() {
    "use strict";
    setDrugs = true;
}

function hasSetTargets() {
    "use strict";
    setTargets = true;
}

function hasSetConnections() {
    "use strict";
    setConnections = true;
}

function drugExistsInDrugSet(drug) {
    "use strict";
    return drugset.some(function(el) {
        return el.drug == drug;
    });
}

function drugExistsInConnectionSet(drug) {
    "use strict";
    return connectionset.some(function(el) {
        return el.drug == drug;
    });
}

function drugExistsInAtcList(drug) {
    "use strict";
    return atcFile.some(function(el) {
        return el.drug == drug;
    });
}

function drugExists(drug) {
    "use strict";
    return drugset.some(function(el) {
        return el.drug == drug;
    });
}

function targetExistsInConnectionSet(target) {
    "use strict";
    return connectionset.some(function(el) {
        return el.target == target;
    });
}

function targetExistsInTargetSet(target) {
    "use strict";
    return targetset.some(function(el) {
        return el.target == target;
    });
}

function changePrintAll() {
    "use strict";
    if (printall === true) {
        printall = false;
    } else {
        printall = true;
    }
}

function changePrintAllDrugs() {
    "use strict";
    if (printalldrugs === true) {
        printalldrugs = false;
    } else {
        printalldrugs = true;
    }
}

function revealText(x, y) {
    "use strict";
    var tochange = document.getElementById(x);
    tochange.innerHTML = "";
    tochange.innerHTML = y;
}

function percentRank(arr, v) {
    "use strict";
    if (typeof v != 'number') {
        throw new TypeError('v must be a number');
    }
    var l = arr.length;
    var i = 0;
    for (i = 0; i < l; i += 1) {
        if (v >= arr[i]) {
            while (i < l && v == arr[i]) {
                i += 1;
            }
            if (i === 0) {
                return 0;
            }
            if (v != arr[i - 1]) {
                i += (v - arr[i - 1]) / (arr[i] - arr[i - 1]);
            }
            return i / l;
        }
    }
    return 1;
}

function targetset_exists(x) {
    "use strict";
    targetset = $.csv.toObjects(x);
}

function drugset_exists(x) {
    "use strict";
    drugset = $.csv.toObjects(x);
}

function connectionset_exists(x) {
    "use strict";
    connectionset = $.csv.toObjects(x);
}

function atclist_exists(x) {
    "use strict";
    atcList = $.csv.toObjects(x);
}

function phenotypelist_exists(x) {
    "use strict";
    phenotypeList = $.csv.toObjects(x);
}

function tissueCategorylist_exists(x) {
    "use strict";
    tissueCategoryList = $.csv.toObjects(x);
}

function atcfile_exists(x) {
    "use strict";
    atcFile = $.csv.toObjects(x);
}

function phenotypefileG_exists(x) {
    "use strict";
    targetset = $.csv.toObjects(x);
}

function phenotypefileD_exists(x) {
    "use strict";
    drugset = $.csv.toObjects(x);
}


function upload() {
    "use strict";
    drugset = [];

    var f = document.getElementById('filedrugs').files[0]; // FileList object
    var objectURL = window.URL.createObjectURL(f);
    var xmlhttp;
    var xmlDoc;

    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET", objectURL, false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseText;
    drugset = $.csv.toObjects(xmlDoc);

}

function uploadATC() {
    "use strict";
    $.ajax({
        type: "GET",
        url: "working_data/list_atc",
        dataType: "text",
        cache: false,
        async: false, // set to false so order of operations is correct
        success: function(data) {
            atclist_exists(data);
        }
    });

}

function uploadPhenotypes() {
    "use strict";
    $.ajax({
        type: "GET",
        url: "working_data/list_phenotypes",
        dataType: "text",
        cache: false,
        async: false, // set to false so order of operations is correct
        success: function(data) {
            phenotypelist_exists(data);
        }
    });
}

function uploadTissueCategories() {
    "use strict";
    $.ajax({
        type: "GET",
        url: "working_data/list_tissue_categories",
        dataType: "text",
        cache: false,
        async: false, // set to false so order of operations is correct
        success: function(data) {
            tissueCategorylist_exists(data);
        }
    });
}



function uploadTargets() {
    "use strict";
    targetset = [];
    var xmlDoc;
    var f = document.getElementById('filetargets').files[0]; // FileList object
    var objectURL = window.URL.createObjectURL(f);
    var xmlhttp;
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET", objectURL, false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseText;
    targetset = $.csv.toObjects(xmlDoc);
}

function uploadConnections() {
    "use strict";
    connectionset = [];
    var f = document.getElementById('fileconnections').files[0]; // FileList object
    var objectURL = window.URL.createObjectURL(f);
    var xmlhttp;
    var xmlDoc;
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET", objectURL, false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseText;
    connectionset = $.csv.toObjects(xmlDoc);
}

function loadAllConnections() {
    "use strict";
    $.ajax({
        type: "GET",
        url: connectionpath,
        dataType: "text",
        cache: false,
        async: false,
        success: function(data) {
            connectionset_exists(data);
        }
    });
    connectionset = $.grep(connectionset, function(element) {
        return drugExistsInDrugSet(element.drug);
    });
}

function loadFiles() {
    "use strict";
   /* $.ajax({
        type: "GET",
        url: "working_data/16_upload",
        dataType: "text",
        cache: false,
        async: false, // set to false so order of operations is correct
        success: function(data) {
            targetset_exists(data);
        }
    });

    $.ajax({
        type: "GET",
        url: drugpath,
        dataType: "text",
        cache: false,
        async: false, // set to false so order of operations is correct
        success: function(data) {
            drugset_exists(data);
        }
    });*/

    $.ajax({
        type: "GET",
        url: connectionpath,
        dataType: "text",
        cache: false,
        async: false, // set to false so order of operations is correct
        success: function(data) {
            connectionset_exists(data);
        }
    });
}

function populate(element, array) {
    "use strict";
    var newElement;
    var inner;
    var inner2;
    var i = 0;
    for (i = 0; i < array.length; i += 1) {
        inner = array[i].code;
        inner2 = array[i].name;
        newElement = document.createElement('option');
        newElement.textContent = inner + ": " + inner2;
        newElement.value = inner;
        element.appendChild(newElement);
    }
}

function populateChosen(element, array) {
    "use strict";
    var textContent = "";
    var inner;
    var inner2;
    var i = 0;
    for(i = 0; i < array.length; i += 1) {
        inner = array[i].code;
        inner2 = array[i].name;
        textContent = inner + ": " + inner2;
        element.append('<option value="' + inner + '">' + textContent + '</option>');
    }
}

function populateChosenCategories(element, array) {
    "use strict";
    var textContent = "";
    var inner;
    var inner2;
    var i = 0;
    for(i = 0; i < array.length; i += 1) {
        inner = array[i].code;
        inner2 = array[i].name;
        textContent = inner2;
        element.append('<option value="' + inner + '">' + textContent + '</option>');
    }
}

function populateChosenPhenotype(element, array) {
    "use strict";
    var textContent = "";
    var innerCode;
    var innerPhenotype;
    var innerType;
    var innerCategory;
    var innerPMID;
    var i = 0;
    for(i = 0; i < array.length; i += 1) {
        innerCode = array[i].code;
        innerPhenotype = array[i].phenotype;
        innerType = array[i].type;
        innerCategory = array[i].category;
        innerPMID = array[i].PMID;
        textContent = innerCode + ': ' + innerPhenotype + ' - ' + innerCategory + ' - PMID: ' + innerPMID;
        element.append('<option value="' + innerCode + '">' + textContent + '</option>');
    }
}



function mycomparator(a, b) {
    "use strict";
    return parseFloat(b.association) - parseFloat(a.association);
}

function touchHandler(event) {
    "use strict";
    var touches = event.changedTouches;
    var first = touches[0];
    var type = "";

    switch (event.type) {
        case "touchstart":
            type = "mousedown";
            break;
        case "touchmove":
            type = "mousemove";
            break;
        case "touchend":
            type = "mouseup";
            break;
        default:
            return;
    }

    var simulatedEvent = document.createEvent("MouseEvent");

    simulatedEvent.initMouseEvent(type, true, true, window, 1,
        first.screenX, first.screenY,
        first.clientX, first.clientY, false,
        false, false, false, 0 /*left*/ , null);

    first.target.dispatchEvent(simulatedEvent);
}

function startup() {
    "use strict";
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);
}

function makeScaledCanvas() {
    "use strict";
    var scaleFactor = 3;
    var maxsize=Math.max($("#drugTable").innerHeight(),$("#targetTable").innerHeight());
    $("#cible").css('height', maxsize);
    $("#cible").css('width', window.innerWidth);
    var srcEl = document.getElementById("cible");
    var originalWidth = srcEl.offsetWidth;
    var originalHeight = srcEl.offsetHeight + 100;
    srcEl.style.width = originalWidth + "px";
    srcEl.style.height = originalHeight + "px";
    scaledCanvas = document.createElement("canvas");
    scaledCanvas.width = originalWidth * scaleFactor;
    scaledCanvas.height = originalHeight * scaleFactor;
    scaledCanvas.style.width = originalWidth + "px";
    scaledCanvas.style.height = originalHeight + "px";
    var scaledContext = scaledCanvas.getContext("2d");
    scaledContext.scale(scaleFactor, scaleFactor);
}

function connectTables() {
    "use strict";
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var con;
    var color;
    var width;
    var enFrom;
    var enTo;
    var enpos1;
    var enpos2;
    var i = 0;
    for (i = 0; i < connectors.length; i += 1) {
        con = connectors[i];
        color = connectorcolor[i];
        width = connectorwidth[i];
        enFrom = con.from;
        enTo = con.to;
        enpos1 = enFrom.offset();
        enpos2 = enTo.offset();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(enpos1.left + enFrom.width(), enpos1.top + enFrom.height() / 2);
        ctx.lineTo(enpos2.left, enpos2.top + enTo.height() / 2);
        ctx.stroke();
    }
}

function doNothing() {
    "use strict";
}

function drawCanvas() {
    "use strict";
    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    var maxheight = Math.max(window.innerHeight, document.getElementById("targetTable").offsetHeight + 70, document.getElementById("drugTable").offsetHeight + 70);
    canvas.height = maxheight;
    connectTables();
}

function resizeCanvas() {
    "use strict";
    drawCanvas();
}

function drawCanvasAndTable() {
    "use strict";
    var tr;
    var key;
    var inner;
    var i;
    var j;
    document.getElementById("drugTable").innerHTML = "";
    document.getElementById("targetTable").innerHTML = "";
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    var maxheight = Math.max(window.innerHeight, document.getElementById("targetTable").offsetHeight, document.getElementById("drugTable").offsetHeight);
    canvas.height = maxheight;
    ctx.lineWidth = 3;
    var tbl = document.getElementById("targetTable");
    var tbldrugs = document.getElementById("drugTable");
    //print drug table: header
    var th = "<tr>";
    for (i = 0; i < Object.keys(drugset[0]).length; i += 1) {
        key = Object.keys(drugset[0])[i];
        if (key != "association") {
            th += "<th nowrap align='middle'>" + key + "</th>";
        }
    }
    //add ATC id if drugs were filtered by ATC class
    if (filterDrugs) {
        th += "<th nowrap align='middle'>" + 'ATC' + "</th>";
    }
    th += "</tr>";
    tbldrugs.innerHTML += th;
    var converted;
    //print drug table: content
    for (i = 0; i < drugset.length; i += 1) {
        tr = "<tr nowrap id='" + characterConverter(drugset[i].drug) + "'>";
        for (j = 0; j < Object.keys(drugset[i]).length; j += 1) {
            key = Object.keys(drugset[i])[j];
            inner = drugset[i][key];
            if (key == "drug") {
                converted = characterConverter(inner) + "drugid";
                tr += "<td style='font-weight:bold;' align='middle' " + "onmouseover='revealText(&quot;" + converted + "&quot;,&quot;" + parseFloat(drugset[i].association) + "&quot;)'" + " onmouseout='revealText(&quot;" + converted + "&quot;,&quot;" + inner + "&quot;)'" + " class='drugtd' id='" + converted + "'>" + inner + "</td>";
            } else if (key != "association") {
                tr += "<td align='middle'>" + inner + "</td>";
            }
        }
        if (filterDrugs) {
            tr += "<td align='middle'>" + atcFile.find(x => x.drug == drugset[i].drug).atc + "</td>";
        }
        tr += "</tr>";
        tbldrugs.innerHTML += tr;
    }
    //print target table: header
    th = "<tr>";
    for (i = 0; i < Object.keys(targetset[0]).length; i += 1) {
        key = Object.keys(targetset[0])[i];

        if (key != "association") {
            if ((key != "target") && (key != 'ensembl') && (key !== "")) {
                th += "<th align='middle' class='rotate' " + " id='" + key.replace(/\s/g, "_") + "'><div><span>" + key + "</div></span></th>";

            } else {
                th += "<th align='middle' valign='bottom' " + " id='" + key.replace(/\s/g, "_") + "'><div><span>" + key + "</div></span></th>";
            }
        }
    }
    th += "</tr>";
    tbl.innerHTML += th;
    var targetadded = 0;
    //print target header: content
    for (i = 0; i < targetset.length; i += 1) {
        targetadded += 1;
        tr = "<tr id='" + characterConverter(targetset[i].target) + "'>";
        for (j = 0; j < Object.keys(targetset[i]).length; j += 1) {
            key = Object.keys(targetset[i])[j];
            if (key != "association") {
                inner = targetset[i][key];
                if ((key != "target") && (key != "ensembl") && (inner !== "") && !isNaN(inner)) {
                    inner = Math.round(inner * 10) / 10;
                }
                if (key == "target") {
                    converted = characterConverter(inner) + "tdid";
                    tr += "<td nowrap style='font-weight:bold;' align='middle' " + "onmouseover='revealText(&quot;" + converted + "&quot;,&quot;" + parseFloat(targetset[i].association) + "&quot;)'" + " onmouseout='revealText(&quot;" + converted + "&quot;,&quot;" + inner + "&quot;)'" + " class='targettd' id='" + converted + "'>" + inner + "</td>";
                } else {
                    tr += "<td nowrap align='middle' class='targettd'>" + inner + "</td>";
                }
            }
        }
        tr += "</tr>";
        tbl.innerHTML += tr;

    }
    //color expression cells in target table: red - green +
    var cells = tbl.getElementsByTagName('td');
    for (i = 0; i < cells.length; i += 1) {
        if (parseFloat(cells[i].innerHTML) < 0) {
            cells[i].style.backgroundColor = 'red';
        } else if (parseFloat(cells[i].innerHTML) > 0) {
            cells[i].style.backgroundColor = 'green';
        } else if (parseFloat(cells[i].innerHTML) == 0) {
            cells[i].style.backgroundColor = '#708090';
        } else {
            cells[i].style.backgroundColor = '#E0E0E0';
        }
    }
    var cellsdrugs = tbldrugs.getElementsByTagName('td');
    for (i = 0; i < cellsdrugs.length; i += 1) {
        cellsdrugs[i].style.backgroundColor = '#E0E0E0';
    }
    //color target cells by association
    var valvector = [];
    targetadded = 0;
    for (i = 0; i < targetset.length; i += 1) {
        valvector[i] = parseFloat(targetset[i].association);
        targetadded += 1;
    }
    targetadded = 0;
    var mycell;
    var percent;
    var mytrs;
    for (i = 0; i < targetset.length; i += 1) {
        mytrs = document.getElementById(characterConverter(targetset[i].target));
        if (mytrs !== null) {
            targetadded += 1;
            mycell = mytrs.getElementsByTagName('td')[0];
            percent = percentRank(valvector, valvector[i]);
            mycell.style.backgroundColor = getGradColorFromPercentile("#85B0BE", "#FFFFFF", percent);
        }
    }
    //empty association vecotr
    valvector = [];
    // color drug cells by association
    var valvectordrugs = [];
    for (i = 0; i < drugset.length; i += 1) {
        valvectordrugs[i] = parseFloat(drugset[i].association);
    }
    for (i = 0; i < drugset.length; i += 1) {
        mycell = document.getElementById(characterConverter(drugset[i].drug) + "drugid");
        percent = percentRank(valvectordrugs, valvectordrugs[i]);
        mycell.style.backgroundColor = getGradColorFromPercentile("#85B0BE", "#FFFFFF", percent);
    }
    //empty drug association vector
    valvectordrugs = [];
    //add drug/target pairs to connectors vector
    var mywidth;
    var drugSelector;
    var targetSelector;
    for (i = 0; i < connectionset.length; i += 1) {
        //element1Exists = document.getElementById(connectionset[i].drug);
        //element2Exists = document.getElementById(connectionset[i].target);
        drugSelector =  $("#" + characterConverter(connectionset[i].drug));
        targetSelector = $("#" + characterConverter(connectionset[i].target));
        if (drugSelector.length && targetSelector.length) {
            connectors.push({
                from: drugSelector,
                to: targetSelector
            });
            if (connectionset[i].color == "black") {
                mywidth = 1;
            } else {
                mywidth = 2;
            }
            connectorcolor.push(connectionset[i].color);
            connectorwidth.push(mywidth);
        }
    }
    // connect drugs to targets
    $(".draggable").draggable({
        // event handlers
        start: doNothing,
        drag: connectTables,
        stop: doNothing
    });
    connectTables();
    resizeCanvas();
    // add listener so that connectors are re-drawn when the window is resized
    window.addEventListener("resize", resizeCanvas, false);
}

function addRow() {
    "use strict";
    if($.trim($('#addhere').html())==='') {
                throwerr=false;
        $('#addhere').append('<table><tr><th>Drugs/Pathways (required)</th><td><input id="filedrugs" name="csvdrugs" type="file" /></td></tr><tr><th>Targets (required)</th><td><input id="filetargets" name="csvtargets" type="file" /></td></tr><tr><th>Connections (not required)</th><td><input id="fileconnections" name="csvconnections" type="file" /></td></tr><tr><th colspan="2"><a href="working_data/example_files.zip">Download Example Files</a></th> </tr></table>');
        document.getElementById("filedrugs").addEventListener('change', hasSetDrugs, false);
        document.getElementById("filetargets").addEventListener('change', hasSetTargets, false);
        document.getElementById("fileconnections").addEventListener('change', hasSetConnections, false);
    } else {
        $('#addhere').empty();
    }
}   

function changeLimDrugs(){
 limitdrugs = document.getElementById('changelimitdrugs').value;
}

function changeLimTargets(){
    limittargets = document.getElementById('changelimittargets').value;
}

function addRow2() {
    "use strict";

    
    if (document.getElementById('notdefault2').checked) {
        $('#addhere2').append('<table><tr><td colspan="2">Max. number of drugs (1-45, default 30):<input type="text" value="30" maxlength="4" size="4" oninput="" onblur="if(this.value<1){this.value=30;}else if(this.value>45){this.value=45;}" id="changelimitdrugs" onchange="changeLimDrugs;"></td></tr><tr><td colspan="2">Max. number of targets (1-45, default 30):<input type="text" value="30" maxlength="4" size="4" oninput=""  onblur="if(this.value<1){this.value=30;}else if(this.value>45){this.value=45;}" id="changelimittargets" onclick="changeLimTargets"></td></tr><tr><td colspan="2"><input type="checkbox" id="radiob" onclick="changePrintAll;"/>If not checked, only genes with associations are shown</td></tr><tr><td colspan="2"><input type="checkbox" id="radiodrugs" onclick="changePrintAllDrugs"/>If not checked, only drugs with associations are shown</td></tr></table>');

    } else {
        $('#addhere2').empty();
    }
}

function executeFilters() {
    "use strict";
    if (filterDrugs === true) {
        drugset = $.grep(drugset, function(element) {
            return drugExistsInAtcList(element.drug);
        });
    }
    drugset.sort(mycomparator);
    drugset = drugset.slice(0, limitdrugs);
    connectionset = $.grep(connectionset, function(element) {
        return drugExistsInDrugSet(element.drug);
    });
    if (!printall) {
        targetset = $.grep(targetset, function(element) {
            return targetExistsInConnectionSet(element.target);
        });
    }
    targetset.sort(mycomparator);
    targetset = targetset.slice(0, limittargets);
    if (!printalldrugs) {
        connectionset = $.grep(connectionset, function(element) {
            return targetExistsInTargetSet(element.target);
        });
        drugset = $.grep(drugset, function(element) {
            return drugExistsInConnectionSet(element.drug);
        });
    }
}

function capture() {
    "use strict";
    drawCanvasAndTable();
    makeScaledCanvas();
    html2canvas($('#cible'), {
        canvas: scaledCanvas,
        background: '#FFFFFF',

        onrendered: function(canvas) {

            canvas.toBlob(function(blob) {
                saveAs(blob, "output.png");
            }, "image/png");
        }
    });
}

function drawIt() {
    "use strict";

    var problemtarget = false;
    var problemdrug = false;
    var problemconnection = false;
    var errorstring = '';

    $("#export").on("tap", function() {
        capture();
    });

    $("#export").on("touchstart click", function() {
        capture();
    });


    if (document.getElementById('notdefault').checked) {
        if (setDrugs && setTargets && !setConnections) {
            alert('No connection provided: we are using default drug/target connections.');
            upload();
            loadAllConnections();
            uploadTargets();
            executeFilters();

            problemtarget = (targetset.length < 1);
            problemdrug = (drugset.length < 1);
            problemconnection = (connectionset.length < 1);

            if (!problemtarget && !problemdrug && !problemconnection) {
                document.getElementById('formtable').innerHTML = "";
                document.getElementById('stickydivleft').innerHTML = "<button class='button2' onClick='window.location.reload()'>Go Back</button>";
                document.getElementById('stickydivright').innerHTML = "<button onclick='capture();' class='button1' id='export'>Make PNG</button>";
                document.getElementById('footer').innerHTML = "";
                drawCanvasAndTable();
            } else {
                if (problemtarget) {
                    errorstring += "No target info. ";
                }
                if (problemdrug) {
                    errorstring += "No drug info. ";
                }
                if (problemconnection) {
                    errorstring += "No connection info.";
                }
                alert('ERROR:' + errorstring);

            }


        } else if (setDrugs && setTargets && setConnections) {
            upload();
            uploadConnections();
            uploadTargets();
            executeFilters();


            problemtarget = (targetset.length < 1);
            problemdrug = (drugset.length < 1);
            problemconnection = (connectionset.length < 1);


            if (!problemtarget && !problemdrug && !problemconnection) {

                document.getElementById('formtable').innerHTML = "";
                document.getElementById('stickydivleft').innerHTML = "<button class='button2' onClick='window.location.reload()'>Go Back</button>";
                document.getElementById('stickydivright').innerHTML = "<button onclick='capture();' class='button1' id='export'>Make PNG</button>";
                document.getElementById('footer').innerHTML = "";
                drawCanvasAndTable();
            } else {
                if (problemtarget) {
                    errorstring += 'No target info. ';
                }
                if (problemdrug) {
                    errorstring += 'No drug info. ';
                }
                if (problemconnection) {
                    errorstring += 'No connection info.';
                }
                alert('-NO DATA -' + errorstring);
            }


        } else {
            alert('Please load targets and drugs.');
        }
    } else {
        loadFiles();
        
        
         $.ajax({
        type: "GET",
        url: phenotypefileG,
        dataType: "text",
        cache: false,
        async: false, // set to false so order of operations is correct
        success: function(data) {
            phenotypefileG_exists(data);
        },
        error: function() {
            throwerr = true;
        }
    });

    
    $.ajax({
        type: "GET",
        url: phenotypefileD,
        dataType: "text",
        cache: false,
        async: false, // set to false so order of operations is correct
        success: function(data) {
            phenotypefileD_exists(data);
        },
        error: function() {
            throwerr = true;
        }
    });
    
    if(throwerr){
        alert("This phenotype has not been added yet: no file found");
    }
   
   
        executeFilters();


        problemtarget = (targetset.length < 1);
        problemdrug = (drugset.length < 1);
        problemconnection = (connectionset.length < 1);


        if (!problemtarget && !problemdrug && !problemconnection) {
            document.getElementById('formtable').innerHTML = "";
            document.getElementById('stickydivleft').innerHTML = "<button class='button2' onClick='window.location.reload()'>Go Back</button>";
            document.getElementById('stickydivright').innerHTML = "<button onclick='capture();' class='button1' id='export'>Make PNG</button>";
            document.getElementById('footer').innerHTML = "";
            drawCanvasAndTable();
        } else {
            if (problemtarget) {
                errorstring += 'No target info. ';
            }
            if (problemdrug) {
                errorstring += 'No drug info. ';
            }
            if (problemconnection) {
                errorstring += 'No connection info.';
            }
            alert('ERROR: ' + errorstring);
        }
    }
}

function changeConnectionPath() {
    "use strict";
    var e = document.getElementById("selectConnectionPath");
    connectionpath = "working_data/" + e.options[e.selectedIndex].value;
}

function changeATC() {
    "use strict";
    var e = document.getElementById("selectATC");
    var atccode = e.options[e.selectedIndex].value;
    

    if(atccode!=""){
    atcfile = "working_data/atcfiles/" + atccode + ".atc";
    $.ajax({
        type: "GET",
        url: atcfile,
        dataType: "text",
        cache: false,
        async: false, // set to false so order of operations is correct
        success: function(data) {
            atcfile_exists(data);
        },
        error: function() {
            alert("No drug data for this.");
        }
    });

    if (atcfile.length >= 1) {
        filterDrugs = true;
    } else {
        alert("No data to filter drugs.");
    }
    }
    else{ filterDrugs = false }
}


function changeTissueCategory() {
    "use strict";
    var e = document.getElementById("selectTissueCategory");
    tissuecat = e.options[e.selectedIndex].value;
}

function changePhenotype() {
    "use strict";
    document.getElementById('notdefault').checked = false;
     $('#addhere').empty();
    var e = document.getElementById("selectPhenotype");
    var phenotypecode = e.options[e.selectedIndex].value;
    phenotypefileG = "working_data/phenGene-"+tissuecat+"/" + phenotypecode;
    phenotypefileD = "working_data/phenDrug/" + phenotypecode;
    throwerr = false;
    
}

$(document).ready(function() {
    "use strict";
    connectionpath = "working_data/connections_identified_or_not_noid_bioact";
    //drugpath = "working_data/alltrav_withlog";
    uploadATC();
    uploadPhenotypes();
    uploadTissueCategories();

    $("#selectATC").chosen({
        no_results_text: "Oops, nothing found!",
      //  width: "80%"
    });
    
    $("#selectPhenotype").chosen({
        no_results_text: "Oops, nothing found!",
       // width: "80%"
    });
    
    $("#selectTissueCategory").chosen({
        no_results_text: "Oops, nothing found!",
       // width: "80%"
    });
    

    $("#selectConnectionPath").chosen({
        "disable_search": true,
       // width: "80%"
    });

    populateChosen($("#selectATC"), atcList);
    populateChosenPhenotype($("#selectPhenotype"), phenotypeList)
    populateChosenCategories($("#selectTissueCategory"), tissueCategoryList)

    $("#selectATC").trigger("chosen:updated");
    $("#selectPhenotype").trigger("chosen:updated");
    $("#selectTissueCategory").trigger("chosen:updated");

    $(".progress-btn").on("click", function() {
        var progressBtn = $(this);

        if (!progressBtn.hasClass("active") && !throwerr) {
            progressBtn.addClass("active");
            setTimeout(function() {
                drawIt();
                progressBtn.removeClass("active");
            }, 1000);
        }
    });
});

function drawCanvasAndLoadFiles() {
    "use strict";
    loadFiles();
    drawCanvasAndTable();
}
