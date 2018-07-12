//++++++++++++++++++++++++++++++++++++++++
//Mapping javascript functions that will handle the various actions user may choose,
// such as Zoom, Pan, Get Distance, etc.
//++++++++++++++++++++++++++++++++++++++++

function CalcDistance (x1,y1,x2,y2) {
	var dx = 0.0;
	var dy = 0.0;
	var fResult = 0.0;
	
	dx = x2 - x1;
    dy = y2 - y1;
    fResult = Math.sqrt( ((dx*dx) + (dy*dy)) );
    return fResult;
}

//Polygon Calculation of Measure
function GetAreaMeasure () {
	var docContents;
	docContent = window.parent.frames['fraMap'];
	docContent.PromptArea.innerText = 'Click and draw a polygon to measure area...double-click last point to end...';
	g_objSvg.setCoordinateUnits(1);
	g_objSvg.cmdCapturePolygon(callbackGetAreaMeasure,'area');
}

function callbackGetAreaMeasure (strCoords,strUserInfo) {
	var str;
	var meters;
	var feet;
	var acres;
	var miles;
	var arrCoords;	
	var perimM;
	var perimF;
	var perimMiles;
	
	window.parent.frames['fraMap'].PromptArea.innerText = "";
	arrCoords=strCoords.split("|");
	meters = CalcAreaOfPoly(arrCoords);
	meters = meters.toFixed(2);
	feet = meters / 0.09290304;
	feet = feet.toFixed(2);
	acres = meters / 4046.8564224;
	acres = acres.toFixed(2);
	miles = meters  / 2589988.11;
	miles = miles.toFixed(2);
	perimM = CalcLineMeasure(arrCoords);
	perimM = perimM.toFixed(2);
	perimMiles = perimM * 0.0006215;
	perimMiles = perimMiles.toFixed(2);
	perimF = Math.round(perimMiles * 5280);
	//perimF = perimF.toFixed(3);
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

function CalcAreaOfPoly(arrCoords) {
	var x=1;
	var y=1;
	var numV;
	var val=0.0;

	numV = arrCoords[0];
	while (x < numV) {
		val += ((arrCoords[y]*arrCoords[y+3]) - (arrCoords[y+2]*arrCoords[y+1]));
		y++;
		y++;
		x++;
	}	
	val = val/2;
	return val;
}

//PolyLine Calculation of Measure modified to capture multiline for BEL 2308
function GetPolyLineMeasure () {
	var docContents;
	docContent = window.parent.frames['fraMap'];
	docContent.PromptArea.innerText = 'Click and draw a line to measure area...double-click last point to end...';
	g_objSvg.setCoordinateUnits(1);
	g_objSvg.cmdCapturePolyline(callbackGetPolyLineMeasure,'polyline');
}

function callbackGetPolyLineMeasure (strCoords,strUserInfo) {
	var str;
	var meters;
	var feet;
	var miles;
	var arrCoords;	
	
	window.parent.frames['fraMap'].PromptArea.innerText = "";
	arrCoords=strCoords.split('|');
	meters = CalcLineMeasure(arrCoords);
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

function CalcLineMeasure(arrCoords) {
	var x=1;
	var y=1;
	var numV;
	var val=0.0;

	numV = arrCoords[0];
	while (x < numV) {
		val += CalcDistance(arrCoords[y],arrCoords[y+1],arrCoords[y+2],arrCoords[y+3]);
		y++;
		y++;
		x++;
	}	
	return val;
}


function callbackGetLatLongPoint(strCoords,strUserInfo) {
	var arrCoords;
	var s;
	SetMapToWaiting("Map is regenerating...Please wait...");
	s = "Map.aspx?Action=" + strUserInfo + "&Coords=" + strCoords;
	window.parent.frames['fraMap'].location = s;
}



function callbackGetSegOffset(strCoords,strUserInfo) {
	var s;
	var sSnap;
	
	SetMapToWaiting("Getting segment/offset...Please wait...");
	
	//if (g_IsInterstate=='Y') {
	//	sSnap='N';
	//} else {
		if (g_IsRestriction=='Y') {
			var answer = confirm("Do you want to snap this selected location to the nearest intersection?  (OK = Yes   Cancel = No)")
			if (answer == true) {
				sSnap='Y';
			} else {
				sSnap='N';
			}
		} else {
			sSnap='Y';
		}	
	//}
		
	s = "GetSegOffset.aspx?C=" + strCoords + "&U=" + strUserInfo + 
				"&SegBox=" + g_segBox + "&OffsetBox=" + g_offsetBox + 
				"&Cty=" + g_cty + "&SR=" + g_sr + 
				"&SideInd=" + g_sideind + "&SnapToInter=" + sSnap;

	window.parent.frames['fraExec'].location = s;
}




function SetDefaultLayers() {
    var locationString;
    var txtLayerIDs;
    var layerIDList;

    if (confirm('Are you sure you want these to be your default layers?') == false)
        return;

    doc = window.parent.frames['fraQuery'];
    txtLayerIDs = doc.mapQuery.txtLayerIDs;
    layerIDList = txtLayerIDs.value;

    SetMapToWaiting("Default Layers are saving...Please wait...");
    locationString = "Map.aspx?Action=SetDefaultLayers&SelectedLayers=" + layerIDList;
    window.parent.frames['fraMap'].location = locationString;
}

function GetLayers() {
	var sLayers;
	
	sLayers = g_objSvg.getLayerNames(true);
	return sLayers;
}

function GetLayerVisibility(sLayer) {
	return g_objSvg.getLayerVisible(sLayer);
}

function ResetLayerStatusForNewMap() {
	var doc;
	var txtBox;
	doc=window.parent.frames['fraQuery'];
	txtBox = doc.mapQuery.txtLayers;
	txtBox.value = '';
}








function isSVGControlInstalled() {
	var objSVGCtl;
	var bRet = true;

	try {
		objSVGCtl = new ActiveXObject("Adobe.SVGCtl");
		 
	}
	catch(e) {
		//try {
			//objSVGCtl = new  corel object and other possible SVG viewers here
		//}
		//catch(E) {
			bRet = false;
		//}
	}
	return bRet;
}

//====================== SVG Check functions from Adobe ==========================
// Copyright 2000 Adobe Systems Incorporated. All rights reserved. Permission
// to use, modify, distribute, and publicly display this file is hereby
// granted. This file is provided "AS-IS" with absolutely no warranties of any
// kind. Portions (C) Netscape Communications 1999.

// If you modify this file, please share your changes with Adobe and other SVG
// developers at http://www.adobe.com/svg/.

// Version 11/30/01

function getBrowser()
{
var agt=navigator.userAgent.toLowerCase();
var v_maj=parseInt(navigator.appVersion);
var v_min=parseFloat(navigator.appVersion);
is_nav=((agt.indexOf('mozilla')!=-1)&&(agt.indexOf('spoofer')==-1)&&
	(agt.indexOf('compatible')==-1)&&
	(agt.indexOf('webtv')==-1)&&(agt.indexOf('msie')==-1));
is_nav3=(is_nav&&(v_maj==3));
is_nav4up=(is_nav&&(v_maj>=4));
is_nav407up=(is_nav&&(v_min>=4.07));
is_nav408up=(is_nav&&(v_min>=4.08));
is_ie=(agt.indexOf("msie")!=-1);
is_ie3=(is_ie&&(v_maj<4));
is_ie4=(is_ie&&(v_maj==4)&&(agt.indexOf("msie 5")==-1));
is_ie4up=(is_ie&&(v_maj>=4));
is_ie5=(is_ie&&(v_maj==4)&&(agt.indexOf("msie 5")!=-1)); 
is_ie5up=(is_ie&&!is_ie3&&!is_ie4);
is_win=((agt.indexOf("win")!=-1)||(agt.indexOf("16bit")!=-1));
is_win95=((agt.indexOf("win95")!=-1)||(agt.indexOf("windows 95")!=-1));
is_win98=((agt.indexOf("win98")!=-1)||(agt.indexOf("windows 98")!=-1));
is_winnt=((agt.indexOf("winnt")!=-1)||(agt.indexOf("windows nt")!=-1));
is_win32=(is_win95||is_winnt||is_win98||
	((v_maj>=4)&&(navigator.platform=="Win32"))||
	(agt.indexOf("win32")!=-1)||(agt.indexOf("32bit")!=-1));
is_mac=(agt.indexOf("mac")!=-1);
is_macPPC=(is_mac&&((agt.indexOf("ppc")!=-1)||(agt.indexOf("powerpc")!=-1)));
is_macOSX=(is_mac&&((agt.indexOf("powerpc")!=-1)&&(agt.indexOf("msie 5.1")!=-1)));
is_x86linuxmoz=((agt.indexOf("linux")!=-1)&&(agt.indexOf("mozilla")!=-1)&&(agt.indexOf("i686")!=-1));
is_solarismoz=((agt.indexOf("sunos")!=-1)&&(agt.indexOf("mozilla")!=-1));
}

function setCookie(name, value, expires, path, domain, secure) {
var curCookie=name+"="+escape(value)+
	((expires)?"; expires="+expires.toGMTString():"")+
	((path)?"; path="+path:"")+
	((domain)?"; domain="+domain:"")+
	((secure)?"; secure":"");
document.cookie=curCookie;
}

// returns null if cookie not found
function getCookie(name) {
var dc=document.cookie;
var prefix=name+"=";
var begin=dc.indexOf("; "+prefix);
if(begin==-1) {
	begin=dc.indexOf(prefix);
	if(begin!=0)
		return null;
	}
else
	begin+=2;
var end=document.cookie.indexOf(";",begin);
if(end==-1)
end=dc.length;
return unescape(dc.substring(begin+prefix.length,end));
}

function deleteCookie(name, path, domain) {
if(getCookie(name))
	document.cookie=name+"="+((path)?"; path="+path:"")+
	((domain)?"; domain="+domain:"")+"; expires=Thu, 01-Jan-70 00:00:01 GMT";
}

function fixDate(date) {
var base=new Date(0);
var skew=base.getTime();
if(skew>0)
	date.setTime(date.getTime()-skew);
}

var svgInstallBase="http://www.adobe.com/svg/viewer/install/";
var svgInstallPage=svgInstallBase+"auto/";
var svgInfoPage="http://www.adobe.com/svg/";
var svgDownloadPage=svgInstallBase;
var checkIntervalDays=30;
var firstSVG=true; // Ask only once per page even without cookies

function getSVGInstallPage() {
return svgInstallPage+"?"+location;
}

function getCheckInterval() {
return checkIntervalDays*24*60*60*1000;
}

// The value of the cookie is '0'. We need some value, but it doesn't matter what.
// We set the cookie for the entire site by specifying the path '/'.
// We could include something from adobe.com and set the cookie for that site.
// This would enable only asking once no matter how many sites a user encounters
// with SVG.
function setSVGCookie() {
if(getCheckInterval()>0) {
	var expires=new Date();
	fixDate(expires); // NN2/Mac bug
	expires.setTime(expires.getTime()+getCheckInterval());
	setCookie('SVGCheck','0',expires,'/')
	}
}

function isSVGPluginInstalled() {
return (navigator.mimeTypes["image/svg"]&&navigator.mimeTypes["image/svg"].enabledPlugin!=null)||
       (navigator.mimeTypes["image/svg-xml"]&&navigator.mimeTypes["image/svg-xml"].enabledPlugin!=null)||
       (navigator.mimeTypes["image/svg+xml"]&&navigator.mimeTypes["image/svg+xml"].enabledPlugin!=null);
}

 
    

function checkSVGViewer() {
window.askForSVGViewer=false;
if(window.svgInstalled)
	return;
getBrowser();
if(is_win32 && is_ie4up) {
	window.svgViewerAvailable=true;
	window.svgInstalled=isSVGControlInstalled();
	if(!window.svgInstalled)
		window.askForSVGViewer=true;
	}
else if((is_win32 && is_nav4up) || (is_macPPC && is_nav407up) || is_x86linuxmoz || is_solarismoz) {
	window.svgViewerAvailable=true;
	window.svgInstalled=isSVGPluginInstalled();
	if(!window.svgInstalled&&((is_nav408up&&navigator.javaEnabled())||is_x86linuxmoz||is_solarismoz))
		window.askForSVGViewer=true;
	}
else if(is_macPPC && is_ie5up)
	window.svgViewerAvailable=true;
}

function getSVGViewer() {
if(confirm('The Adobe SVG Viewer is not installed. Download now?'))
	location=getSVGInstallPage();
}

function checkAndGetSVGViewer() {
checkSVGViewer();
var svgCookie=getCookie('SVGCheck');
if(firstSVG&&!svgCookie) {
	if(window.askForSVGViewer) {
		setSVGCookie();
		getSVGViewer();
		}
	firstSVG=false;
	}
}

function emitSVG(embedAttrs) {
if(window.svgInstalled)
	document.writeln('<embed '+embedAttrs+'>');
else if(window.askForSVGViewer)	{
	if(navigator.appName=='Netscape') {
		document.writeln('<p>To view this page you need an SVG viewer.');
		document.writeln('<a href="'+getSVGInstallPage()+'">Click here</a> for more information.</p>');
		}
	else
		document.writeln('<embed '+embedAttrs+' pluginspage="'+getSVGInstallPage()+'">');
	}
else if(window.svgViewerAvailable)
	document.writeln('<embed '+embedAttrs+' pluginspage="'+svgDownloadPage+'">');
else {
	document.writeln('<p>To view this page you need an SVG viewer. There is currently no Adobe SVG ');
	document.writeln('Viewer available for your browser. ');
	document.writeln('<a href="'+svgInfoPage+'">Click here</a> for more information.</p>');
	}
}
//=================================== End SVG Check ===================================================

//CRGIS specific functions

function CapturePoints1(qryType) {
    var docContents;
    docContent = window.parent.frames['fraMap'];
    g_objSvg.setCoordinateUnits(1);

    //	g_objSvg.setDoNotClearGraphic(true); // this retains the graphics.

    if (qryType == 'cumulative') {
        g_objSvg.cmdCapturePolygon(callbackGetSpatialCoords, 'area');
    }
    else if (qryType == 'Point') {
        g_objSvg.cmdCapturePoint(callbackGetSpatialCoords, 'point');
    }
    else if (qryType == 'Line') {
    g_objSvg.cmdCapturePolyline(callbackGetSpatialCoords, 'polyline');
    }
}

function callbackGetSpatialCoords1(strCoords, strUserInfo) {

    SetMapToWaiting("Spatial report is generating...Map is refreshing...");
    var arrCoords
    var numOfCoords
    numOfCoords = strCoords.substring(0, strCoords.indexOf("|"));
    strCoords = strCoords.substring(strCoords.indexOf("|") + 1);
    strCoords = strCoords.split("|");
    window.parent.frames["fraMap"].GetPoints(numOfCoords, strCoords);
    g_strQryPnts = strCoords;
    
}
