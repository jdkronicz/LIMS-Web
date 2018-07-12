//Copyright 2014 PennDOT BPR
//This JavaScript file provides functionality for the AskRegis pages.

/* Find DOM elements which contain the given class */
function getElementsByClassName(className, tag, elm) {
    var testClass = new RegExp("(^|\\s)" + className + "(\\s|$)");
    var tag = tag || "*";
    var elm = elm || document;
    var elements = (tag == "*" && elm.all) ? elm.all : elm.getElementsByTagName(tag);
    var returnElements = [];
    var current;
    var length = elements.length;
    for (var i = 0; i < length; i++) {
        current = elements[i];
        if (testClass.test(current.className)) {
            returnElements.push(current);
        }
    }
    return returnElements;
}

/* Maps the records selected from the results of an AskRegis query */
function MapRecords(all, sourcePage, queryType, defaultLayer) {

    if (all == 0) {

        var checkedIDs = document.getElementById("checkedIDs");
        selectedrecs = checkedIDs.value;

        if (selectedrecs.length == 0) {
            alert('At least one record must be selected.  If nothing is checked, nothing can be mapped.');
            return;
        }
    }
    var strMapIt = new String('');
    strMapIt = '../Map/Map.aspx';
    strMapIt = strMapIt + '?AOI=MapBySite';
    strMapIt = strMapIt + '&MapbySite=1';
    strMapIt = strMapIt + '&SelectSite=' + queryType;
    strMapIt = strMapIt + '&Features=' + defaultLayer;

    // Display a wait image back on the map page
    if (sourcePage == "aoi") {

        if (window.parent.opener.window.frames.mapQuery.imgCover.style.visibility == 'visible') {
            window.parent.opener.window.parent.frames('fraMap').window.frmMap.imgWait.style.visibility = 'visible';
        }
        window.parent.opener.window.frames.mapQuery.imgWait.style.visibility = 'visible';
        window.parent.opener.window.frames.mapQuery.imgCover.style.visibility = 'visible';
    }
    else {

        window.parent.opener.window.parent.frames('fraMap').window.frmMap.imgWait.style.visibility = 'visible';
        window.parent.opener.window.parent.frames('fraQuery').window.mapQuery.imgWait.style.visibility = 'visible';
        window.parent.opener.window.parent.frames('fraQuery').window.mapQuery.imgCover.style.visibility = 'visible';
    }

    var selectedrecs = new String('');
    if (all == 0) {
        var checkedIDs = document.getElementById("checkedIDs");
        selectedrecs = checkedIDs.value;
    }
    else {
        var nonLinearRecs = document.getElementById("nonLinearRecs");
        selectedrecs = nonLinearRecs.value;

    }
    MapChecked.action = strMapIt;
    MapChecked.method = 'post';
    MapChecked.target = 'fraMap';

    var mapChecked = document.getElementById("MapChecked");

    if (mapChecked.siteno == null) {
        var element = document.createElement("input");
        element.setAttribute("name", "siteno");
        element.setAttribute("type", "hidden");
        element.setAttribute("id", "siteno");


        MapChecked.appendChild(element);
    }

    MapChecked.siteno.value = selectedrecs;
    MapChecked.submit();
}

/* Mark row as checked */
 function checkRow(cb,id) {
     var checkedIDs = document.getElementById("checkedIDs");
     var list = '';
     if (checkedIDs.value != '') {
         list = ',' + checkedIDs.value + ',';
     }

     if (cb.checked) {

         if (list.toLowerCase() != '') {
             list = (list.indexOf(',' + id + ',') == -1) ? list + id + ',' : list;
         } else {
             list = ',' + id + ',';
         }
     }
     else {
         list = list.replace(',' + id + ',', ',');

         if (list == ',') {
             list = '';
         }
     }
     checkedIDs.value = list.substring(0,list.length - 1).substring(1);
     
     
 }

/* Check all records on the page */
 function CheckPage(chkPage) {
     for (var i=0;i<ogResults.Rows.length;i++)
     {
        var chkname = 'chkSelect_' + i;
        var chkSelect = document.getElementById(chkname);

        if (chkSelect != null) {
            if (chkPage.checked != chkSelect.checked) {
                chkSelect.checked = chkPage.checked;
                checkRow(chkSelect, ogResults.Rows[i].Cells["KEYVALUE"].Value);
            }
        }
        
     }
}

/* Opens the ViewChecked.aspx page */
function ViewChecked() {
    var checkedIDs = document.getElementById("checkedIDs");

    if (checkedIDs.value != '') {
        window.open('ViewChecked.aspx', 'ViewChecked', 'left=' + (window.screenLeft + event.clientX - 75) + ',width=150,height=300,status=no,scrollbars=yes,resizable=no');
    } else {
        alert('No records have been selected.');
    }

}

/* Opens the CustomerLayers.aspx page */
function MapCustomLayer(source) {
    var arySites = new Array();
    var checkedIDs = new String(document.getElementById("checkedIDs").value);
    arySites = checkedIDs.split(',');
    if (arySites.length > 1000) {
        alert('Cannot create a layer with more than 1000 sites.\n\nPlease uncheck some sites and try again.');
    }
    window.open('../Map/CustomLayers.aspx?source=' + source, 'WinChgCol', 'width=475,height=350,scrollbars=yes,resizable=no');
}

/* Open SetDefaultLayer.aspx page */
function OpenSetDefaultLayer() {
    window.open("../map/SetDefaultLayer.aspx?URL=" + document.URL, "SetDefaultLayers", "left=50,top=50,height=450,width=800,status=yes,menubar=0,scrollbars=1,resizable=1")
}

/* Open AdvancedSearch2.aspx page */
function AdvancedSearch() {
    window.location = "AdvancedSearch2.aspx"
}

/* Open Search.aspx page */
function BasicSearch() {
    window.location = "Search.aspx"
}

