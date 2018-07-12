/* Called when the layout portion of the page is loaded */
function crgis_layout_ready() {
    $('.dropdown-toggle').dropdown();
    $('.dropdown input, .dropdown label').click(function (e) { e.stopPropagation(); });
    $("#menu-getting-started").click(function (e) { $("#getting-started-popup").modal('show'); });
    $("#menu-about").click(function (e) { $("#about-popup").modal('show'); });
    $("#menu-signout").click(function (e) { signout_click(e); });
};

/* Log user out */
function signout_click(e) {
    unathenticateUser();
};

/* Opens a new browser to let the user interact with the AOI/Map */
function crgis_open_map(baseUrl) {
    var mapWid = window.screen.availWidth - 20;
    var mapHgt = window.screen.availHeight - 45;
    var strPara = "resizable=1, directories=no, top=0,left=0,menubar=0, toolbar=no, status=yes, width=" + mapWid + ", height=" + mapHgt;
    window.open(baseUrl + "main.htm", "AppWin", strPara);
    window.location.reload();
}

/* Prevent drop down menus from closing when pressing keys. */
$(function () {
    $('.dropdown-menu').click(function (event) {
        event.stopPropagation();
    });
});