var scaledCanvas;
var atcfile;
var atcFile = [];
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
var atcDrugList = [];
var phenotypeList = [];
var tissueCategoryList = [];
var connectionset;
var connectors = [];
var connectorcolor = [];
var connectorwidth = [];
var throwerr = false;
var tissuecat = "Nervous";
var phenotypecode = "SCHI01";
var phenotypefileG = "working_data_v1.2/phenGene-" + tissuecat + "/" +
    phenotypecode;
var phenotypefileD = "working_data_v1.2/phenDrug/" + phenotypecode;
var scorefilter = "nofilter";
var removeafter = false;
var alltissues = ['Adipose_Subcutaneous',
    'Adipose_Visceral_Omentum',
    'Breast_Mammary_Tissue',
    'Muscle_Skeletal',
    'DGN_Whole_Blood',
    'Whole_Blood',
    'Artery_Aorta',
    'Artery_Coronary',
    'Artery_Tibial',
    'Heart_Atrial_Appendage',
    'Heart_Left_Ventricle',
    'Spleen',
    'Brain_Amygdala',
    'Brain_Anterior_cingulate_cortex_BA24',
    'Brain_Caudate',
    'Brain_Nucleus_accumbens',
    'Brain_Putamen',
    'Brain_Cerebellar_Hemisphere',
    'Brain_Cerebellum',
    'Brain_Cortex',
    'Brain_Frontal_Cortex_BA9',
    'Brain_Hippocampus',
    'Brain_Hypothalamus',
    'Brain_Spinal_cord_cervical_C1',
    'Brain_Substantia_nigra',
    'Nerve_Tibial',
    'Cells_Transformed_fibroblasts',
    'Cells_EBV_transformed_lymphocytes',
    'Colon_Sigmoid',
    'Colon_Transverse',
    'Esophagus_Gastroesophageal_Junction',
    'Esophagus_Mucosa',
    'Esophagus_Muscularis',
    'Liver',
    'Minor_Salivary_Gland',
    'Small_Intestine_Terminal_Ileum',
    'Stomach',
    'Adrenal_Gland',
    'Pituitary',
    'Pancreas',
    'Thyroid',
    'Lung',
    'Ovary',
    'Prostate',
    'Testis',
    'Uterus',
    'Vagina',
    'Skin_Not_Sun_Exposed_Suprapubic',
    'Skin_Sun_Exposed_Lower_leg'];

//this converts the target names to codes for linking the tables
function characterConverter(str) {
    "use strict";
    var i = 0,
        n = "id";
    for (i = 0; i < str.length; i += 1) {
        n = n + 'c' + str.charCodeAt(i).toString();
    }
    return n;
}

function fitToContainer(cs) {
    cs.style.width = '100%';
    cs.style.height = '100%';
    cs.width = cs.offsetWidth;
    cs.height = cs.offsetHeight;
}

//this is the function to generate the color gradient
//for drug and target association scores
function getGradColorFromPercentile(startcolor, endcolor, percent) {
    "use strict";
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

//set of functions to check if drugs and targets are present in 
// drug, target or connector files
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

function findObjectByKey(array, key, value) {
    "use strict";
    var i = 0;
    for (i = 0; i < array.length; i += 1) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
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

//change if all targets or drugs must be shown in network
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

function changeRemoveAfter() {
    "use strict";
    if (removeafter === true) {
        removeafter = false;
    } else {
        removeafter = true;
    }
}

function changeATC() {
    "use strict";
    var e = document.getElementById("selectATC");
    var atccode = e.options[e.selectedIndex].value;
    if (atccode != "") {
        atcfile = "working_data_v1.2/atcfiles/" + atccode + ".atc";
        $.ajax({
            type: "GET",
            url: atcfile,
            dataType: "text",
            cache: false,
            async: true, // set to false so order of operations is correct
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
    } else {
        filterDrugs = false;
    }
}

function changeATCdrug() {
    "use strict";
    atcFile = [];
    var e = document.getElementById("selectATCdrug");
    var atccode = e.options[e.selectedIndex].value;
    var f = findObjectByKey(atcDrugList, 'code', atccode);
    if (f === null) {
        atccode = "N05AH02";
        f = findObjectByKey(atcDrugList, 'code', atccode);
    }
    atcFile[0] = {
        drug: f.name,
        atc: f.code
    };
    filterDrugs = true;
}

//function called when choosing the ATC drug class
function drugClassChange() {
    "use strict";
    if (document.getElementById("revealdrug").checked === true) {
        document.getElementById("drugtr").style.visibility = '';
        document.getElementById("classtr").style.visibility = 'collapse';
        changeATCdrug();
    } else {
        document.getElementById("classtr").style.visibility = '';
        document.getElementById("drugtr").style.visibility = 'collapse';
        changeATC();
    }
}

function revealText(x, y) {
    "use strict";
    var tochange = document.getElementById(x);
    tochange.innerHTML = "";
    tochange.innerHTML = y;
}

function revealCanvas() {
    "use strict";
    var tochange = document.getElementById("cible");
    var maxn = Math.max(limitdrugs, limittargets);
    var maxsize = maxn * 20 + 20;
    tochange.innerHTML =
        "<canvas id='canvas' style='width:inherit;' height=" + String(maxsize) +
        " ></canvas>" +
        "<span id='tooltip-span' class='tooltip-span'></span>" +
        "<div id='wrap2'>" +
        "<table id='drugTable' class='draggable'>" +
        "</table>" +
        "</div>" +
        "<div id='wrap3'>" +
        "<table id='targetTable' class='draggable right'>" +
        "</table>" +
        "</div>" + "<div style='clear:both;'></div>";
}

//function used to rank drugs and targets
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

//set of functions to convert csv files to objects
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

function atcdruglist_exists(x) {
    "use strict";
    atcDrugList = $.csv.toObjects(x);
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

// function to load user-defined files (not default behaviour)
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

// function to load list of available atc categories
function uploadATC() {
    "use strict";
    $.ajax({
        type: "GET",
        url: "working_data_v1.2/list_atc",
        dataType: "text",
        cache: false,
        async: true, // set to false so order of operations is correct
        success: function(data) {
            atclist_exists(data);
            populateChosen($("#selectATC"), atcList);
            $("#selectATC").trigger("chosen:updated");
        }
    });

}

function uploadATCDrug() {
    "use strict";
    $.ajax({
        type: "GET",
        url: "working_data_v1.2/list_atc_drugs_selected",
        dataType: "text",
        cache: false,
        async: true, // set to false so order of operations is correct
        success: function(data) {
            atcdruglist_exists(data);
            populateChosen($("#selectATCdrug"), atcDrugList);
            $("#selectATCdrug").trigger("chosen:updated");
        }
    });
}

// function to load list of available phenotypes in v1.2
function uploadPhenotypes() {
    "use strict";
    $.ajax({
        type: "GET",
        url: "working_data_v1.2/list_phenotypes",
        dataType: "text",
        cache: false,
        async: true, // set to false so order of operations is correct
        success: function(data) {
            phenotypelist_exists(data);
            populateChosenPhenotype($("#selectPhenotype"),
                phenotypeList);
            $("#selectPhenotype").trigger("chosen:updated");
        }
    });
}

// function to load list of available tissue categories for S-PrediXcan
function uploadTissueCategories() {
    "use strict";
    $.ajax({
        type: "GET",
        url: "working_data_v1.2/list_tissue_categories",
        dataType: "text",
        cache: false,
        async: true, // set to false so order of operations is correct
        success: function(data) {
            tissueCategorylist_exists(data);
            populateChosenCategories($("#selectTissueCategory"),
                tissueCategoryList);
            $("#selectTissueCategory").trigger("chosen:updated");
        }
    });
}

// function to upload user-defined targets
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

// upload user-defined connections
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

//load chosen connection file (one of our internal ones), and check if the drugs in that file exist in the drug set loaded by the user
function loadAllConnections() {
    "use strict";
    $.ajax({
        type: "GET",
        url: connectionpath,
        dataType: "text",
        cache: false,
        async: true,
        success: function(data) {
            connectionset_exists(data);
        }
    });
}

//load chosen connection file, in case there is no user-defined file
function loadFiles() {
    "use strict";
    $.ajax({
        type: "GET",
        url: connectionpath,
        dataType: "text",
        cache: false,
        async: true, // set to false so order of operations is correct
        success: function(data) {
            connectionset_exists(data);
        }
    });
}

//set of functions to populate select element in main index
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
    for (i = 0; i < array.length; i += 1) {
        inner = array[i].code;
        inner2 = array[i].name;
        textContent = inner + ": " + inner2;
        element.append('<option value="' + inner + '">' + textContent +
            '</option>');
    }
}

function populateChosenCategories(element, array) {
    "use strict";
    var textContent = "";
    var inner;
    var inner2;
    var i = 0;
    for (i = 0; i < array.length; i += 1) {
        inner = array[i].code;
        inner2 = array[i].name;
        textContent = inner2;
        element.append('<option value="' + inner + '">' + textContent +
            '</option>');
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
    for (i = 0; i < array.length; i += 1) {
        innerCode = array[i].code;
        innerPhenotype = array[i].phenotype;
        innerType = array[i].type;
        innerCategory = array[i].category;
        innerPMID = array[i].PMID;
        textContent = innerCode + ': ' + innerPhenotype + ' - ' +
            innerCategory + ' - PMID: ' + innerPMID;
        element.append('<option value="' + innerCode + '">' + textContent +
            '</option>');
    }
}

//comparator function
function mycomparator(a, b) {
    "use strict";
    return parseFloat(b.association) - parseFloat(a.association);
}

function scorecomparator(a, b) {
    "use strict";
    return parseInt(b.score) - parseInt(a.score);
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return ((parseInt(x) < parseInt(y)) ? 1 : ((parseInt(x) >
            parseInt(y)) ? -1 : 0));
    });
}

function fieldSorter(fields) {
    return function(a, b) {
        return fields
            .map(function(o) {
                var dir = 1;
                if (o[0] === '-') {
                    dir = -1;
                    o = o.substring(1);
                }
                if (parseFloat(a[o]) > parseFloat(b[o])) {
                    return dir;
                }
                if (parseFloat(a[o]) < parseFloat(b[o])) {
                    return -(
                        dir);
                }
                return 0;
            })
            .reduce(function firstNonZeroValue(p, n) {
                return p ? p : n;
            }, 0);
    };
}

//touch handler for mobile phone - not used right now
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

//make scaled canvas for png files
function makeScaledCanvas() {
    "use strict";
    var scaleFactor = 3;
    var srcEl = document.getElementById("canvas");
    var originalWidth = srcEl.offsetWidth;
    var originalHeight = srcEl.offsetHeight;
    scaledCanvas = document.createElement("canvas");
    scaledCanvas.width = originalWidth * scaleFactor;
    scaledCanvas.height = originalHeight * scaleFactor;
    scaledCanvas.style.width = originalWidth * scaleFactor + "px";
    scaledCanvas.style.height = originalHeight * scaleFactor + "px";
    var scaledContext = scaledCanvas.getContext("2d");
    scaledContext.scale(scaleFactor, scaleFactor);
}

// connects the drug and the target table
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
        ctx.moveTo(enpos1.left + enFrom.width(), enpos1.top + enFrom.height() /
            2);
        ctx.lineTo(enpos2.left, enpos2.top + enTo.height() / 2);
        ctx.stroke();
    }
}

// nothing
function doNothing() {
    "use strict";
}

// draw initial canvas
function drawCanvas() {
    "use strict";
    var canvas = document.getElementById("canvas");
    canvas.width = document.getElementById("cible").offsetWidth + 100;
    var maxheight = Math.max(window.innerHeight, document.getElementById(
        "targetTable").offsetHeight, document.getElementById(
        "drugTable").offsetHeight);
    canvas.height = maxheight + 100;
    canvas.style.top = "0px";
    canvas.style.position = "absolute";
    connectTables();
}

// resizeCanvas is the same as drawCanvas
function resizeCanvas() {
    "use strict";
    drawCanvas();
}

// find position on canvas, in order to get pixel color to generate tooltip
function findPosition(obj) {
    var curleft = 0,
        curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return {
            x: curleft,
            y: curtop
        };
    }
    return undefined;
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255) {
        throw "Invalid color component";
    }
    return ((r << 16) | (g << 8) | b).toString(16);
}

//draw initial canvas, drug table, target table, and connect tables
function drawCanvasAndTable() {
    "use strict";
    revealCanvas();
    var tr;
    var key;
    var inner;
    var i;
    var j;
    document.getElementById("drugTable").innerHTML = "";
    document.getElementById("targetTable").innerHTML = "";
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    //fitToContainer(canvas);
    canvas.style.top = "0px";
    canvas.style.position = "absolute";
    ctx.lineWidth = 3;
    var tbl = document.getElementById("targetTable");
    var tbldrugs = document.getElementById("drugTable");
    //print drug table: header
    var th = "<tr>";
    for (i = 0; i < Object.keys(drugset[0]).length; i += 1) {
        key = Object.keys(drugset[0])[i];
        if (key == "association") {
            key = "&minus;log<sub>10</sub>(<i>p</i>)";
            //key = "score";
        }
        th += "<th nowrap align='middle' class='ellipsis'>" + key + "</th>";
    }
    th += "</tr>";
    tbldrugs.innerHTML += th;
    var converted;
    var atcid = "";
    //print drug table: content
    for (i = 0; i < drugset.length; i += 1) {
        tr = "<tr height='25' nowrap id='" + characterConverter(drugset[i].drug) +
            "'>";
        if (filterDrugs) {
            atcid = "<br>" + "ATC code: " + atcFile.find(x => x.drug ==
                drugset[i].drug).atc;
        }
        for (j = 0; j < Object.keys(drugset[i]).length; j += 1) {
            key = Object.keys(drugset[i])[j];
            inner = drugset[i][key];
            if ((key != "drug") && (key != "atc") && (key != "position") &&
                (inner !== "") && !isNaN(inner)) {
                inner = Math.round(inner * 100) / 100;
            }
            if (key == "drug") {
                converted = characterConverter(inner) + "drugid";
                tr += "<td style='font-weight:bold;' align='middle' " +
                    " class='drugtd ellipsis' id='" + converted + "'>" +
                    inner + "<span class='tooltiptext'>" + inner + atcid +
                    "</span>" + "</td>";
            } else if (key == "association") {
                tr += "<td align='middle' " + " class='ellipsis' >" + inner +
                    "<span class='tooltiptext'>" +
                    "MAGMA association from pathway analysis" + "</span>" +
                    "</td>";
            } else {
                tr += "<td align='middle'>" + inner + "</td>";
            }
        }
        tr += "</tr>";
        tbldrugs.innerHTML += tr;
    }
    //print target table: header
    th = "<tr>";
    for (i = 0; i < Object.keys(targetset[0]).length; i += 1) {
        key = Object.keys(targetset[0])[i];
        if (key == "association") {
            key = "&minus;log<sub>10</sub>(<i>p</i>)";
            //key = "score";
        }
        if (key == "target") {
            key = "target/gene";
        }
        th += "<th align='middle' class='rotate' " + " id='" + key.replace(
            /\s/g, "_") + "'><div><span>" + key + "</div></span></th>";
    }
    th += "</tr>";
    tbl.innerHTML += th;
    var targetadded = 0;
    var scoreLegend = [
        "Score = 1/7: p &gt; 0.05 in S-PrediXcan and MAGMA but has drug-target bioactivities",
        "Score = 2/7: not significant (p &gt; 0.05/20000), but p &le; 0.05 in MAGMA (not S-PrediXcan)",
        "Score = 3/7: not significant (p &gt; 0.05/20000), but p &le; 0.05 in S-PrediXan (not MAGMA)",
        "Score = 4/7: not significant (p &gt; 0.05/20000), but p &le; 0.05 in S-PrediXcan and MAGMA",
        "Score = 5/7: significant (p &le; 0.05/20000) in MAGMA, not S-PrediXcan",
        "Score = 6/7: significant (p &le; 0.05/20000) in S-PrediXcan, not MAGMA",
        "Score = 7/7: significant  (p &le; 0.05/20000) in both S-PrediXcan and MAGMA"
    ];
    //print target header: content
    for (i = 0; i < targetset.length; i += 1) {
        targetadded += 1;
        tr = "<tr id='" + characterConverter(targetset[i].target) + "'>";
        for (j = 0; j < Object.keys(targetset[i]).length; j += 1) {
            key = Object.keys(targetset[i])[j];
            inner = targetset[i][key];
            var mystyle = "";
            var tissuestring = "";
            var addspan = "";
            var significancestring = "";
            if ((alltissues.indexOf(key) > -1) && !isNaN(inner) && (inner >
                    0.0)) {
                mystyle = "style='background-color:green;'";
                if (Math.abs(inner) >= 4.70813) {
                    significancestring =
                        "Significant (p-value &le; 0.05/20000)";
                } else {
                    significancestring =
                        "Not significant (p-value &gt; 0.05/20000)";
                }
                tissuestring = "S-PrediXcan zscore = " + inner + "<br>" +
                    "Green cell = positive zscore" + "<br>" +
                    "Prediction = upregulated in " + key + "<br>" +
                    significancestring;
                addspan = "<span class='tooltiptext'>" + tissuestring +
                    "</span>";
            } else if ((alltissues.indexOf(key) > -1) && !isNaN(inner) &&
                inner < 0.0) {
                mystyle = "style='background-color:red;'";
                if (Math.abs(inner) >= 4.70813) {
                    significancestring =
                        "Significant (p-value &le; 0.05/20000)";
                } else {
                    significancestring =
                        "Not significant (p-value &gt; 0.05/20000)";
                }
                tissuestring = "S-PrediXcan zscore = " + inner + "<br>" +
                    "Red cell = negative zscore" + "<br>" +
                    "Prediction = downregulated in " + key + "<br>" +
                    significancestring;
                addspan = "<span class='tooltiptext'>" + tissuestring +
                    "</span>";
            } else if (key == "score") {
                mystyle = "style='background-color:#E0E0E0;'";
                addspan = "<span class='tooltiptext'>" + scoreLegend[
                    targetset[i][key] - 1] + "</span>";
            } else {
                mystyle = "style='background-color:#E0E0E0;'";
                tissuestring = "";
                addspan = "";
            }
            if ((key != "target") && (key != "ensembl") && (inner !== "") &&
                !isNaN(inner) && (key != "association") && (key !=
                    "position")) {
                inner = Math.round(inner * 10) / 10;
            }
            if ((key == "association") && (inner !== "") && !isNaN(inner)) {
                inner = Math.round(inner * 100) / 100;
                addspan = "<span class='tooltiptext'>" +
                    "Magma gene-wise association" + "</span>";
            }
            if (key == 'ENSEMBL') {
                addspan = "<span class='tooltiptext'>" +
                    "Experimental: link to tissue profile accross phenotypes in Navigome.com" +
                    "</span>";
            }
            if (key == "target") {
                addspan = "<span class='tooltiptext'>" + inner + "</span>";
                converted = characterConverter(inner) + "tdid";
                tr +=
                    "<td nowrap style='font-weight:bold;' align='middle' " +
                    " class='targettd ellipsis' id='" + converted + "'>" +
                    inner + addspan + "</td>";
            } else {
                tr += "<td nowrap align='middle' " + mystyle +
                    " class='targettd ellipsis'>" + inner + addspan +
                    "</td>";
            }
        }
        tr += "</tr>";
        tbl.innerHTML += tr;
    }
    var cellsdrugs = tbldrugs.getElementsByTagName('td');
    for (i = 0; i < cellsdrugs.length; i += 1) {
        cellsdrugs[i].style.backgroundColor = '#E0E0E0';
    }
    //color target cells by score
    var valvector = [];
    targetadded = 0;
    for (i = 0; i < targetset.length; i += 1) {
        valvector[i] = parseFloat(targetset[i].score);
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
            mycell.style.backgroundColor = getGradColorFromPercentile(
                "#85B0BE", "#CCFFFF", percent);
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
        mycell = document.getElementById(characterConverter(drugset[i].drug) +
            "drugid");
        percent = percentRank(valvectordrugs, valvectordrugs[i]);
        mycell.style.backgroundColor = getGradColorFromPercentile("#85B0BE",
            "#CCFFFF", percent);
    }
    //empty drug association vector
    valvectordrugs = [];
    var mywidth;
    var drugSelector;
    var targetSelector;
    for (i = 0; i < connectionset.length; i += 1) {
        drugSelector = $("#" + characterConverter(connectionset[i].drug));
        targetSelector = $("#" + characterConverter(connectionset[i].target));
        if (drugSelector.length && targetSelector.length) {
            connectors.push({
                from: drugSelector,
                to: targetSelector
            });
            if (connectionset[i].color == "black") {
                mywidth = 2;
                connectionset[i].color = "#00001a";
            } else {
                mywidth = 2;
            }
            connectorcolor.push(connectionset[i].color);
            connectorwidth.push(mywidth);
        }
    }
    // re-connect drugs to targets when dragging drug or target table
    $(".draggable").draggable({
        // event handlers
        start: doNothing,
        drag: connectTables,
        stop: doNothing
    });
    resizeCanvas();
    var tooltipSpan = document.getElementById('tooltip-span');
    tooltipSpan.style.visibility = "hidden";
    $('#canvas').mousemove(function(e) {
        var pos = findPosition(this);
        var x = e.pageX - pos.x;
        var y = e.pageY - pos.y;
        var coord = "x=" + x + ", y=" + y;
        var c = this.getContext('2d');
        var p = c.getImageData(x, y, 1, 1).data;
        var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-
            6);
        tooltipSpan.style.top = (y + 20) + 'px';
        tooltipSpan.style.left = (x + 20) + 'px';
        var tooltiptext = "";
        if (hex == "#0000ff") {
            tooltipSpan.style.visibility = "visible";
            tooltiptext =
                "blue connection = agonist or positive modulator";
            $('#tooltip-span').html(tooltiptext);
        } else if (hex == "#ffa500") {
            tooltipSpan.style.visibility = "visible";
            tooltiptext =
                "orange connection = antagonist or negative modulator";
            $('#tooltip-span').html(tooltiptext);
        } else if (hex == "#a52a2a") {
            tooltipSpan.style.visibility = "visible";
            tooltiptext = "brown connection = partial agonist";
            $('#tooltip-span').html(tooltiptext);
        } else if (hex == "#ff00ff") {
            tooltipSpan.style.visibility = "visible";
            tooltiptext = "magenta connection = modulator";
            $('#tooltip-span').html(tooltiptext);
        } else if (hex == "#00001a") {
            tooltipSpan.style.visibility = "visible";
            tooltiptext =
                "black connection = active against target, unknown mode of action";
            $('#tooltip-span').html(tooltiptext);
        } else if (hex == "#ff0000") {
            tooltipSpan.style.visibility = "visible";
            tooltiptext =
                "red connection = decreases gene expression";
            $('#tooltip-span').html(tooltiptext);
        } else if (hex == "#008000") {
            tooltipSpan.style.visibility = "visible";
            tooltiptext =
                "green connection = increases gene expression";
            $('#tooltip-span').html(tooltiptext);
        } else if (hex == "#808080") {
            tooltipSpan.style.visibility = "visible";
            tooltiptext =
                "grey connection = unknown influence on gene expression (reported as positive or negative in our data)";
            $('#tooltip-span').html(tooltiptext);
        } else {
            tooltipSpan.style.visibility = "hidden";
            $('#tooltip-span').empty();
        }
    });
    tbl.addEventListener("mouseover", function(event) {
        document.getElementById('tooltip-span').style.visibility =
            "hidden";
    }, false);
    document.getElementById("canvas").addEventListener("mouseout", function(
        event) {
        document.getElementById('tooltip-span').style.visibility =
            "hidden";
    }, false);
    // add listener so that connectors are re-drawn when the window is resized
    window.addEventListener("resize", resizeCanvas, false);
}

function addRow() {
    "use strict";
    if ($.trim($('#addhere').html()) === '') {
        throwerr = false;
        $('#addhere').append(
            '<table><tr><th>Drugs/Pathways (required)</th> ' +
            '<td><input id="filedrugs" ' +
            'name="csvdrugs" type="file" ' +
            '/></td></tr><tr><th>Targets (required)</th><td>' +
            '<input id="filetargets" name="csvtargets" ' +
            'type="file"/></td>' +
            '</tr><tr><th>Connections (not required)</th>' +
            '<td><input id="fileconnections" ' +
            'name="csvconnections" ' +
            'type="file" /></td></tr>' +
            '<tr><th colspan="2">' +
            '<a href="working_data_v1.2/example_files.zip">' +
            'Download Example Files</a></th> </tr></table>');
        document.getElementById("filedrugs").addEventListener('change',
            hasSetDrugs, false);
        document.getElementById("filetargets").addEventListener('change',
            hasSetTargets, false);
        document.getElementById("fileconnections").addEventListener(
            'change', hasSetConnections, false);
    } else {
        $('#addhere').empty();
    }
}

function changeLimDrugs() {
    limitdrugs = document.getElementById('changelimitdrugs').value;
}

function changeScoreFilter() {
    scorefilter = document.getElementById('changescorefilter').value;
}

function changeLimTargets() {
    limittargets = document.getElementById('changelimittargets').value;
}

function addRow2() {
    "use strict";
    if (document.getElementById('notdefault2').checked) {
        $('#addhere2').append(
            '<table><tr><td colspan="2">Max. number of drugs (1-1500, default 30):' +
            '<input type="text" value="30" maxlength="4" size="4" oninput="" ' +
            'onblur="if(this.value<1){thi.value=30;}else if(this.value>1500){this.value=1500;}" ' +
            'id="changelimitdrugs" onchange="changeLimDrugs();"></td></tr>' +
            '<tr><td colspan="2">' +
            'Max. number of targets (1-200, default 30):' +
            '<input type="text" value="30" maxlength="4" size="4" ' +
            'oninput=""  onblur="if(this.value<1){this.value=30;}else ' +
            'if(this.value>200){this.value=200;}" id="changelimittargets" ' +
            'onchange="changeLimTargets();"></td></tr>' +
            '<tr><td colspan="2">' +
            '<input type="checkbox" id="radiob" ' +
            'onclick="changePrintAll();"/>' +
            ' Show genes without any connection' +
            '</td></tr><tr><td colspan="2">' +
            '<input type="checkbox" id="radiodrugs" ' +
            'onclick="changePrintAllDrugs();"/>' +
            ' Show drugs without connections in the network' +
            '</td></tr>' + '<tr><td colspan="2">' +
            '<input type="checkbox" id="removeafter" ' +
            'onclick="changeRemoveAfter();"/>' +
            ' Cut drug list after building network (will leave lonely genes)' +
            '</td></tr>' +
            '<tr><td colspan="2">' + 'Filter by association score: ' +
            '<select id="changescorefilter" onchange="changeScoreFilter();" >' +
            '<option value="nofilter" selected>No filter</option>' +
            '<option value="significant">p-value &le; 0.05/20,000 in S-PrediXcan or Magma</option>' +
            '<option value="nominal">p-value &le; 0.05 in S-Predixcan or Magma</option>' +
            '</select></td></tr>' +
            '</table>');
    } else {
        $('#addhere2').empty();
    }
}

function isInArray(value, array) {
    return array.indexOf(value) > -1;
}

function executeFilters() {
    "use strict";
    var i;
    if (filterDrugs === true) {
        drugset = $.grep(drugset, function(element) {
            return drugExistsInAtcList(element.drug);
        });
    }
    if (removeafter === false) {
        drugset = drugset.sort(mycomparator);
        drugset = drugset.slice(0, limitdrugs);
    }
    connectionset = $.grep(connectionset, function(element) {
        return drugExistsInDrugSet(element.drug);
    });
    var removeArray = [];
    if (scorefilter != 'nofilter') {
        if (scorefilter == 'significant') {
            for (i = 0; i < targetset.length; i += 1) {
                if (parseInt(targetset[i].score) < 5) {
                    targetset.splice(i, 1);
                    i--;
                }
            }
        } else if (scorefilter == 'nominal') {
            for (i = 0; i < targetset.length; i += 1) {
                if (parseInt(targetset[i].score) < 2) {
                    targetset.splice(i, 1);
                    i--;
                }
            }
        }
    }
    if (!printall) {
        targetset = $.grep(targetset, function(element) {
            return targetExistsInConnectionSet(element.target);
        });

    } else {
        for (i = 0; i < targetset.length; i += 1) {
            if (targetset[i].target == "") {
                targetset.splice(i, 1);
                i--;
            }
        }
    }
    targetset.sort(fieldSorter(['-score', '-association']));
    targetset = targetset.slice(0, limittargets);
    if (!printalldrugs) {
        connectionset = $.grep(connectionset, function(element) {
            return targetExistsInTargetSet(element.target);
        });
        drugset = $.grep(drugset, function(element) {
            return drugExistsInConnectionSet(element.drug);
        });
    }
    if (removeafter === true) {
        drugset = drugset.sort(mycomparator);
        drugset = drugset.slice(0, limitdrugs);
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
    phenotypefileG = "working_data_v1.2/phenGene-" + tissuecat + "/" +
        phenotypecode;
    phenotypefileD = "working_data_v1.2/phenDrug/" + phenotypecode;
    var problemtarget = false;
    var problemdrug = false;
    var problemconnection = false;
    var errorstring = '';
    var formt;
    $("#export").on("tap", function() {
        capture();
    });
    $("#export").on("touchstart click", function() {
        capture();
    });
    //if user uses own stuff
    if (document.getElementById('notdefault').checked) {
        if (setDrugs && setTargets && !setConnections) {
            alert(
                'No connection provided: we are using default drug/target connections.'
            );
            loadAllConnections();
            $(document).ajaxStop(function() {
                upload();
                uploadTargets();
                executeFilters();
                problemtarget = (targetset.length < 1);
                problemdrug = (drugset.length < 1);
                problemconnection = (connectionset.length < 1);
                if (!problemtarget && !problemdrug && !
                    problemconnection) {
                    //  document.getElementById('formtable').innerHTML = "";
                    formt = document.getElementById('formtable');
                    formt.parentNode.removeChild(formt);
                    document.getElementById('stickydivleft').innerHTML =
                        "<button class='button2' onClick='window.location.reload()'>Go Back</button>";
                    document.getElementById('stickydivright').innerHTML =
                        "<button onclick='capture();' class='button1' id='export'>Make PNG</button>";
                    document.getElementById('footer').innerHTML = "";
                    drawCanvasAndTable();
                } else {
                    $(".progress-btn").removeClass('active');
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
            });
        } else if (setDrugs && setTargets && setConnections) {
            upload();
            uploadConnections();
            uploadTargets();
            $(document).ajaxStop(function() {
                executeFilters();
                problemtarget = (targetset.length < 1);
                problemdrug = (drugset.length < 1);
                problemconnection = (connectionset.length < 1);
                if (!problemtarget && !problemdrug && !
                    problemconnection) {
                    formt = document.getElementById('formtable');
                    formt.parentNode.removeChild(formt);
                    document.getElementById('stickydivleft').innerHTML =
                        "<button class='button2' onClick='window.location.reload()'>Go Back</button>";
                    document.getElementById('stickydivright').innerHTML =
                        "<button onclick='capture();' class='button1' id='export'>Make PNG</button>";
                    document.getElementById('footer').innerHTML = "";
                    drawCanvasAndTable();
                } else {
                    $(".progress-btn").removeClass('active');
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
            });
        } else {
            $(".progress-btn").removeClass('active');
            alert('Please load targets and drugs.');
        }
        //default behaviour:
    } else {
        loadFiles();
        $.ajax({
            type: "GET",
            url: phenotypefileG,
            dataType: "text",
            cache: false,
            async: true, // set to false so order of operations is correct
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
            async: true, // set to false so order of operations is correct
            success: function(data) {
                phenotypefileD_exists(data);
            },
            error: function() {
                throwerr = true;
            }
        });
        if (throwerr) {
            alert("This phenotype has not been added yet: no file found");
        }
        $(document).ajaxStop(function() {
            executeFilters();
            problemtarget = (targetset.length < 1);
            problemdrug = (drugset.length < 1);
            problemconnection = (connectionset.length < 1);
            if (!problemtarget && !problemdrug && !problemconnection) {
                formt = document.getElementById('formtable');
                formt.parentNode.removeChild(formt);
                document.getElementById('stickydivleft').innerHTML =
                    "<button class='button2' onClick='window.location.reload()'>Go Back</button>";
                document.getElementById('stickydivright').innerHTML =
                    "<button onclick='capture();' class='button1' id='export'>Make PNG</button>";
                document.getElementById('footer').innerHTML = "";
                drawCanvasAndTable();
            } else {
                $(".progress-btn").removeClass('active');
                if (problemtarget) {
                    errorstring += 'No target info. ';
                }
                if (problemdrug) {
                    errorstring += 'No drug info. ';
                }
                if (problemconnection) {
                    errorstring += 'No connection info.';
                }
                alert('-NO DATA- ' + "try another drug class");
            }
        });
    }

}

function changeConnectionPath() {
    "use strict";
    var e = document.getElementById("selectConnectionPath");
    connectionpath = "working_data_v1.2/" + e.options[e.selectedIndex].value;
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
    phenotypecode = e.options[e.selectedIndex].value;
    phenotypefileG = "working_data_v1.2/phenGene-" + tissuecat + "/" +
        phenotypecode;
    phenotypefileD = "working_data_v1.2/phenDrug/" + phenotypecode;
    throwerr = false;

}

$(document).ready(function() {
    "use strict";
    document.getElementById("drugtr").style.visibility = 'collapse';
    connectionpath =
        "working_data_v1.2/connections_identified_or_not_noid_bioact";
    uploadATC();
    uploadATCDrug();
    uploadPhenotypes();
    uploadTissueCategories();
    $("#selectATC").chosen({
        no_results_text: "Oops, nothing found!"
    });
    $("#selectATCdrug").chosen({
        no_results_text: "Oops, nothing found!"
    });
    $("#selectPhenotype").chosen({
        no_results_text: "Oops, nothing found!"
    });
    $("#selectTissueCategory").chosen({
        no_results_text: "Oops, nothing found!"
    });
    $("#selectConnectionPath").chosen({
        "disable_search": true
    });
    $(".progress-btn").on("click", function() {
        var progressBtn = $(this);
        if (!progressBtn.hasClass("active") && !throwerr) {
            progressBtn.addClass("active");
            setTimeout(function() {
                drawIt();
            }, 1000);
        }
    });
});

function drawCanvasAndLoadFiles() {
    "use strict";
    loadFiles();
    drawCanvasAndTable();
}
