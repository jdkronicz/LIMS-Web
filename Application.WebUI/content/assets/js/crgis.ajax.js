//Copyright 2014 PennDOT BPR
//This JavaScript file calls the Ajax enabled WCF service
//BEL 2524

var start = null;
var layersMergingCnt = 0;

//this is called by the zoomout, starting extent, center, refresh and pan functions
function MakeMap(action, args) {
    var service = new AjaxWCFS();

    var coords = coordsList;
    if (action === 'main') {
        action = "FIT";
        coords = coordsArray[0];
    }

    var addLayerList;
    if (action == "TOGGLE511") {
        selectedMapLayers = "";
        GetDefaultLayers();
        addLayerList = selectedMapLayers;
    } else {
        addLayerList = document.getElementById("addLayerList").value;
    }

    var deleteLayerList = document.getElementById("deleteLayerList").value;

    var time = new Date().getTime() - start;
    start = new Date().getTime();
    service.GetMap(action, coords, addLayerList, deleteLayerList, args, mss, _mapFileExt, _mapID, OnSuccess, OnFailure);

    SetMapToWaiting("Map is regenerating...Please wait...");
}

//#########  Layer map portion ###########
//collect layer info and get just a specific layer
//BEL 2948 -- merge layers functionality
function MakeLayerMap(layer, index) {
    layersMergingCnt++;
    var service = new AjaxWCFS();
    start = new Date().getTime();
    var rect = GWMFlashMx.mapView.getViewRange();
    var coords = coordsList;

   //BEL 2948 
    service.GetLayerMap(layer, index, coords, mss, _mapFileExt, _mapID, OnLayerSuccess, OnLayerFailure);
    SetMapToWaiting("Map is regenerating...Please wait...");
}

//Used to load generated map.xml into current control
//BEL 2948 -- merge layers functionality
function OnLayerSuccess(results) {
    //Load xml results, overwrite the file and don't change coords
    // BEL 2948    loadResults(results, 0, false);
    layersMergingCnt--;
    var json = eval('(' + results + ')');
    if (json.BoolValue) {
        //set map time
        var time = Math.round((new Date().getTime() - start) / 1000);
        document.getElementById('lblTime').innerText = "Map Time: " + time + " sec";

        // Add our layer before any layers with higher numbered display order indexes.
        // If this layer has a higher display order index than any other layer put it at the end
        // with a null value for beforeLeName.
        var insertBeforeLeName = getNextLoadedLegendEntryAfter(json.Index);
        GWMFlashMx.loadFile(_cachePath + json.FileName + _mapFileExt, insertBeforeLeName, null , 0, null, false, null, OnFileLoadError);
        if (layersMergingCnt == 0) {
            SetMapToReady();
        }
    }
}
//#########  End Layer map portion ###########

function OnSuccess(results) {
    //Load xml results, append the file and insert new coords
    loadResults(results, 1, true);
}
function OnDynSuccess(results) {
    //Load xml results, append the file and don't change coords
    loadResults(results, 1, false);
}

//Used to load generated map.xml into current control
function loadResults(results, fileAppend, insertCoordsYesNo) {
    if (results.BoolValue) {
        //set map time
        var time = Math.round((new Date().getTime() - start) / 1000);
        document.getElementById('lblTime').innerText = "Map Time: " + time + " sec";

        GWMFlashMx.loadFile(_cachePath + results.FileName + _mapFileExt, null, null, fileAppend, null, null, initLocalOnSuccess, OnFileLoadError);
        mss = results.FileName;

        coordsList = results.CoordList;
        if (insertCoordsYesNo) {
            insertCoords(coordsList);
        }

        if (fileAppend === 1) {
            CalcScaleBar(coordsList, results.Scale);
        }

        SetMapToReady();

    } else {
        alert("Error retrieving map.\n Please try again.");
    }


}

function OnFailure(failure) {
    alert("Error generating map.\n" + failure.get_message());
    SetMapToReady();
}

function OnLayerFailure(failure) {
    layersMergingCnt--;
    alert("Error generating map.\n" + failure.get_message());

    if (layersMergingCnt == 0) {
        SetMapToReady();
    }
}

//Sends request to WebMap Service to get the lat/lon
function GetLatLong(id, coords) {
    var service = new AjaxWCFS();
    service.GetLatLong(id, coords, OnLatLongSuccess, OnFailure);
}

//Gets return from Services and displays LatLong point on Success
function OnLatLongSuccess(results) {
    var json = eval('(' + results + ')');
    redLineArray[json.id].text = 'Lat: ' + json.Y.toFixed(4) + "\nLon: " + json.X.toFixed(4);
    resetRedlines();
    SetMapToReady();
    redLineArray[json.id].type = 'init'
}

//Used to zoom to Previous/Next Map, uses the index to walk through the coords array
function zoomChange(change) {
    var coords = null;
    if (coordsArray.length > 0) {
        if (change === 1) {
            if (coordsIndex < coordsArray.length - 1) {
                coordsIndex += 1;
                coords = coordsArray[coordsIndex];
            }
        } else {
            if (coordsIndex > 0) {
                coordsIndex -= 1;
                coords = coordsArray[coordsIndex];
            }
        }

        if (null !== coords) {
            var service = new AjaxWCFS();

            //Start time
            start = new Date().getTime();
            service.GetMap("FIT", coords, "", "", "", mss, _mapFileExt, _mapID, OnDynSuccess, OnFailure);

            SetMapToWaiting("Map is regenerating...Please wait...");
        }
    }
}

//Use to zoom by box selection
function zoomBoxAjax(mss, coords) {
    var strCoords = coords.substring(2, coords.length);
    var addLayerList = document.getElementById("addLayerList").value;
    var deleteLayerList = document.getElementById("deleteLayerList").value;

    var service = new AjaxWCFS();

    //set time
    start = new Date().getTime();
    service.GetMap("ZOOMBOX", strCoords, addLayerList, deleteLayerList, "", mss, _mapFileExt, _mapID, OnSuccess, OnFailure);
}

//Coordinat
//Functions used to insert current coords into coords json object
//json object used to track current and history of each map coord change
function insertCoords(coords) {
    coordsIndex += 1;
    coordsArray.push(coords);
    coordsList = coords;
}

/* Save map extent information */
function saveMapExtentAjax(mapName) {
    if (coordsList == "") {
        alert("Error retrieving map extent");
    } else {
        var service = new AjaxWCFS();
        service.SaveMapExtent(mapName, coordsList, saveMap_OnSuccess, saveMap_OnFailure);
    }
}
function saveMap_OnFailure(failure) {
    alert("Error saving map");
}
function saveMap_OnSuccess(results) {
    if (results == "true") {
        alert("Map successfully saved");
        ToggleFavoriteMapSavePromptVisibility();
        ToggleSaveMapDivVisibility();
    } else {
        alert("Error saving map");
    }
}

/* Save users default layers */
function saveDefaultLayersAjax(layerList) {
        var service = new AjaxWCFS();
        service.SaveDefaultLayers(_mapID, layerList, saveDefaultLayers_OnSuccess, saveDefaultLayers_OnFailure)
}
function saveDefaultLayers_OnFailure(failure) {
    alert("Error saving default layers");
}
function saveDefaultLayers_OnSuccess(results) {
    if (results == "true") {
        //alert("Layers successfully saved");
    } else {
        alert("Error saving default layers");
    }
}
function saveLocalDefaultLayersAjax_OnFailure(failure) {
    alert("Error saving default layers");
}
function saveLocalDefaultLayersAjax_OnSuccess(results) {
    if (results == "true") {
        alert("Layers successfully saved");
    } else {
        alert("Error saving default layers");
    }
    SetMapToReady();
}

/* Fetch affected area information */
function getAffectedAreaInfo(affectedAreaID) {
    var service = new AjaxWCFS();
    service.GetAffectedAreaInfo(affectedAreaID, getAffectedAreaInfo_OnSuccess, getAffectedAreaInfo_OnFailue);
}
function getAffectedAreaInfo_OnSuccess(results) {
    var json = eval('(' + results + ')');
    ShowDetourMapPopup(json.id, json.sr, json.ctyCode, json.hasDetours);
}
function getAffectedAreaInfo_OnFailue(results) {
    alert("Error retrieving affected area info");
}

/* Get camera URL */
function getCameraURL(cameraID) {
    var service = new AjaxWCFS();
    service.GetCameraURL(cameraID, getCameraURL_OnSuccess, getCameraURL_OnFailure);
}
function getCameraURL_OnSuccess(results) {
    var json = eval('(' + results + ')');
    ShowCameraImage(json.url, json.id, "Y");
}
function getCameraURL_OnFailure(results) {
    alert("Error retrieving camera URL");
}

/* Get report's ERNO */
function getErnoVal(ReportId) {
    var service = new AjaxWCFS();
    service.GetSurveyERNO(ReportId, getErnoVal_OnSuccess, getErnoVal_OnFailure);
}
function getErnoVal_OnSuccess(results) {
    var json = eval('(' + results + ')');
    OpenArchSurvRpt(json.Erno);
}
function getErnoVal_OnFailure(results) {
    alert("Error retrieving Report ERNO");
}

/* Get Site number from site ID. */
function getSitenoVal(SiteId) {
    var service = new AjaxWCFS();
    service.GetSiteno(SiteId, getSitenoVal_OnSuccess, getSitenoVal_OnFailure);
}
function getSitenoVal_OnSuccess(results) {
    var json = eval('(' + results + ')');
    OpenArchRpt(json.Siteno);
}
function getSitenoVal_OnFailure(results) {
    alert("Error retrieving Site No");
}

/* Get Historical Key Type */
function getHistKeynoVal(KeyId,KeyType) {
    var service = new AjaxWCFS();
    service.GetHistKeyno(KeyId,KeyType, getHistKeynoVal_OnSuccess, getHistKeynoVal_OnFailure);
}
function getHistKeynoVal_OnSuccess(results) {
    var json = eval('(' + results + ')');
    switch(json.KeyType)
    {
        case "HDA":
            OpenHistHDARpt(json.Keyno);
            break;
        case "Aggregate":
            OpenHistLnRpt(json.Keyno);
            break;
        case "line":
            OpenHistLnRpt(json.Keyno);
            break;
        case "point":
            OpenHistRpt(json.Keyno);
            break;
        case "bridge":
            OpenBridgeRpt(json.Keyno);
            break;
        case "":
            OpenHistRpt(json.Keyno);
            break;
    }
}
function getHistKeynoVal_OnFailure(results) {
    alert("Error retrieving Keyno");
}

/* Get soil Musym */
function getSoilVal(ObjectId) {
    var service = new AjaxWCFS();
    service.GetSoilCtyMusymVal(ObjectId, getSoilCtyMusym_OnSuccess, getSoilCtyMusym_OnFailure);
}
function getSoilCtyMusym_OnSuccess(results) {
    var json = eval('(' + results + ')');
    OpenSoilRpt(json.CtyCode, json.Musym);
}

function getSoilCtyMusym_OnFailure(results) {
    alert("Error retrieving soil information");
}

/* Saves the current map action in the MAPS_TRACKING table */
function TrackMap(coord,mapAction) {
    var service = new AjaxWCFS();
    service.TrackMap(coord, mapAction,TrackMap_OnSuccess, TrackMap_OnFailure);
}
function TrackMap_OnSuccess() {
}
function TrackMap_OnFailure(results) {
    alert("Error saving te Map for tracking");
}

/* Moves viewpoint to County */
function zoomToCounty(countyNumber) {
    //get the selected map layers
    selectedMapLayers = "";
    GetDefaultLayers();

    //zoom to the selected county
    var service = new AjaxWCFS();
    //set time
    start = new Date().getTime();
    service.ZoomToCounty(countyNumber, selectedMapLayers, _mapFileExt, _mapID, OnSuccess, OnFailure);

    SetMapToWaiting("Map is regenerating...Please wait...");
}