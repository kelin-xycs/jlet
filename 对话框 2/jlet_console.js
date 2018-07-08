



function $dialog() {

}

$dialog.isInit = false;
$dialog.txtFocusForNoSelection = null;
$dialog.draggingDiv = null;
$dialog.offX = 0;
$dialog.offY = 0;
$dialog.defaultZIndex = 50;
$dialog.draggingZIndex = 100;

//$dialog.dialogDivs = [];

$dialog.draggingDiv_mousedown =
    function $dialog$draggingDiv_mousedown(div) {

        var e = window.event;

        $dialog.txtFocusForNoSelection.focus();
        div.focus();

        if ($dialog.draggingDiv != null)
            $dialog.draggingDiv.style.zIndex = $dialog.defaultZIndex;

        div.style.zIndex = $dialog.draggingZIndex;


        $dialog.draggingDiv = div;
        //$writeMsg(div.offsetTop);
        $dialog.offX = e.clientX - div.offsetLeft;
        $dialog.offY = e.clientY - div.offsetTop;

        document.documentElement.style.cursor = "default";

        //div.focus();

        window.addEventListener("mouseup", $dialog.window_mouseup);
        window.addEventListener("mousemove", $dialog.window_mousemove);// = new Function("body_mousemove(event);");

    }

$dialog.window_mouseup =
    function $dialog$window_mouseup() {

        $dialog.txtFocusForNoSelection.focus();
        $dialog.draggingDiv.focus();

        document.documentElement.style.cursor = "";

        window.removeEventListener("mouseup", $dialog.window_mouseup);
        window.removeEventListener("mousemove", $dialog.window_mousemove);// = new Function("body_mousemove(event);");
    }

$dialog.window_mousemove =
    function $dialog$window_mousemove() {

        if ($dialog.draggingDiv == null)
            return;

        $dialog.txtFocusForNoSelection.focus();
        $dialog.draggingDiv.focus();

        var e = window.event;
        var div = $dialog.draggingDiv;

        div.style.position = "absolute";
        div.style.top = (e.clientY - $dialog.offY) + "px";
        div.style.left = (e.clientX - $dialog.offX) + "px";

    }


$dialog.createDialog =
    function $dialog$createDialog(elemt, left, top) {

        if (left == undefined || left == null)
            left = 200;
        if (top == undefined || top == null)
            top = 100;

        if ($dialog.isInit == false) {
            var txtFocus = document.createElement("input");
            txtFocus.type = "text";
            txtFocus.style.width = "0px";
            txtFocus.style.height = "0px";
            txtFocus.style.position = "absolute";
            txtFocus.style.top = "-10px";
            txtFocus.style.left = "-10px";

            document.documentElement.appendChild(txtFocus);

            $dialog.txtFocusForNoSelection = txtFocus;

            $dialog.isInit = true;
        }

        var div = document.createElement("div");

        div.style.position = "absolute";
        div.style.top = top + "px";
        div.style.left = left + "px";
        //div.attributes["onmousedown"] = "return false;";
        div.setAttribute("onmousedown", "return false;");
        div.addEventListener("mousedown", new Function("$dialog.draggingDiv_mousedown( this );return false;"));

        document.documentElement.appendChild(div);

        div.appendChild(elemt);


    }


function $console() {

}

$console.maxLineCount = 1000;
$console.enableWrite = true;


$console.create = function create()
{
    var div = document.createElement("div");

    div.style.border = "solid 1px gray";
    div.style.padding = "20px";
    div.style.height = "150px";

    var divTitle = document.createElement("div");
    divTitle.style.marginBottom = "20px";
    divTitle.style.backgroundColor = "yellow";
    divTitle.innerText = "jlet Console";

    var divContent = document.createElement("div");
    divContent.style.overflow = "scroll";
    divContent.style.paddingRight = "80px";
    divContent.style.height = "110px";
    
    div.divTitle = divTitle;
    div.divContent = divContent;

    div.appendChild(divTitle);
    div.appendChild(divContent);

    div.addEventListener("mousewheel", new Function("$console.zoom_mousewheel(this);"));

    $console.div = div;

    $dialog.createDialog(div, 800, 100);

    $console.isCreated = true;
}


$console.writeLine = function writeLine(val1, val2, val3)
{
    if (!$console.isCreated)
        return;
    if ($console.enableWrite == false)
        return;

    var val = "";
    
    if (val1 != undefined) {
        val += (val1 == null ? "null" : val1.toString());
    }
    
    if (val2 != undefined) {
        val += "&nbsp;";
        val += (val2 == null ? "null" : val2.toString());
    }

    if (val3 != undefined) {
        val += "&nbsp;";
        val += (val3 == null ? "null" : val3.toString());
    }

    if (val != "")
    {
        var span = document.createElement("span");
        span.innerHTML = val;

        var br = document.createElement("br");
        span.appendChild(br);

        var divContent = $console.div.divContent;

        divContent.appendChild(span);

        if (divContent.childNodes.length > $console.maxLineCount) {
            for (var i = 0; i < (divContent.childNodes.length - $console.maxLineCount) ; i++) {
                divContent.removeChild(divContent.childNodes[i]);
            }

        }
        
    }

}

$console.zoom_mousewheel = function zoom_mousewheel(elemt)
{
    var e = window.event;

    var newHeight = elemt.offsetHeight + (-1 * e.wheelDelta);

    if (newHeight < 150)
        newHeight = 150;

    elemt.style.height = newHeight + "px";
    elemt.divContent.style.height = (newHeight - 40) + "px";

}