//Copyright 2014 PennDOT BPR
// Mapping javascript functions that will handle the various actions user may choose,
// such as Zoom, Pan, Get Distance, etc.
// for use with the Flash Map Viewer Control

var g_segBox;
var g_offsetBox;
var g_cty;
var g_sr;
var g_sideind;
var g_IsRestriction;
var g_IsInterstate;

var kx = 0;

var selectedMapLayers = "";

/* Toggles Hot Spots on */
function ToggleHotSpots(bEnabled) {
    //g_objSvg.setHotspotsEnabled(null, bEnabled);
}

/* Display waiting image in map area */
function SetMapToWaiting(sMessage) {
    SetMessage(sMessage);
    document.getElementById('imgWait').style.visibility = 'visible';
}

/* Hide waiting image in map area */
function SetMapToReady() {
    SetMessage('');
    document.getElementById('imgWait').style.visibility = 'hidden';
}

/* Display a message below the map area */
function SetMessage(sMessage) {
    var hasInnerText = (document.getElementsByTagName("body")[0].innerText != undefined) ? true : false;
    if (hasInnerText) {
        document.getElementById('PromptArea').innerText = sMessage;
    }
    else {
        document.getElementById('PromptArea').textContent = sMessage;
    }
}

/* Zoom to previous extent */
function ZoomToPrevious() {
    zoomChange(-1);
}

/* Zoom to next extent */
function ZoomToNext() {
    zoomChange(1);
}

/* Collect an area or point to zoom in/out with */
function GetMapCoords(opt) {
    switch (opt) {
        case 'zoombox':
            SetMessage('Click two corners of a box and the map will zoom to that extent...');
            _flashMapView.geometryCaptureService.cmdCaptureRectangle("callbackGetZoomBox");
            break;

        case 'zoomout':
            SetMessage('Click on the map, and the map will zoom out and center on the point clicked...');
            _flashMapView.geometryCaptureService.cmdCapturePoint("callbackGetZoomOut");
            break;

        case 'zoomin':
            SetMessage('Click on the map, and the map will zoom in and center on the point clicked...');
            _flashMapView.geometryCaptureService.cmdCapturePoint("callbackGetZoomIn");
            break;
    }
}
function callbackGetZoomIn(e) {
    var str;
    SetMapToWaiting("Map is regenerating...Please wait...");
    MakeMap('ZOOMIN', VertsToString(e.target.vertices, "|"));
}
function callbackGetZoomOut(e) {
    var str;
    SetMapToWaiting("Map is regenerating...Please wait...");
    MakeMap('ZOOMOUT', VertsToString(e.target.vertices, "|"));
}
function callbackGetZoomBox(e) {
    var str;
    SetMapToWaiting("Map is regenerating...Please wait...");
    zoomBoxAjax(mss, VertsToString(e.target.vertices, "|"), true);
}

/* Regenerate map to FIT */
function FitMap() {
    SetMapToWaiting("Map is regenerating...Please wait...");
    MakeMap('main', null);
}

/* Regenerate map to a selected center point */
function CenterMap() {
    SetMessage('Click point on map to re-center map to...');
    _flashMapView.geometryCaptureService.cmdCapturePoint("callbackCenterMap");
}
function callbackCenterMap(e) {
    var str;
    SetMapToWaiting("Map is regenerating...Please wait...");
    MakeMap('CENTER', VertsToString(e.target.vertices, "|"));
}

/* Regenerate map to FIT */
function RefreshMap() {
    //GetSelectedLayersNew();
    MakeMap("FIT", null);
}

/* Pan the map */
function DoPan(dir) {
    SetMapToWaiting('Map is regenerating...Please wait...');
    MakeMap('PAN', dir);
}

/* Cancel current map selection action */
function CancelPublicMapAction() {
    _flashMapView.geometryCaptureService.cancelCmdCapture();
    _flashMapView.setAutoRepeat(true);
    _flashMapView.cmdSelectFeature("locateLayerCallback");
    SetMapToReady();
}

//Straight line Calculation of Measure
function GetDistanceMeasure() {
    SetMessage('Click 2 points to draw the line to measure...');
    _flashMapView.geometryCaptureService.cmdCaptureLine("callbackGetDistanceMeasure");

}
function callbackGetDistanceMeasure(e) {
    var str;
    var meters;
    var feet;
    var miles;
    SetMessage("");
    meters = CalcDistance(e.target.vertices[0], e.target.vertices[1], e.target.vertices[2], e.target.vertices[3]);
    meters = meters.toFixed(3);
    miles = meters * 0.0006215;
    miles = miles.toFixed(3);
    feet = Math.round(miles * 5280);
    feet = feet.toFixed(3);
    str = meters + '   meters' + '\n' +
			feet + '   feet' + '\n' +
			miles + '   miles';
    alert(str);
}

/* Calculate the distance between two points */
function CalcDistance(x1, y1, x2, y2) {
    var dx = 0.0;
    var dy = 0.0;
    var fResult = 0.0;

    dx = x2 - x1;
    dy = y2 - y1;
    fResult = Math.sqrt(((dx * dx) + (dy * dy)));
    return fResult;
}

//Polygon Calculation of Measure
function GetAreaMeasure() {
    SetMessage('Click and draw a polygon to measure area...double-click last point to end...');
    _flashMapView.geometryCaptureService.cmdCapturePolygon("callbackGetAreaMeasure");
}
function callbackGetAreaMeasure(e) {
    var str;
    var meters;
    var feet;
    var acres;
    var miles;
    var arrCoords;
    var perimM;
    var perimF;
    var perimMiles;

    SetMessage('');
    meters = CalcAreaOfPoly(e.target.vertices);
    meters = meters.toFixed(2);
    feet = meters / 0.09290304;
    feet = feet.toFixed(2);
    acres = meters / 4046.8564224;
    acres = acres.toFixed(2);
    miles = meters / 2589988.11;
    miles = miles.toFixed(2);
    perimM = CalcLineMeasure(e.target.vertices);
    perimM = perimM.toFixed(2);
    perimMiles = perimM * 0.0006215;
    perimMiles = perimMiles.toFixed(2);
    perimF = Math.round(perimMiles * 5280);
    str = 'AREA:' + '\n'
    str += Math.abs(meters) + '   sq. meters' + '\n' +
            Math.abs(miles) + '   sq. miles' + '\n' +
            Math.abs(acres) + '   acres' + '\n\n';
    str += 'PERIMETER:' + '\n';
    str += perimM + '   meters' + '\n' +
            perimF + '   feet' + '\n' +
            perimMiles + '   miles';
    alert(str);
}

/* Calculate the Area of a Polygon */
function CalcAreaOfPoly(arrCoords) {
    var x = 1;
    var y = 0;
    var numV;
    var val = 0.0;

    numV = arrCoords.length / 2;
    while (x < numV) {
        val += ((arrCoords[y] * arrCoords[y + 3]) - (arrCoords[y + 2] * arrCoords[y + 1]));
        y++;
        y++;
        x++;
    }
    val = val / 2;
    return val;
}

//PolyLine Calculation of Measure
function GetPolyLineMeasure() {

    SetMessage('Click and draw a line to measure area...double-click last point to end...');
    _flashMapView.geometryCaptureService.cmdCapturePolyline("callbackGetPolyLineMeasure");

}
function callbackGetPolyLineMeasure(e) {
    var str;
    var meters;
    var feet;
    var miles;
    var arrCoords;

    SetMessage('');

    meters = CalcLineMeasure(e.target.vertices);
    meters = meters.toFixed(2);
    miles = meters * 0.0006215;
    miles = miles.toFixed(3);
    feet = Math.round(miles * 5280);
    feet = feet.toFixed(3);
    str = meters + '   meters' + '\n' +
			feet + '   feet' + '\n' +
			miles + '   miles';
    alert(str);
}

/* Calculate distance of multi-line string */
function CalcLineMeasure(arrCoords) {
    var x = 1;
    var y = 0;
    var numV;
    var val = 0.0;

    numV = arrCoords.length / 2;
    while (x < numV) {
        val += CalcDistance(arrCoords[y], arrCoords[y + 1], arrCoords[y + 2], arrCoords[y + 3]);
        y++;
        y++;
        x++;
    }
    return val;
}

/* Calculate the width in meters displayed on the map */
function calcScreenMapMeters() {
    var pixelWidth = 742;
    var PixelInches = (pixelWidth / 96);
    var totalMeters = PixelInches * 0.0254;
    theScreenMapMeters = 1 / totalMeters;
}

/* Calculate values for display on the ScaleBar below the map */
function CalcScaleBar(coords, scale) {
    var suTextMid = null;
    var suTextEnd = null;
    var pixelWidth = 742;

    var coordArray = coords.split("|");
    var mapWidth = Math.abs(parseFloat(coordArray[0]) - parseFloat(coordArray[2]));

    var scaleRatio = theScreenMapMeters * (pixelWidth * scale);
    mapScale = scaleRatio;
    var inMeters = scale * 130;  //130 represents the pixel width of the scale bar.
    var inFeet = Math.round(inMeters * 3.2808399, 0);
    var inMiles = Math.round(inMeters * 0.0006215, 2);

    if (inMiles >= 2) {
        suTextEnd = inMiles + " mi";
        suTextMid = Math.round(inMiles / 2, 2) + " mi";
    } else {
        suTextEnd = inFeet + " ft";
        suTextMid = Math.round(inFeet / 2, 0) + " ft";
    }
    document.getElementById('scaleUnits2').innerHTML = suTextMid;
    document.getElementById('scaleUnits').innerHTML = suTextEnd;
    currentMapScale = mapScale;
}


//Display Lat/Long Location
function DisplayLatLongLocation() {
    SetMessage('Click location to display in lat/long...');
    _flashMapView.geometryCaptureService.cmdCapturePoint("callbackDisplayLatLong");

}
function callbackDisplayLatLong(e) {
    redLineArray.push({ type: 'lat/lon', vertices: e.target.vertices, text: "testing\nWith newLine" });

    GetLatLong(redLineArray.length - 1, VertsToString(e.target.vertices, "|"));

}

/* Reset redlines on map */
function resetRedlines() {
    try {
        var rlSvc = _flashMapView.redlineService;
        var RLs = redLineArray;
        rlSvc.remove(null, null);
        for (var i = 0; i < RLs.length; ++i) {
            switch (RLs[i].type) {
                case 'lat/lon':
                    var fontStyle = {
                        fillOpacity: 0.25,
                        fillColor: 0xEFE9BA,
                        strokeColor: 0x008080,
                        fontColor: 0x2F6F9D,
                        fontSize: 12,
                        fontFamily: "Wingdings",
                        fontBold: true,
                        haloColor: 16777215,
                        haloWidth: 0
                    };
                    var textStyle = {
                        fontSize: 20,
                        fontFamily: "Arial",
                        fontColor: 0x000000,
                        fontBold: true
                    };
                    var scale = _flashMapView.transformationService.getParameters().getDisplayToStorageScale();
                    var fontVerts = [RLs[i].vertices[0] - (6 / scale), RLs[i].vertices[1] + (6 / scale)];
                    var fontTextVerts = [RLs[i].vertices[0] + (3 / scale), RLs[i].vertices[1] - (3 / scale)];
                    rlSvc.addText({ vertices: fontVerts, style: fontStyle, text: 'u' });
                    rlSvc.addText({ vertices: fontTextVerts, style: textStyle, text: RLs[i].text });
                    break;
                case 'text':
                    rlSvc.addText({ vertices: RLs[i].vertices, text: RLs[i].text });
                    break;
                case 'point':
                    rlSvc.addPoint({ id: RLs[i].id, vertices: RLs[i].vertices, style: RLs[i].style });
                    break;
                default:
            }
        }
    }
    catch (e) {
        window.alert("Processing Error=" + e.toString());
    }
}


//Legend Functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//boolean variable used to determine when to break from recursive function
var legendChkBoxFound = false;

//loop through all the legend entries and set the status of the checkbox
function setLegendCheckBoxStatus() {
    //initialize the legend
    initializeLegend();

    var displayEntries;
    var cnt;
    var le;

    try {
        displayEntries = gObjMapView.legend.getDisplayEntries()
        cnt = displayEntries.getCount();

        //loop through all the legend entries
        for (i = 0; i < cnt; i++) {
            le = displayEntries.item(i);
            if (le.getGroupEntries().getCount() > 0) {
                checkLegendEntryChildren(le, "");
            } else {
                legendChkBoxFound = false;
                setLayerCheckbox(le.getName());
            }
        }
    } catch (e) {
        throw (e);
    }
    finally {
        if (le) le.release();
    }
}

//loop through the child entries and place a check in the children that are visible
function checkLegendEntryChildren(parentLegendEntry, parentValueName) {
    var childrenEntries;
    var groupCount;
    var childEntry;

    try {
        childrenEntries = parentLegendEntry.getDisplayEntries();
        groupCount = childrenEntries.getCount();

        if (parentValueName == "") {
            parentValueName = parentLegendEntry.getName();
        } else {
            parentValueName += "|" + parentLegendEntry.getName();
        }

        //loop through all the legend entries
        var s = 0;
        for (s = 0; s < groupCount; s++) {
            childEntry = childrenEntries.item(s);
            if (childEntry.getGroupEntries().getCount() > 0) {
                checkLegendEntryChildren(childEntry, parentValueName);
            } else {
                legendChkBoxFound = false;
                setLayerCheckbox(parentValueName + "|" + childEntry.getName());
            }
        }
    }
    catch (e) {
        throw (e);
    }
}

//loop through the legend checkbox ids and compare the legend entry name to the id
function setLayerCheckbox(legendEntryName, node) {
    if (!node) {
        var topLevel = ob_getTopLevelList("treeView");
        for (var j = 0; j < topLevel.length; j++) {
            if (legendChkBoxFound == true) {
                return;
            }
            setLayerCheckbox(legendEntryName, topLevel[j]);
        }
        return;
    }
    var children = ob_getChildrenList(node);
    if (children) {
        if (children.length == 0) {
            //parse the id
            var innerHTML = node.innerHTML;

            var idIndex = innerHTML.indexOf("id=");
            var endIdIndex;
            //if the id contains spaces, the id will be wrapped with double quotes
            if (innerHTML.substring(idIndex + 3, idIndex + 4) == "\"") {
                //the id is wrapped in quotes - adjust the start and end indices
                endIdIndex = innerHTML.indexOf("\"", idIndex + 4);
                idIndex = idIndex + 1;
            } else {
                endIdIndex = innerHTML.indexOf(" ", idIndex);
            }

            var chkBoxId = innerHTML.substring(idIndex + 3, endIdIndex);

            if (chkBoxId.indexOf(legendEntryName) != -1) {
                document.getElementById(chkBoxId).checked = true;
                legendChkBoxFound = true;
                return;
            }
        } else {
            for (var i = 0; i < children.length; i++) {
                if (legendChkBoxFound == true) {
                    return;
                }
                setLayerCheckbox(legendEntryName, children[i]);
            }
        }
    }
}

//loop through the legend and uncheck all legend entries
//enable/disable the checkboxes based on current map scale
function initializeLegend(node) {
    if (!node) {
        var topLevel = ob_getTopLevelList("treeView");
        for (var j = 0; j < topLevel.length; j++) {
            initializeLegend(topLevel[j]);
        }
        return;
    }
    var children = ob_getChildrenList(node);
    if (children) {
        if (children.length == 0) {
            //parse the id
            var innerHTML = node.innerHTML;

            var idIndex = innerHTML.indexOf("id=");
            var endIdIndex;
            //if the id contains spaces, the id will be wrapped with double quotes
            if (innerHTML.substring(idIndex + 3, idIndex + 4) == "\"") {
                //the id is wrapped in quotes - adjust the start and end indices
                endIdIndex = innerHTML.indexOf("\"", idIndex + 4);
                idIndex = idIndex + 1;
            } else {
                endIdIndex = innerHTML.indexOf(" ", idIndex);
            }

            var chkBoxId = innerHTML.substring(idIndex + 3, endIdIndex);
            document.getElementById(chkBoxId).checked = false;

            //enable and disable the checkboxes based on the map scale
            if (isScaleWithinRange(innerHTML)) {
                document.getElementById(chkBoxId).disabled = '';
            } else {
                document.getElementById(chkBoxId).disabled = 'disabled';
            }
        } else {
            for (var i = 0; i < children.length; i++) {
                initializeLegend(children[i]);
            }
        }
    }
}

// BEL 2948 -- Merge layers functionality
// Finds next currently loaded layer (in display entry order) AFTER the passed
// in display entry index. Returns null if there are no layers currently loaded
// after the display index passed in.
function getNextLoadedLegendEntryAfter(index) {
    var leName = null;
    var deIndex = null;
    var saveIndex = 9999;

    // Get this list of currently loaded layers from map view object.
    var loadedDisplayEntries = gObjMapView.legend.getDisplayEntries();
    for (var i = 0; i < loadedDisplayEntries.getCount(); i++) {

        // For each loaded display entry find its display order if it is in the displayEntries list.
        tempLeName = loadedDisplayEntries.item(i).getName();
        for (var deIndex = 0; deIndex < displayEntries.length; deIndex++) {
            if (displayEntries[deIndex] == tempLeName) {
                    break;
            }
        }
        // Some legend entries are not in the displayEntries list like the
        // Zip Code AOI. In that case the loop above will exit with deIndex 
        // equal to displayEntries.length effectively placing the legend entry
        // at the very end of the display order, which is correct.
        // Note: if more than one are missing display entry order then this code
        // takes the first one it finds which is probably the correct one as
        // the loaded layers from the .getDisplayEntries() call above appear sorted
        // in the actual display order.


        // If tempLeName's display order places it more closely after the
        // passed in index then what we got in an earlier loop, save it.
        if (deIndex < displayEntries.length && deIndex > index && deIndex < saveIndex) {
            saveIndex = deIndex;
            leName = tempLeName;
        }
    }

    // If leName is still null it means there was no currently
    // loaded layer in the display order after the passed in layer.
    return leName;
}

//returns true if the current map scale falls within the min and max scale for a given layer
function isScaleWithinRange(nodeInnerHTML) {
    var innerHTML = nodeInnerHTML;
    var valueIndex = innerHTML.indexOf("value=");
    var endValueIndex = innerHTML.indexOf(" ", valueIndex);
    var scaleRange = innerHTML.substring(valueIndex + 6, endValueIndex)

    // don't disable the label layers
    if (scaleRange == "LabelWebShields" || scaleRange == "LabelWebTxt") {
        return true;
    }

    scaleRange = scaleRange.replace(/"/g, "");  // Remove double quotes when present
    var minScale = scaleRange.substring(0, scaleRange.indexOf("|"))
    var maxScale = scaleRange.substring(scaleRange.indexOf("|") + 1)

    if (minScale <= currentMapScale && currentMapScale <= maxScale) {
        return true;
    } else {
        return false;
    }
}

/* Set default layers after selection */
function SetDefaultLayersNew() {
    selectedMapLayers = "";
    GetDefaultLayers();
    saveDefaultLayersAjax(selectedMapLayers);
}

//this function loops through the legend treeview control and builds a CSV list of all the selected layers
function GetDefaultLayers(node) {
    if (!node) {
        var topLevel = ob_getTopLevelList("treeView");
        for (var j = 0; j < topLevel.length; j++) {
            GetDefaultLayers(topLevel[j]);
        }
        return;
    }
    var children = ob_getChildrenList(node);
    if (children) {
        if (children.length == 0) {
            //parse the id
            var innerHTML = node.innerHTML;

            var idIndex = innerHTML.indexOf("id=");
            var endIdIndex;
            //if the id contains spaces, the id will be wrapped with double quotes
            if (innerHTML.substring(idIndex + 3, idIndex + 4) == "\"") {
                //the id is wrapped in quotes - adjust the start and end indices
                endIdIndex = innerHTML.indexOf("\"", idIndex + 4);
                idIndex = idIndex + 1;
            } else {
                endIdIndex = innerHTML.indexOf(" ", idIndex);
            }

            var chkBoxId = innerHTML.substring(idIndex + 3, endIdIndex);

            //if the layer is selected, add the id to the list of selected map layers
            if (document.getElementById(chkBoxId).checked) {
                //if the selected layer is the selected AOI, then skip it
                var selectedIndex = chkBoxId.toUpperCase().indexOf("SELECTED");
                if (selectedIndex == -1) {
                    if (selectedMapLayers == "") {
                        selectedMapLayers = chkBoxId
                    } else {
                        selectedMapLayers = selectedMapLayers + "," + chkBoxId
                    }
                }
            }
        } else {
            for (var i = 0; i < children.length; i++) {
                GetDefaultLayers(children[i]);
            }
        }
    }
}

//Toggle Map Layer - this function is called when a layer is checked/unchecked in the legend
function ToggleLayerOnOff(LayerCheckbox, index) {
    var displayEntries;
    var cnt;
    var le;
    var layerIsLoaded = false;  // boolean flag used to determine if we need to retrieve the layer from the mapping web service

    try {

        var layerIdArray = LayerCheckbox.id.split("|");

        displayEntries = gObjMapView.legend.getDisplayEntries()
        cnt = displayEntries.getCount();

        var isAOILayer = false;
        if (LayerCheckbox.id.toUpperCase().indexOf("SELECTED") != -1) {
            isAOILayer = true;
        }

        //loop through all the legend entries and turn the layer on/off
        for (i = 0; i < cnt; i++) {
            le = displayEntries.item(i);
            if (le.getGroupEntries().getCount() > 0) {
                layerIsLoaded = toggleChildLayer(le, LayerCheckbox, "", layerIsLoaded)
            } else {
                if (isAOILayer) {
                    if (LayerCheckbox.id == le.getName()) {
                        layerIsLoaded = true;
                        if (!LayerCheckbox.checked) {
                            le.setDisplayMode(gObjMapView.DisplayMode.off);
                        } else {
                            le.setDisplayMode(gObjMapView.DisplayMode.on);
                        }
                    }
                } else {
                    if (LayerCheckbox.id.indexOf(le.getName()) != -1) {
                        layerIsLoaded = true;
                        if (!LayerCheckbox.checked) {
                            le.setDisplayMode(gObjMapView.DisplayMode.off);
                        } else {
                            le.setDisplayMode(gObjMapView.DisplayMode.on);
                        }
                    }
                }
            }
        }

        //update the add and delete layer lists
        if (LayerCheckbox.checked) {
            updateLayerLists(LayerCheckbox.id, "true");
            if (!layerIsLoaded) { MakeLayerMap(LayerCheckbox.id, index); }
        } else {
            updateLayerLists(LayerCheckbox.id, "false");
        }
    }
    catch (e) {
        throw (e);
    }
    finally {
        if (le) le.release();
    }
}

//Toggle Map Layer local - this function is called when a layer is 
// checked/unchecked in the legend, only used for labels and selected feature
function ToggleLocalLayerOnOff(LayerCheckbox) {
    var le;
    try {
        //get layer id, then legend
        //alert(LayerCheckbox.id.substring(3));
        le = gObjMapView.legend.getDisplayEntries().item(LayerCheckbox.id.substring(3));
        if (le !== null) {
            if (LayerCheckbox.checked) {
                le.setDisplayMode(gObjMapView.DisplayMode.on);
            } else {
                le.setDisplayMode(gObjMapView.DisplayMode.off);
            }
        }
    }
    catch (e) {
    }
    finally {
        if (le) le.release();
    }
}

//recursively search child nodes for the selected layer
function toggleChildLayer(parentLegendEntry, selectedLayer, parentValueName, layerIsLoaded) {
    var childrenEntries;
    var groupCount;
    var childEntry;
    var childIsLoaded = layerIsLoaded;

    try {
        childrenEntries = parentLegendEntry.getDisplayEntries();
        groupCount = childrenEntries.getCount();

        if (parentValueName == "") {
            parentValueName = parentLegendEntry.getName();
        } else {
            parentValueName += "|" + parentLegendEntry.getName();
        }

        //loop through all the legend entries
        var s = 0;
        for (s = 0; s < groupCount; s++) {
            childEntry = childrenEntries.item(s);
            if (childEntry.getGroupEntries().getCount() > 0) {
                childIsLoaded = toggleChildLayer(childEntry, selectedLayer, parentValueName, childIsLoaded);
            } else {
                if (selectedLayer.id.indexOf(parentValueName + "|" + childEntry.getName()) != -1) {
                    childIsLoaded = true;
                    if (!selectedLayer.checked) {
                        childEntry.setDisplayMode(gObjMapView.DisplayMode.off)
                    } else {
                        childEntry.setDisplayMode(gObjMapView.DisplayMode.on)
                    }
                }
            }
        }

        return childIsLoaded;
    }
    catch (e) {
        throw (e);
    }
}

//this function updates the add and delete layer lists 
// these lists keep track of which layers are enabled and disabled in the legend
function updateLayerLists(layerName, isEnabled) {
    if ((layerName.indexOf("selected")>=0)||(layerName.indexOf("custom")>=0)){
    return;
    }
    var addLayerList = document.getElementById("addLayerList").value;
    var layerExistsInAddList = (addLayerList.indexOf(layerName) != -1);

    var deleteLayerList = document.getElementById("deleteLayerList").value;
    var layerExistsInDeleteList = (deleteLayerList.indexOf(layerName) != -1);

    if (isEnabled == "true") {
        //the layer is enabled in the legend
        if (!layerExistsInAddList) {
            //if the layer does not exist in the addLayerList, then add it
            document.getElementById("addLayerList").value = document.getElementById("addLayerList").value + layerName + ",";
        }
        if (layerExistsInDeleteList) {
            //if the layer exists in the deleteLayerList, then remove it
            document.getElementById("deleteLayerList").value = document.getElementById("deleteLayerList").value.replace(layerName + ",", "");
        }
    } else {
        //the layer is disabled in the legend
        if (layerExistsInAddList) {
            //if the layer exists in the addLayerList, then remove it
            document.getElementById("addLayerList").value = document.getElementById("addLayerList").value.replace(layerName + ",", "");
        }
        if (!layerExistsInDeleteList) {
            //if the layer does not exist in the deleteLayerList, then add it
            document.getElementById("deleteLayerList").value = document.getElementById("deleteLayerList").value + layerName + ",";
        }
    }
}
function addCustomToLegend() {
    //alert(_CustomLayer);
    var _custLayer = _CustomLayerText.split("|");
    for (var i = 0; i < _custLayer.length-1; i++) {
        var leName = _custLayer[i].split(",")[0];
        var _LegendText = _custLayer[i].split(",")[1];
        var customImagePath = _legendImagePath + "/" + leName + ".png";
        //create the html for the legend
        var nodeHTML = buildCustomNode(leName, customImagePath, _LegendText);

        //append to the legend
        ob_t2_Add("root_legendTree", leName, nodeHTML, true);
    } 
    
}
function addSelectedAOIToLegend() {
    //if there is no AOIFeatureType defined, then do nothing
    if (_AOIFeatureType == "") {
        return;
    }

    //get the legend entry name of the selected AOI - this will be the checkbox id
    var leName = getSelectedAOILEName();

    //if the selected AOI is not found in the legend entries then do nothing
    if (leName == "") {
        return;
    }

    //determine if the selected AOI is point, line or polygon
    var aoiImagePath = getSelectedAOIImageName();

    var aoiIndex = getSelectedAOILEIndex();

    //create the html for the legend
    var nodeHTML = buildAOINode(leName, index, aoiImagePath);

    //append to the legend
    ob_t2_Add("root_legendTree", "selectedID", nodeHTML, true);
}


function getSelectedAOILEName() {
    var displayEntries;
    var cnt;
    var le;
    var legendEntryName = "";

    try {
        displayEntries = gObjMapView.legend.getDisplayEntries()
        cnt = displayEntries.getCount();

        //loop through all the legend entries
        for (i = 0; i < cnt; i++) {
            le = displayEntries.item(i);

            if (le.getGroupEntries().getCount() > 0) {
                legendEntryName = checkChildren(le, "");
                if (legendEntryName != "") {
                    i = cnt;
                }
            } else {
                var tempName = le.getName().toUpperCase();
                var selectedIndex = tempName.indexOf("SELECTED");

                if (selectedIndex != -1) {
                    legendEntryName = le.getName();
                    i = cnt;
                }
            }
        }
    } catch (e) {
        legendEntryName = "";
    }
    finally {
        if (le) le.release();
        return legendEntryName;
    }
}

function getSelectedAOILEIndex() {
    var displayEntries;
    var cnt;
    var le;
    var legendEntryName = "";

    try {
        displayEntries = gObjMapView.legend.getDisplayEntries()
        cnt = displayEntries.getCount();

        //loop through all the legend entries
        for (i = 0; i < cnt; i++) {
            le = displayEntries.item(i);
            if (le.getGroupEntries().getCount() > 0) {
                // TODO: Need to check children
            } else {
                var tempName = le.getName().toUpperCase();
                var selectedIndex = tempName.indexOf("SELECTED");
                if (selectedIndex != -1) {
                    index = i;
                    break;
                }
            }
        } 
    } catch (e) {
        index = -1;
    }
    finally {
        if (le) le.release();
        return index;
    }
}

function addCustomLayerToLegend() {
    //if there is no AOIFeatureType defined, then do nothing
    //get the legend entry name of the selected AOI - this will be the checkbox id
    var leName = getCustomLeName("REPGEN_SPATIAL_TRACKER");

    //if the selected AOI is not found in the legend entries then do nothing
    if (leName == "") {
        return;
    }

    //determine if the selected AOI is point, line or polygon
    var customImagePath = _legendImagePath + "/" + leName + ".png";

    var leIndex = getCustomLeIndex("REPGEN_SPATIAL_TRACKER");

    //create the html for the legend
    var nodeHTML = buildCustomNode(leName, leIndex, customImagePath,"Spatial");

    //append to the legend
    ob_t2_Add("root_legendTree", leName, nodeHTML, true);
}

/* Get custom legend entry name */
function getCustomLeName(CustomLeName) {
    var displayEntries;
    var cnt;
    var le;
    var legendEntryName = "";

    try {
        displayEntries = gObjMapView.legend.getDisplayEntries()
        cnt = displayEntries.getCount();

        //loop through all the legend entries
        for (i = 0; i < cnt; i++) {
            le = displayEntries.item(i);

            if (le.getGroupEntries().getCount() > 0) {
                legendEntryName = checkChildren(le, "");
                if (legendEntryName != "") {
                    i = cnt;
                }
            } else {
                var tempName = le.getName().toUpperCase();
                var selectedIndex = tempName.indexOf(CustomLeName);

                if (selectedIndex != -1) {
                    legendEntryName = le.getName();
                    i = cnt;
                }
            }
        }
    } catch (e) {
        legendEntryName = "";
    }
    finally {
        if (le) le.release();
        return legendEntryName;
    }
}

/* Get custom legend entry index from name */
function getCustomLeIndex(CustomLeName) {
    var displayEntries;
    var cnt;
    var le;
    var legendEntryName = "";

    try {
        displayEntries = gObjMapView.legend.getDisplayEntries()
        cnt = displayEntries.getCount();

        //loop through all the legend entries
        for (i = 0; i < cnt; i++) {
            le = displayEntries.item(i);
            if (le.getGroupEntries().getCount() > 0) {
                // TODO: Need to check children
            } else {
                var tempName = le.getName().toUpperCase();
                var selectedIndex = tempName.indexOf(CustomLeName);
                if (selectedIndex != -1) {
                    index = i;
                    break;
                }
            }
        } 
    } catch (e) {
        index = -1;
    }
    finally {
        if (le) le.release();
        return index;
    }
}

//loop through the child entries and search for the selected AOI
function checkChildren(parentLegendEntry, parentValueName) {
    var childrenEntries;
    var groupCount;
    var childEntry;

    try {
        childrenEntries = parentLegendEntry.getDisplayEntries();
        groupCount = childrenEntries.getCount();

        if (parentValueName == "") {
            parentValueName = parentLegendEntry.getName();
        } else {
            parentValueName += "|" + parentLegendEntry.getName();
        }

        //loop through all the legend entries
        var s = 0;
        for (s = 0; s < groupCount; s++) {
            childEntry = childrenEntries.item(s);
            if (childEntry.getGroupEntries().getCount() > 0) {
                checkChildren(childEntry, parentValueName);
            } else {
                var tempName = childEntry.getName().toUpperCase();
                var selectedIndex = tempName.indexOf("SELECTED");

                if (selectedIndex != -1) {
                    return parentValueName + "|" + childEntry.getName();
                } else {
                    return "";
                }
            }
        }
    }
    catch (e) {
        throw (e);
    }
}

/* Get selected aoi image name */
function getSelectedAOIImageName() {
    var imagePath = _legendImagePath;
    imagePath = imagePath + "/" + _AOIFeatureType + ".png";
    return imagePath;
}

/* Build an AOI node */
function buildAOINode(leName, index, imagePath) {
    var legendTxt = "Selected AOI";
    if (_AOILegendText != "") {
        legendTxt = _AOILegendText;
    }

    var aoiHTML = "<input class='c' type='checkbox' id='" + leName +
        "' value='1|99999999' checked='checked' onclick='ob_t2c(this);ToggleLayerOnOff(this," + index + ");ShowLayer(this);' " + ">" +
        "&nbsp;<img src='" + imagePath + "' />&nbsp;&nbsp;" + legendTxt;

    return aoiHTML;
}

/* Add a custom node */
function buildCustomNode(leName, index, imagePath, LegendText) {
    var legendTxt = "Custom Layer";
    if (LegendText != "") {
        legendTxt = LegendText;
    }

    var customHTML = "<input class='c' type='checkbox' id='" + leName +
        "' value='1|99999999' checked='checked' onclick='ob_t2c(this);ToggleLayerOnOff(this," + index + ");ShowLayer(this);' " + ">" +
        "&nbsp;<img src='" + imagePath + "' />&nbsp;&nbsp;" + legendTxt;

    return customHTML;
}

//End of Legend Functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* Display waiting dialog for map */
function LoadMapWaitingPage(framename, sUrl) {
    this.parent.document.getElementById(framename).contentWindow.location = sUrl;
}

/* Toggle Ortho Layer on/off */
function ToggleOrthos(bOn) {
    var sUrl;
    if (bOn == 'true') {
        sUrl = 'Map.aspx?Action=Orthos&OnOff=off';
    }
    else {
        sUrl = 'Map.aspx?Action=Orthos&OnOff=on';
    }
    SetMapToWaiting("Map is regenerating...Please wait...");
    this.parent.document.getElementById('fraMap').contentWindow.location = sUrl;
    //window.parent.frames['fraMap'].location = sUrl;
}

/* Export map to DGN format */
function ExportToDGN() {
    SetMapToWaiting("Map is exporting...Please wait...");
    this.parent.document.getElementById('fraMap').contentWindow.location = 'Map.aspx?U=Export';
    //window.parent.frames['fraMap'].location = 'Map.aspx?U=Export';
}

//ToDo..check with Shane if this can be removed along with all references
function SetLayerStatusAsOfLastMap() {
    var doc;
    var txtBox;
    var s;
    var chkBoxName;
    var chkBox;
    var arr;
    var keepON = '';

    //doc = this.parent.document.getElementById('fraQuery');
    //txtBox = document.getElementById('txtLayers')

    if (s == '') {
        null;
    } else {
        s = txtBox.value;
        arr = s.split("|");
        for (var i = 0; i < arr.length; i++) {
            chkBoxName = "chk" + arr[i].substr(0, arr[i].length - 2);
            keepON = arr[i].substr(arr[i].length - 1, 1);
            chkBox = document.getElementById(chkBoxName);
            if (chkBox == null) {
                null;
            } else {
                if (keepON == 'F') {
                    chkBox.checked = false;
                    ToggleLayerOnOff(chkBox);   // TODO: 2948 - Merge Layer - We need to pass the index here.
                }
            }
        }
    }
}

/* Save the status of the legends */
function StoreLegendStatus() {
    var doc;
    var txtBox;
    var displayEntries;
    var le;
    var leName;
    var groupName;
    var s2 = '';


    try {
        displayEntries = gObjMapView.legend.getDisplayEntries();
        if (displayEntries == null) {
            s2 = "";
        }
        else {
            var cnt = displayEntries.getCount();
            for (var i = 0; i < cnt; i++) {
                le = displayEntries.item(i);
                leName = le.getName();
                groupname = leName.substring(0, leName.indexOf("_"));
                if (s2.indexOf(groupname) == -1) {
                    if (le.getDisplayMode() == gObjMapView.DisplayMode.on) {

                        s2 = s2 + groupname + "=T|"

                    }
                    else {
                        s2 = s2 + groupname + "=F|"
                    }
                }


            }

            s2 = s2.substr(0, s2.length - 1);
        }

        doc = this.parent.document.getElementById('fraQuery');
        txtBox = doc.contentWindow.document.getElementById('txtLayers')
        txtBox.value = s2;
    }
    catch (e) {
        throw (e);
    }
    finally {
        if (le) le.release();
    }

}

function ResetLayerStatusForNewMap() {
    var doc;
    var txtBox;

    doc = this.parent.document.getElementById('fraQuery');
    txtBox = doc.contentWindow.document.getElementById('txtLayers')
    txtBox.value = '';
}



function VertsToString(vertices, separator) {
    var sBuf = "VERTS EMPTY or ERROR";


    var len = vertices.length;

    for (var i = 0; i < len; ++i) {
        if (i != 0) {
            sBuf = sBuf + vertices[i];
            if (i != (len - 1)) sBuf = sBuf + separator;
        }
        else
            sBuf = len + separator + vertices[i] + separator;
    }


    return sBuf;
}

function GetSelection(node) {
    var result = "";
    if (node.Checked) {
        result += node.Text + ",";
    }
    else {
        var childNodeArray = node.Nodes();
        if (childNodeArray.length > 0) {
            for (var i = 0; i < childNodeArray.length; i++) {
                result += GetSelection(childNodeArray[i]);
            }
        }
    }
    return result;
}

function calcMapScale(coords) {
    var xmax = parseFloat(coords[2]);
    var xmin = parseFloat(coords[0]);
    var ymax = parseFloat(coords[3]);
    var ymin = parseFloat(coords[1]);

    var theWorldMapMeters = Math.sqrt((xmax - xmin) * (xmax - xmin) + (ymax - ymin) * (ymax - ymin));

    // Get clients screen resolution
    var theScreenWidth = screen.availHeight;
    var theScreenHeight = screen.availWidth;
    var theScreenPixels = Math.sqrt((theScreenWidth * theScreenWidth) + (theScreenHeight * theScreenHeight));

    var flash = document.getElementById("ViewControl");
    intMappixelwidth = flash.clientWidth;
    intMappixelheight = flash.clientHeight;

    // Re-Calculate size of map diagonal on screen
    var theScreenInches = theScreenPixels / 96;
    var theScreenMapPixels = Math.sqrt((intMappixelwidth * intMappixelwidth) + (intMappixelheight * intMappixelheight));
    var theInchesPerPixels = theScreenInches / theScreenPixels;

    var theScreenMapMeters = theScreenMapPixels * theInchesPerPixels * 0.0254;

    return Math.round(theWorldMapMeters / theScreenMapMeters);
}

function initZoomToCounty() {
    _flashMapView.geometryCaptureService.cancelCmdCapture();
    _flashMapView.cmdSelectFeature("zoomToCountyCallback");
    document.getElementById('PromptArea').innerText = 'Select a county from the map to zoom to...';
}
function zoomToCountyCallback(e) {
    var feature = GWMFlashMx.convertToFeature(e.target),
    le = feature
        ? feature.getLegendEntry()
        : null,
    featureAction = null,
    featureID = null,
    leName = null;
    leName = le.getName();

    if (le && le.getLocatable()) {
        // used to determine the address or lot id of a feature
        leName = le.getName();
        if (leName.length > 0) {
            if (leName == "GEOADMIN.COUNTY_CENTROID_CC") {
                var featurePK = feature.getPrimaryKey();
                featureID = featurePK.getValue("COUNTY_NUMBER");
                zoomToCounty(featureID);
            }
        }
    }
    feature.setSelected(false);
    feature.release();
    le.release();
}

function initLocatableLayers() {
    _flashMapView.addEventListener(GWMFlashMx.FeatureMouseEvent.Click, "locateLayerCallback");
    _flashMapView.addEventListener(GWMFlashMx.FeatureMouseEvent.MouseOver, "locateFeaOver");
}
function locateFeaOver(e) {
    var feature = GWMFlashMx.convertToFeature(e.target);
    var le = feature ? feature.getLegendEntry() : null;
    leName = le.getName();
    if (le && le.getLocatable()) {
        feature.setHighlighted(true);
        feature.release();
    }
}

//this function handles the hotspot functionality for all the locatable layers
function locateLayerCallback(e) {
    var feature = GWMFlashMx.convertToFeature(e.target),
    le = feature
        ? feature.getLegendEntry()
        : null,
    featureAction = null,
    featureID = null,
    leName = null;
    leName = le.getName();

    if (le && le.getLocatable()) {
        // used to determine the address or lot id of a feature
        if (leName.length > 0) {
            var featurePK = feature.getPrimaryKey();
            switch(le.getTitle())
            {
              case "Historic Only":
                  getSitenoVal(featurePK.getValue("ID"));
              break;
              
              case "Isolated Finds":
                  getSitenoVal(featurePK.getValue("ID"));
              break;
              
              case "Multi-comp Prehist/Hist":
                  getSitenoVal(featurePK.getValue("ID"));
              break;
              
              case "Prehistoric Only":
                  getSitenoVal(featurePK.getValue("ID"));
              break;

              case "Surveyed Areas":
              getErnoVal(featurePK.getValue("ID"))
              break;
              
              case "Bridge-Point":
                  getHistKeynoVal(featurePK.getValue("ID"), "bridge");
              break;
              
              case "Bridges":
                  getHistKeynoVal(featurePK.getValue("ID"), "bridge");
              break;

              case "HDA":
              getHistKeynoVal(featurePK.getValue("ID"), le.getTitle());
              break;
              
              case "Listed-Line":
                  getHistKeynoVal(featurePK.getValue("ID"), "line");
              break;
              
              case "Undetermined-Line":
                  getHistKeynoVal(featurePK.getValue("ID"), "line");
              break;
              
              case "Aggregate":
              getHistKeynoVal(featurePK.getValue("ID"), le.getTitle());
              break;
              
              case "NHL-Line":
                  getHistKeynoVal(featurePK.getValue("ID"), "line");
              break;
              
              case "Eligible-Line":
                  getHistKeynoVal(featurePK.getValue("ID"), "line");
              break;        
             
              case "Ineligible-Line":
                  getHistKeynoVal(featurePK.getValue("ID"), "line");
              break;

              case "Undetermined-Point":
                  getHistKeynoVal(featurePK.getValue("ID"), "point");
              break;

              case "Listed-Point":
                  getHistKeynoVal(featurePK.getValue("ID"), "point");
              break;

              case "Eligible-Point":
                  getHistKeynoVal(featurePK.getValue("ID"), "point");
              break;

              case "NHL-Point":
                  getHistKeynoVal(featurePK.getValue("ID"), "point");
              break;

              case "Ineligible-Point":
                  getHistKeynoVal(featurePK.getValue("ID"), "point");
              break;

              case "Undetermined":
                getHistKeynoVal(featurePK.getValue("ID"), "");
              break;
              
              case "Ineligible":
                  getHistKeynoVal(featurePK.getValue("ID"), "");
              break;
              
              case "Listed":
                  getHistKeynoVal(featurePK.getValue("ID"), "");
              break;
              
              case "Eligible":
                  getHistKeynoVal(featurePK.getValue("ID"), "");
              break;
              
              case "NHL":
                  getHistKeynoVal(featurePK.getValue("ID"), "");
              break;
              
              case "PennDot Projects":
              OpenPennProjRpt(featurePK.getValue("PROJ_ID"));
              break;

          case "Soils":
              getSoilVal(featurePK.getValue("OBJECTID"));
              break;

            case "":
              break;
          default:
            }

        }
    }

    feature.setSelected(false);
    feature.release();
    le.release();
}

//CRGIS Specific functions

/* Accept spatial area/point/line selection from user and generate a map based on the section */
function CapturePoints(qryType) {
    if (qryType == 'cumulative') {
        _flashMapView.geometryCaptureService.cmdCapturePolygon("callbackGetSpatialCoords");
    }
    else if (qryType == 'Point') {
        _flashMapView.geometryCaptureService.cmdCapturePoint("callbackGetSpatialCoords");
    }
    else if (qryType == 'Line') {
        _flashMapView.geometryCaptureService.cmdCapturePolyline("callbackGetSpatialCoords");
    }
}
function callbackGetSpatialCoords(e) {

    SetMapToWaiting("Spatial report is generating...Map is refreshing...");
    var arrCoords;
    var numOfCoords;
    arrCoords = VertsToString(e.target.vertices, "|");
    numOfCoords = arrCoords.substring(0, arrCoords.indexOf("|"));
    strCoords = arrCoords.substring(arrCoords.indexOf("|") + 1);
    window.parent.fraMap.GetPoints(numOfCoords, strCoords);
    g_strQryPnts = strCoords;

}

/* Display the legend in the print view */
function PrintLegend() {
    var displayEntries;
    var cnt;
    var le;
    var LegendString = "";
    var legendimgPath = window.opener._legendImagePath;

    try {
        displayEntries = window.opener.gObjMapView.legend.getDisplayEntries()
        cnt = displayEntries.getCount();
        //loop through all the legend entries
        var lePrev="";
        for (i = 0; i < cnt; i++) {
            le = displayEntries.item(i);
            if (le.getTitle().indexOf("selected") < 0) {
                if (le.getTitle() != '') {
                    if (lePrev != le.getTitle()) {
                        
                        LegendString = LegendString + "<img src='" + legendimgPath + "/" + le.getTitle().replace("/", "-") + ".png' > - " + le.getTitle().replace("-Point", "").replace("-Line", "") + "<BR/>";
                    }
                    lePrev = le.getTitle();
            }
            }
        }
    } catch (e) {
        throw (e);
    }
    finally {
        if (le) le.release();
    }
    document.getElementById("PrintLegend").innerHTML = LegendString;
}