function StartMap() {
  window.top.window.SetCookie('AltColors', '', 0);
  if(parent.gType == 'PNG') {ResetImgCtrl();}  //from jsgraphics.js

  window.parent.frames['fraControls'].IntiCtls();
  var strFeatures = GetStoredLayers();
  strFeatures = ( strFeatures.length > 0 ) ? '?' + strFeatures : strFeatures;
  window.parent.frames['fraMap'].location = '/ce/Application/ASP/GIS/Map/StartMap.asp' + strFeatures;
  window.parent.frames['fraControls'].MapCntrls.style.display = 'none';
}

function btnClick(divNme,dir,opt,idx) {
   var objBtn1 = document.all(divNme+"_1")
   var objBtn2  = document.all(divNme+"_2")
   var objBtn3 = document.all(divNme+"_3")
   var BtnIdx = (opt=='up') ? "" : "on"
   try{
    objBtn1.src = dir + "images/button" + idx + BtnIdx + "_01.gif"
    objBtn3.src = dir + "images/button" + idx + BtnIdx + "_03.gif"
    objBtn2.style.background = "url(" + dir + "images/button" + idx + BtnIdx + "_02.gif" + ")"
   }
   catch(everything) {
     return true;
   }
}


function GetMapSize (axis) {

if (axis == 'x') {
   var sizeX = window.parent.frames["fraMap"].document.body.offsetWidth
   return (sizeX - 46) }
 else {
   var sizeY = window.parent.frames["fraMap"].document.body.offsetHeight
   return (sizeY - 110) }
}

 
function truncate(x)
{
  return x < 0 ? Math.ceil(x) : Math.floor(x)
}

function AddMapTrack(sMap) {
  var objControl = window.TrackedMaps;
  var blnDelete = new Boolean(false);
  //Delete all maps greater than currently selected map.
  while ( objControl.selectedIndex + 1 < objControl.length ) {
    objControl.options[objControl.length - 1] = null;
    blnDelete = true;
  }
  //Add newly created map.
  if ( blnDelete == false ) {
    objControl.options[objControl.length] = new Option('Map# ' + objControl.length, sMap);
    objControl.selectedIndex = objControl.length - 1;
  }
}

function PrintMap() {
  var mapW, mapH,sURL,SearchArea, AreaName,selectItem, strLayer
  //mapW =  top.frames['fraControls'].frmGlobals.MapW.value;
 //mapH =  top.frames['fraControls'].frmGlobals.MapH.value;
   var sType = parent.gType
   mapW = 650 //700
   mapH = 529 //570
   SeachArea = ""
   AreaName = ""
   sURL = "/ce/Application/ASP/GIS/Map/maplayout.asp?mapW="+mapW+"&mapH="+mapH+"&SearchArea="+SearchArea+"&AreaName="+AreaName+"&NameFlag=&sType="+sType
   window.open(sURL,'','width=800,height=690,scrollbars=yes,resizable=yes');
 
}

function GenerateReport(nReportID, sID, sDepth, bReturn, sAltType) {
  var strType = new String('');
  var strDepth = new String('');
  if ( String(sDepth).toLowerCase() != 'undefined' ) {
    strDepth = sDepth;
  }
  
  switch (nReportID) {
    case 108:
      strType = 'KEYNO';
      break;
    case 109:
      strType = 'SITENO';
      break;
    case 117:
      strType = sAltType;
      break;
    case 118:
      strType = 'KEYNO';
      break;
    case 120:
      strType = 'REPORTNO';
      break;
   case 121:
      strType = 'KEYNO';
      break;  
   case 122:
      strType = 'KEYNO';
      break; 
  }
  
  if ( String(bReturn).toLowerCase() == 'undefined' || bReturn == false) {
    window.open('/ce/Application/ASPNET/Report/Reports.aspx?R=' + nReportID + '&T=' + strType + '&I=' + sID + '&O=A', 'ReportEngine', 'left=100,top=100,height=600,width=700,status=yes,menubar=0,scrollbars=1,resizable=1');
  } else if ( bReturn == true ) {
    return window.open('/ce/Application/ASPNET/Report/Reports.aspx?R=' + nReportID + '&T=' + strType + '&I=' + sID + '&O=A', 'ReportEngine', 'left=100,top=100,height=600,width=700,status=yes,menubar=0,scrollbars=1,resizable=1');
  }
}

function OpenPennProjRpt(ProjID) {
    GenerateReport(110, ProjID);
}

function OpenHistRpt(SiteNo, Depth, Return) {
  if ( Return == true ) {
    return GenerateReport(108, SiteNo, Depth, Return);
  } else {
    GenerateReport(108, SiteNo, Depth, Return);
  }
}

function OpenHistHDARpt(SiteNo, Depth, Return) {
  if ( Return == true ) {
    return GenerateReport(121, SiteNo, Depth, Return);
  } else {
    GenerateReport(121, SiteNo, Depth, Return);
  }
}

function OpenHistLnRpt(SiteNo, Depth, Return) {
  if ( Return == true ) {
    return GenerateReport(122, SiteNo, Depth, Return);
  } else {
    GenerateReport(122, SiteNo, Depth, Return);
  }
}

function OpenBridgeRpt(SiteNo, Depth, Return) {
  if ( Return == true ) {
    return GenerateReport(118, SiteNo, Depth, Return);
  } else {
    GenerateReport(118, SiteNo, Depth, Return);
  }
}

function OpenHistSurvRpt(ReportNo, Depth, Return) {
  if ( Return == true ) {
    return GenerateReport(116, ReportNo, Depth, Return);
  } else {
    GenerateReport(116, ReportNo, Depth, Return);
  }
}

function OpenArchRpt(SiteNo, Depth, Return) {
  if ( Return == true ) {
    return GenerateReport(109, SiteNo, Depth, Return);
  } else {
    GenerateReport(109, SiteNo, Depth, Return);
  }
}

function OpenArchSurvRpt(ERNO, Depth, Return) {
   //var strRptTitle = "Archaeological Survey - Detailed Report"
   //var strURL = "MapByMisc/ArchSurv_DetailSum.asp?ErNos="+SiteNo+"&rptTitle="+strRptTitle
   //window.open(strURL,"","height=380,width=600,scrollbars=yes,resizable=yes");
  if ( Return == true ) {
    return GenerateReport(116, ERNO, Depth, Return);
  } else {
    GenerateReport(116, ERNO, Depth, Return);
  }
}

function OpenSoilRpt(County, MuSym, Depth, Return) {
  //var str = "mapbymisc/soilreport.asp?musym="+MUSYM;
  //window.open(str,'soilreport','height=400,width=600,scrollbars=yes');
  if ( Return == true ) {
    return GenerateReport(117, MuSym, Depth, Return, County);
  } else {
    GenerateReport(117, MuSym, Depth, Return, County);
  }
}

function OpenHelpFile(Depth){
  var strOHFDepth = new String(Depth);
  strOHFDepth = ( strOHFDepth.toLowerCase() == 'undefined' ) ? '' : Depth;
  window.open('/ce/WebHelp/Help.htm','help','width=900, height=400, scrollbars=1, resizable=1,status=1,menubar=0');
}

function GetStoredLayers()
{
		strFeatures = ""
		strForce = ""
	
		if(window.opener != null) strFeatures = window.opener.top.frames['fraControls'].GetLayers();
		else strFeatures =  window.top.frames['fraControls'].GetLayers();	

		if(window.opener != null) strForce = window.opener.top.frames['fraControls'].GetForcedLayers();
		else strForce = window.top.frames['fraControls'].GetForcedLayers();	
			
		strFeatures = "Features=" + strFeatures;
		
		if ( strForce != '' ) {strFeatures += '&Force=' + strForce;}
		
		return strFeatures;		
}
