//++++++++++++++++++++++++++++++++++++++++
//General javascript functions.
//++++++++++++++++++++++++++++++++++++++++

function KeyDownHandler(btn) {
    // process only the Enter key
    if (event.keyCode == 13)
    {
        // submit the form by programmatically clicking the specified button
        if (btn == null) {
            // continue with the default submit
            event.returnValue=true;
            event.cancel = false;
        } else {
            // cancel the default submit
            event.returnValue=false;
            event.cancel = true;
            btn.click();
        }
    }
}
    
function PopupPicker(ctl) {
    // function to open DatePicker window.
    var PopupWindow=null;
    settings='width=220,height=225,location=no,directories=no,menubar=no,toolbar=no,status=no,scrollbars=no,' + 
			'resizable=no,dependent=no';
    PopupWindow=window.open('/ce/Support/DatePicker.aspx?Ctl=' + ctl,'DatePicker',settings);
    PopupWindow.focus();
}
   
function PopupInfo(featurename, featurekey) {
    // function to open FeatureInfo window.
    var PopupWindow=null;
    settings='width=300,height=400,location=no,directories=no,menubar=no,toolbar=no,status=yes,scrollbars=yes,' + 
		    'resizable=yes,dependent=no';
    PopupWindow = window.open('<%= Page.ResolveUrl("~/Map/FeatureInfo.aspx") %>?FeatureName=' + featurename + '&FeatureKey=' + featurekey,
            'PopupInfo',settings);
    PopupWindow.focus();
}

/*CRGIS Functions STARTS*/

function GenerateReport(nReportID, sID, sDepth, bReturn, sAltType) {
    var strType = new String('');
    var strDepth = new String('');
    if (String(sDepth).toLowerCase() != 'undefined') {
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

    if (String(bReturn).toLowerCase() == 'undefined') {
        window.open('/ce/Application/ASPNET/Report/Reports.aspx?R=' + nReportID + '&T=' + strType + '&I=' + sID + '&O=A', 'ReportEngine', 'left=100,top=100,height=600,width=700,status=yes,menubar=0,scrollbars=1,resizable=1');
    } else if (bReturn == true) {
    return window.open('/ce/Application/ASPNET/Report/Reports.aspx?R=' + nReportID + '&T=' + strType + '&I=' + sID + '&O=A', 'ReportEngine', 'left=100,top=100,height=600,width=700,status=yes,menubar=0,scrollbars=1,resizable=1');
    }
}

function OpenPennProjRpt(ProjID) {
    GenerateReport(110, ProjID);
}
function OpenBridgeRpt(sKeyNo) {
    window.open('../Application/ASPNET/Report/Reports.aspx?R=118&T=KEYNO&I=' + sKeyNo + '&O=A', 'ReportEngine', 'left=100,top=100,height=600,status=yes,menubar=0,scrollbars=1,resizable=1');
}
function OpenHistLnRpt(sKeyNo) {
    window.open('/ce/Application/ASPNET/Report/Reports.aspx?R=122&T=KEYNO&I=' + sKeyNo + '&O=A', 'ReportEngine', 'left=100,top=100,height=600,status=yes,menubar=0,scrollbars=1,resizable=1');
}
function OpenHistHDARpt(sKeyNo) {
    window.open('/ce/Application/ASPNET/Report/Reports.aspx?R=121&T=KEYNO&I=' + sKeyNo + '&O=A', 'ReportEngine', 'left=100,top=100,height=600,status=yes,menubar=0,scrollbars=1,resizable=1');
}
function OpenHistRpt(sKeyNo) {
    window.open('/ce/Application/ASPNET/Report/Reports.aspx?R=108&T=KEYNO&I=' + sKeyNo + '&O=A', 'ReportEngine', 'left=100,top=100,height=600,status=yes,menubar=0,scrollbars=1,resizable=1');
}

function OpenHistSurvRpt(ReportNo) {
    window.open('/ce/Application/ASPNET/Report/Reports.aspx?R=116&T=REPORTNO&I=' + ReportNo + '&O=A', 'ReportEngine', 'left=100,top=100,height=600,status=yes,menubar=0,scrollbars=1,resizable=1');
}

function OpenArchRpt(SiteNo) {
    window.open('/ce/Application/ASPNET/Report/Reports.aspx?R=109&T=SITENO&I=' + SiteNo + '&O=A', 'ReportEngine', 'left=100,top=100,height=600,status=yes,menubar=0,scrollbars=1,resizable=1');
}

function OpenArchSurvRpt(ERNO) {
    window.open('/ce/Application/ASPNET/Report/Reports.aspx?R=116&T=ERNO&I=' + ERNO + '&O=A', 'ReportEngine', 'left=100,top=100,height=600,status=yes,menubar=0,scrollbars=1,resizable=1');
}

function OpenSoilRpt(County, MuSym) {
    window.open('/ce/Application/ASPNET/Report/Reports.aspx?R=117&T=' + County + '&I=' + MuSym + '&O=A', 'ReportEngine', 'left=100,top=100,height=600,status=yes,menubar=0,scrollbars=1,resizable=1');
}


/*CRGIS Functions END*/
    
function isCapsLock(oControl, oEvent) {
    // function to check if caps lock key is on for given control.
	var blnShift = new Boolean(false);
	var numASCII = new Number(0);
  
	var strAlert = new String('');
	strAlert += 'Caps Lock is on.\n\n';
	strAlert += 'Having Caps Lock on may cause you to enter your password incorrectly.\n\n';
	strAlert += 'You may want to turn it off before entering your password.\n\n';
	  
	if ( document.all ) {                             //Internet Explorer >= 4
		numASCII = oEvent.keyCode;
		blnShift = oEvent.shiftKey;
	 
	} else if ( document.layers ) {                   //Netscape 4
		numASCII = oEvent.which;
		blnShift = ( numASCII == 16 ) ? true : false;
	 
	} else if ( document.getElementById ) {           //Netscape 6
		numASCII = oEvent.which;
		blnShift = ( numASCII == 16 ) ? true : false;
	}
	  
	var blnCapsLocked = new Boolean(false);
	if ( 65 <= numASCII && numASCII <= 90 && !blnShift ) {
		blnCapsLocked = true;
	} else if ( 97 <= numASCII && numASCII <= 122 && blnShift ) {
		blnCapsLocked = true;
	}
	  
	if ( blnCapsLocked == true ) {
		oControl.clAlert = ( !Boolean(oControl.clAlert) && Number(oControl.clCount) > 0 ) ? true : oControl.clAlert;
	 
		if ( Boolean(oControl.clAlert) ) {
		alert(strAlert);
		oControl.clAlert = false;
		oControl.clCount = 0;
		}
	} else {
		oControl.clCount = Number(oControl.clCount) + 1;
	}
}

/* Prevents events from firing too often */
function debouncer(func, timeout) {
    var timeoutID, timeout = timeout || 100;
    return function () {
        var scope = this, args = arguments;
        clearTimeout(timeoutID);
        timeoutID = setTimeout(function () {
            func.apply(scope, Array.prototype.slice.call(args));
        }, timeout);
    }
}