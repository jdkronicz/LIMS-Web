/*
	Summary:	This file contains all the client side functions used by the map page  
				of the CRGIS site. These functions are used to perform various client side 
				task on the map.
	Author:		Sandeep Chaudhary (CAI)
	Remarks:	This file created in order to consolidate javascript functions in javascript files
				and to get rid of duplicate functions.
*/

var m_shape = "";
var m_feature = "";
var m_LayerList = "";
var m_ForcedLayerList = "";

function AddLayer(intLayerID)
{	
	strLayers = m_LayerList + "";	

	if(strLayers.length > 0)
	{
		arrLayers = strLayers.split(",");
		blnAdd = true;
		
		for (x in arrLayers)
		{
			if(intLayerID == arrLayers[x])
			{
				blnAdd = false;
				break;
			}
		}

		if(blnAdd)
		{
			if(strLayers != "")
			{
				strLayers += "," + intLayerID
			}
			else 
			{
				strLayers = intLayerID
			}
		}
	}
	else
	{
		strLayers = intLayerID
	}

m_LayerList = strLayers;
}

function AddForcedLayer(intLayerID)
{	
	strLayers = m_ForcedLayerList + "";	
	
	if(strLayers.length > 0)
	{
		arrLayers = strLayers.split(",");
		blnAdd = true;
		
		for (x in arrLayers)
		{
			if(intLayerID == arrLayers[x])
			{
				blnAdd = false;
				break;
			}
		}
		
		if(blnAdd)
		{
			if(strLayers != "")
			{
				strLayers += "," + intLayerID
			}
			else strLayers = intLayerID
		}
	}
	else
	{
		strLayers = intLayerID
	}

m_ForcedLayerList = strLayers;	
}


function RemoveLayer(intLayerID)
{
	strLayers = m_LayerList + "";	
	arrLayers = strLayers.split(",");
	strLayers = "";
	
	for (x in arrLayers)
	{
		if(intLayerID != arrLayers[x]) strLayers +=  arrLayers[x] + ","
	}
	strLayers = strLayers.substring(0,strLayers.length-1);
	
	m_LayerList = strLayers;
}


function RemoveForcedLayer(intLayerID)
{
	strLayers = m_ForcedLayerList + "";	
	arrLayers = strLayers.split(",");
	strLayers = "";
	
	for (x in arrLayers)
	{
		if(intLayerID != arrLayers[x]) strLayers +=  arrLayers[x] + ","
	}
	strLayers = strLayers.substring(0,strLayers.length-1);
	
	m_ForcedLayerList = strLayers;
}

function GetForcedLayers()
{
	return m_ForcedLayerList;
}

function GetFeatureQueryString()
{
	var strFeatures = GetLayers();
	var strForce = GetForcedLayers();
	
	if(strFeatures.length > 0) strFeatures = "Features=" + strFeatures;
	if(strForce.length > 0) strFeatures += "&Force=" + strForce;
	
	return strFeatures;
}

function ToggleLayer(LayerCheckbox)  {
  //if (document.all(lyr).checked == true) {
  //  str = "showsheet -sheet " + lyr;
  //  str1 = "showsheet -sheet " + lyr +"_HS"};
  //else  {
  //  str = "hidesheet -sheet " + lyr;
  //  str1 = "hidesheet -sheet " + lyr +"_HS";
  //}
  //window.parent.frames["fraMap"].ACGMCtl.MLCommand(str);
  //window.parent.frames["fraMap"].ACGMCtl.MLCommand(str1);
  
  var strToggleLayer = new String(LayerCheckbox.value);
	alert('strToggleLayer=' + strToggleLayer);	
	if (!LayerCheckbox.checked) {
	    alert('checked');
		window.parent.frames["fraMap"].g_objSvg.setLayerVisible(strToggleLayer, false);
	}
	else {
	    alert('unchecked');
		window.parent.frames["fraMap"].g_objSvg.setLayerVisible(strToggleLayer, true);
	}

  
}


function DisableInterface() {
  
}

function EnableInterface() {
  window.parent.frames["fraControls"].MapCntrls.style.display="";
}

function StartRolling() {
  if(document.all.imgBanner){
    document.all.imgBanner.style.display = 'none';
  }
  document.all.imgWait.style.display = '';
}

function StopRolling() {
  document.all.imgWait.style.display = 'none';
  if(document.all.imgBanner){
    document.all.imgBanner.style.display = '';
  }
}

function changecolor() {
  var sCmd="";
  var sRetSts = "";
  var sheetname;
  var colorname;
  
  sheetname=document.all.ChgLegendForm.selectSheet.value;
  colorname=document.all.ChgLegendForm.selectColor.value;
  if (sheetname) {
    if (colorname) {
    sCmd = "colorsheet -sheet " +sheetname+" -color "+ colorname;
    sRetSts = parent.ExecACGMMLCommand( sCmd );
    } else {
	    alert("Please select a color");
	  }
  } else {
    alert("Please select a legend");
  } 
}
 
function DoQuery(idx) {
  if(idx==1) {
    document.all.divDefineProj .style.display = '';
    document.all.divDigi.style.display = 'none';
  } else if(idx==2){
    document.all.divDefineProj.style.display = 'none';
    document.all.divDigi.style.display = '';
    
    document.all.divdigibtn.style.display = '';
    document.all.divsavebtn.style.display = 'none';
  }
}
 
function DisplayInfo(sInfo,idx){
  if(idx==1) {
    document.all.SQInfo.innerHTML = sInfo;
  } else {
    document.all.DGInfo.innerHTML = sInfo;
  }
  return;
}

var buffdist = 0.0;

function MapDist(strMsgNoDist) {
  window.top.window.SetLayerStr();  
  var strFind = new String(window.txtDist.value);
  
  //get rid of all white space to the left of the txtDist
  while ( strFind.substring(0,1) == ' ' || strFind.substring(0,1) == '	' ) {
    strFind = strFind.substring(1, strFind.length);
  }
  
  //get rid of all white space to the right of the txtDist
  while ( strFind.substring(strFind.length - 1, strFind.length) == ' ' || strFind.substring(strFind.length - 1, strFind.length) == '	' ) {
    strFind = strFind.substring(0, strFind.length - 1);
  }
 
  window.txtDist.value = strFind;
  
  if ( strFind.length != 0 ) {
    var strSite = new String('/ce/Application/ASP/GIS/Map/FindSite.asp');
    strSite = strSite + '?sType=' + window.parent.window.gType;
    
    //strSite = strSite + '&SelectSite=' + mstrFindType;
    strSite = strSite + '&SelectSite=' + selShape1.value;
    strSite = strSite + '&siteno=' + strFind + ',';
    strSite = strSite + '&MapbySite=1';
    
    strSite = strSite + '&w=' + (Number(window.parent.window.frames["fraMap"].document.body.offsetWidth) - 46);
    strSite = strSite + '&h=' + (Number(window.parent.window.frames["fraMap"].document.body.offsetHeight) - 110);
    strSite = strSite + '&' + GetStoredLayers();
    window.parent.window.frames['fraControls'].StartRolling();
    window.parent.window.frames['fraWorking'].window.location = strSite;
  } else {
    alert(strMsgNoDist);
    window.txtDist.focus();
  }
}

function GoSpatialQuery(idx){
    var sType = parent.gType;
    var shape;
	var mapGenerated = 'False';
    shape = document.getElementById("selShape1").value;
//    if (shape != 'none')
//    {
    // ***CES*** need to get rid of the aoi/BZ.
//			g_objSvg=document.getElementById("ViewControl");
//			window.parent.frames["fraMap"].g_objSvg.setLayerVisible('BUFFER', false);
//            var gstrStoragePnts = window.parent.frames["fraMap"].CapturePoints(shape);   
//            GetBuffer()      
//    }
//    else
//    {
//        alert('Please Select a Shape!');
//    } 
    
    var districtno;
    districtno = document.getElementById("txtDist").value;
    
    if (shape == 'none')
    {
        alert('Please Select a Shape!');
        alert('here here');
    } 
    else if (shape == 'condist')
    {
        //MapDist('Congressional District number must be entered.');
        if (districtno == '')
        {alert('Please enter a district number') }
        else {
            document.URL = "/ce/Map/MapLoading.htm?AOI=12&AOIKey=LEG_DISTRICT_NO~^" + districtno + "^";
        }
    }
    else if (shape == 'legdist') {
    if (districtno == '')
    { alert('Please enter a district number') }
    else {
        document.URL = "/ce/Map/MapLoading.htm?AOI=14&AOIKey=LEG_DISTRICT_NO~^" + districtno + "^";
    }
		//MapDist('Legislative District number must be entered.');
    }
    else if (shape == 'sendist') {
    if (districtno == '')
    { alert('Please enter a district number') }
    else {
        document.URL = "/ce/Map/MapLoading.htm?AOI=13&AOIKey=LEG_DISTRICT_NO~^" + districtno + "^";
    }
		//MapDist('Senatorial District number must be entered.');
    }
    else
    {
    // ***CES*** need to get rid of the aoi/BZ.
		//window.txtDist.value = '';	
		//g_objSvg=document.getElementById("ViewControl");
        //window.parent.frames["fraMap"].g_objSvg.setLayerVisible('BUFFER', false);
        //var gstrStoragePnts = window.parent.frames["fraMap"].CapturePoints(shape);
        var gstrStoragePnts = window.parent.fraMap.CapturePoints(shape);
        GetBuffer();     
    }
}

function GetBuffer() {
	buffdist=0.0;
	if(document.getElementById("bufferdist").value.length != 0 )
	{
		switch(document.getElementById("selBufferUnits").value)
		{
			case "meters":
				buffdist = parseFloat(document.getElementById("bufferdist").value,10);
				break;

			case "feet":
				buffdist = parseFloat(document.getElementById("bufferdist").value,10) * 0.3048;
				break;

			case "miles":
				buffdist = parseFloat(document.getElementById("bufferdist").value,10) * 0.3048 * 5280.0;
				break;
			
			default:
				buffdist = parseFloat(document.getElementById("bufferdist").value,10);
		}
	}
}

function GetPoints(numOfCoords, strCoords) {
    var Feature='';
    var shape='';
    //var sType = parent.gType;
    Feature = "Default" ;//selFea1.value
    var shape = document.getElementById("selShape1").value;
    var sURL='';
    //var iArchSite = parent.giArchSite;
    //var iArchSurvey = parent.giArchSurvey;
    //var iHistSite= parent.giHistSite;
    //var iHistSurvey=parent.giHistSurvey;
    //alert('here1');
    var currRng = ""; //document.frmGlobals.CurrRng.value
    sURL = baseUrl + "Application/ASPNET/GIS/MapControls/CreateSpatial.aspx"
    sURL = sURL + "?Shape=" + shape; 
    sURL =sURL + "&currRng="+currRng;
    //sURL = sURL + "&Feature=" + Feature;
    //sURL = sURL + "&w=" +GetMapSize ("x") ;
    //sURL = sURL + "&h=" +GetMapSize ("y") ;
    sURL = sURL + "&strPnts="+strCoords;
    sURL = sURL + "&NumPoints=0"; //+giNumPts;
    sURL = sURL + "&ArchSite=1";  //+ iArchSite;
    sURL = sURL + "&ArchSurvey=0";  //+ iArchSurvey;
    sURL = sURL + "&HistSite0=";  //+ iHistSite;
    sURL = sURL + "&HistSurvey=0";  //+ iHistSurvey;
    sURL = sURL + "&BufferDist=" + buffdist;
    //ExecMapASP(sURL, "fraMap");

    if (shape == 'Line' && buffdist!=0) {
        if (numOfCoords < 31) {
            document.getElementById("imgWait").style.visibility = 'visible';
            window.open(sURL, 'Spatial', 'left=100,top=100,height=600,status=yes,menubar=0,scrollbars=1,resizable=1');
        } else {
            alert(numOfCoords +" points selected. Please start again and select less than 25 points.")
            document.getElementById("imgWait").style.visibility = 'hidden';
            GoSpatialQuery(1);
        }
        }
        else{
            document.getElementById("imgWait").style.visibility = 'visible';
            window.open(sURL, 'Spatial', 'left=100,top=100,height=600,status=yes,menubar=0,scrollbars=1,resizable=1');
        }
    
    return;
}

function ExecMapASP(sCommand, sFrame) {
    top.frames[sFrame].location = sCommand;
    return;
}

function GetMapSize(axis) {

    if (axis == 'x') {
        var sizeX = window.parent.frames["fraMap"].document.body.offsetWidth
        return (sizeX - 46)
    }
    else {
        var sizeY = window.parent.frames["fraMap"].document.body.offsetHeight
 
        return (sizeY - 110)
    }
}
function GetDistPoints(numOfCoords,strCoords){
    var sURL = baseUrl + "Application/ASPNET/GIS/MapControls/CreateSpatial.aspx";
    var shape = document.getElementById("selShape1").value;
    var district = document.getElementById("txtDist").value; 
    //window.txtDist.value = "";      
    if (shape == "condist" || shape == "legdist" || shape == "sendist"){
		sURL = sURL + "?Shape=" + shape; 
		sURL = sURL + "&DistrictId=" + district;
		//ExecMapASP(sURL, "fraWorking");
		window.open(sURL, 'Spatial', 'left=100,top=100,height=600,status=yes,menubar=0,scrollbars=1,resizable=1');

    }
    else {
		alert("Report is generated for congressional, legislative, and senatorail districts only.");
    }
}

function GetProjectArea(idx){
  var Feature;
  var shape;
  var sType = parent.gType;
  //window.txtDist.value = "";
  if(idx==1) {
    Feature = "Default" ;//selFea1.value
    shape = selShape1.value;
  } else if(idx==2) {
    Feature = selFea2.value;
    shape = selShape2.value;
  }
  
  if(Feature == 'none' || Feature == "") {
    alert("Please select a feature");
    return;
  }
  
  if(shape == 'none'|| shape == "") {
    alert("Please select a shape");
    return;
  }
   
  m_shape = shape;
  m_feature = Feature;
  
  if ( sType=="CGM" || sType=="" ) {
    var sURL;
    var iArchSite = parent.giArchSite;
    var iArchSurvey = parent.giArchSurvey;
    var iHistSite= parent.giHistSite;
    var iHistSurvey=parent.giHistSurvey;
    var currRng = document.frmGlobals.CurrRng.value   
    if(InitACGMClient() == 0 ) {return;}
	  if(DigitizeShape(shape,idx)) {
	    if(idx==1) {
        //sURL = "QryData.asp"
	        sURL = baseUrl + "Application/ASPNET/GIS/MapControls/CreateSpatial.aspx"
        sURL = sURL + "?Shape=" + shape; 
        sURL =sURL + "&currRng="+currRng;
        sURL = sURL + "&Feature=" + Feature;
        sURL = sURL + "&w=" +GetMapSize ("x") ;
        sURL = sURL + "&h=" +GetMapSize ("y") ;
        sURL = sURL + "&strPnts="+gstrStoragePnts;
        sURL = sURL + "&NumPoints="+giNumPts;
        sURL = sURL + "&ArchSite=" + iArchSite;
        sURL = sURL + "&ArchSurvey=" + iArchSurvey;
        sURL = sURL + "&HistSite=" + iHistSite;
        sURL = sURL + "&HistSurvey=" + iHistSurvey;
        // alert(sURL)
        ExecMapASP(sURL, "fraWorking");
      } else if(idx==2) {
        alert("Click Save button on the left side to save new digitized Geometry")
        document.all.divdigibtn.style.display = 'none';
        document.all.divsavebtn.style.display = '';
      }
    }
    DisplayInfo("",idx);
  } else {
    var strImgVal="";
    DeleteImgLines();

    if(shape == "Point") {
      sBuf = "Click a point on map.";
      strImgVal = "Pnt";
    } else if(shape == "cumulative" ) {
      sBuf = "Click on map to draw the area, press SPACEBAR to end input, press Esc to cancel input.";
      strImgVal = "Poly";
    } else if(shape == "Fence") {
      sBuf = "Click on map to get upper-left,then lower-right points of the fence.";
      strImgVal = "Area";
    }
    DisplayInfo(sBuf,1);
    document.frmGlobals.Img_Action.value = "SQ_"+strImgVal;
    top.frames['fraMap'].frmImg1.iptImg1.style.cursor = 'crosshair';
  }
}
 
 function DigitizeShape(sShape,idx) {
  var sBuf;
  //alert(sShape)
  if (sShape == "") {return;}
  
  DeleteRedlines();
  if(sShape == "cumulative") {
    sBuf  = "Click on map to define an area.";
  } else {
    sBuf  = "Click and drag on map to define a "+ sShape +".";
  }
  DisplayInfo(sBuf,idx);

  //--Get points, Store global results, Translate
  if (sShape == "Fence")  {
    bSts = GetSetACGMVector( "area",true,false);
  } else  {
    bSts = GetSetACGMVector(sShape,true,false);
  }

  if( !bSts ) {ACGMVectorCancel();}
  return bSts;
 }

 function saveGeometry() {
  var DigiNum = "";
  var strFeature = m_feature;
  var strShape = m_shape;
  var sURL = "/ce/Application/ASP/GIS/MapControls/saveDigiNum.asp?DigiFeature=" + strFeature;
  sURL=sURL + "&DigiShape="+ strShape;
  sURL = sURL + "&strPnts="+ gstrStoragePnts;
  sURL = sURL + "&NumPoints="+ giNumPts;
  window.open(sURL,"","Height=100,Width=400");
  //window.open(sURL);
}

/*function RefreshMap(path, removemkrs, sFeatures){
  var currRng = document.frmGlobals.CurrRng.value;
  var sType = parent.gType;
  var sURL = '/ce/Application/ASP/GIS/MapControls/refreshmap.asp?currRng=' + currRng + '&sType=' + sType;
  sURL += '&RemoveMrks=' + removemkrs;
  sURL += '&w=' + GetMapSize('x');
  sURL += '&h=' + GetMapSize('y');
  sURL += '&' + sFeatures;
  StartRolling();
  ExecMapASP(sURL, 'fraWorking');
}*/

function RefreshMap2(path,removemkrs,sheets){
  var currRng = document.frmGlobals.CurrRng.value;
  var sType = parent.gType;
  var sURL = '/ce/Application/ASP/GIS/MapControls/refreshmap.asp?currRng=' + currRng + '&sType=' + sType;
  sURL += '&RemoveMrks=' + removemkrs;
  sURL += '&w=' + GetMapSize('x');
  sURL += '&h=' + GetMapSize('y');
  sURL += '&Sheets=' + sheets;
  StartRolling();
  ExecMapASP(sURL, 'fraWorking');
}

function CancelDigi(){
  DeleteRedlines();
  DisplayInfo("");
  document.all.divdigibtn.style.display = '';
  document.all.divsavebtn.style.display = 'none';
  //RefreshMap("","MkrGeo");
}

function OpenLayerWin() {
  var sURL;
  sURL = "/ce/Application/ASP/GIS/MapControls/dlgLayerControl.asp?";
  sURL = sURL + GetFeatureQueryString();
  //alert(sURL);
  var LayerWin = window.open(sURL,"LayerWin", "scrollbars=1,resizable=1,width=225,height=425");
  LayerWin.focus();
}
 
function PrintMap() {
  var mapW, mapH,sURL,SearchArea, AreaName,selectItem, strLayer
  mapW = 700; //top.frames['fraControls'].frmGlobals.MapH.value;
  mapH = 570; //top.frames['fraControls'].frmGlobals.MapW.value;
  SeachArea = "";
  AreaName = "";
  var sType = parent.gType;
  sURL = "/ce/Application/ASP/GIS/MapControls/maplayout.asp?mapW=" + mapW + "&mapH=" + mapH + "&SearchArea=" + SearchArea + "&AreaName=" + AreaName + "&NameFlag=&sType=" + sType;
  //alert(sURL)
  window.open(sURL,'','width=800,height=690,scrollbar=no');
}

function IntiCtls(){
   var sType = parent.gType;
   try { 
    DisplayInfo("",1);
    DisplayInfo("",2);
    selFea2.selectedIndex = 0;
    selShape1.selectedIndex = 0;
    selShape2.selectedIndex = 0;
    }
    catch(everthing) {
      return true;
      window.t
    }
 } 
 
function SetPNG(idx){
  var oSelect = selShape1;
  var cnt = oSelect.options.length;
  if (cnt > 0) {
    for (i=0; i < cnt; i++) {    
     oSelect.options.remove(0);
    }
  }
  
  oOption=document.createElement('OPTION');
  oOption.text='Pick a shape';
  oOption.value='none';
  oSelect.add(oOption);
   
  oOption=document.createElement('OPTION'); oOption.text='Congress Dist'; oOption.value='condist'; oSelect.add(oOption); 
  oOption=document.createElement('OPTION'); oOption.text='Legislative Dist'; oOption.value='legdist'; oSelect.add(oOption); 
  oOption=document.createElement('OPTION'); oOption.text='Senatorial Dist'; oOption.value='sendist'; oSelect.add(oOption);
  
  oOption=document.createElement('OPTION');
  oOption.text='Polygon';
  oOption.value='cumulative';
  oSelect.add(oOption);
  oOption=document.createElement('OPTION');
  oOption.text='Point';
  oOption.value='Point';
  oSelect.add(oOption);
  //oOption=document.createElement('OPTION');
  //oOption.text='Rectangle';
  //oOption.value='Fence';
  //oSelect.add(oOption);
  
  if ( idx == 0 ) {
    oOption=document.createElement('OPTION');
    oOption.text='Line';
    oOption.value='Line';
    oSelect.add(oOption);
	}
	//when output is PNG, hide Digitize Geometry section
  try {
    document.all.divDigi.style.display = ( idx == 1 ) ? 'none' : '';
  } catch(everything) {
    return true;
  }
}

function CustomizeLabel() {
  window.top.window.CustomizeLabel();
}
 
function OpenSoil() {
  window.top.window.OpenSoil();
}

function ToggleCheckbox(objCheckbox) {
  objCheckbox.checked = ( objCheckbox.checked == false ) ? true : false;
}

function selShape1_click(){
    document.getElementById("txtDist").value = '';
    if (document.getElementById("selShape1").value == 'condist' || document.getElementById("selShape1").value == 'legdist' || document.getElementById("selShape1").value == 'sendist') {
        document.getElementById("distRow").style.visibility = 'visible';
        document.getElementById("bufferRow").style.visibility = 'hidden';
        document.getElementById("MultiLineRow").style.visibility = 'hidden';
    }
    else {
        document.getElementById("distRow").style.visibility = 'hidden';
        document.getElementById("bufferRow").style.visibility = 'visible';
        if (document.getElementById("selShape1").value == 'Line' || document.getElementById("selShape1").value == 'cumulative') {
            document.getElementById("MultiLineRow").style.visibility = 'visible';
        }
        else {
            document.getElementById("MultiLineRow").style.visibility = 'hidden'; 
        }
        
    }

}