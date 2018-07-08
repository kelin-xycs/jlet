
function $console() {

}

$console.writeLine = function writeLine(var1, val2, val3)
{

}

function $dialog() {

}

$dialog.isInit = false;
$dialog.txtFocusForNoSelection = null;
$dialog.draggingDiv = null;
$dialog.offX = 0;
$dialog.offY = 0;
$dialog.defaultZIndex = 50;
$dialog.draggingZIndex = 100;

$dialog.resizingDiv = null;
//$dialog.dialogDivs = [];

$dialog.draggingDiv_mousedown =
    function $dialog$draggingDiv_mousedown(div)
    {

        var e = window.event;

        $dialog.txtFocusForNoSelection.focus();
        div.focus();

        //$console.writeLine("div.canResize " + div.canResize);
        if (div.canResize)
        {
            div.resizeOriginalOffsetWidth = div.offsetWidth;
            div.resizeOriginalOffsetHeight = div.offsetHeight;
            div.resizeOriginalOffsetLeft = div.offsetLeft;
            div.resizeOriginalOffsetTop = div.offsetTop;
            div.resizeMouseOriginalX = e.clientX;
            div.resizeMouseOriginalY = e.clientY;
            //div.isResizing = true;

            $dialog.resizingDiv = div;

            window.addEventListener("mousemove", $dialog.window_mousemoveForResize);
            window.addEventListener("mouseup", $dialog.window_mouseupForResize);

            return;
        }
        
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
    function $dialog$window_mousemove()
    {
        
    
        if ( $dialog.draggingDiv == null )
            return;

        $dialog.txtFocusForNoSelection.focus();
        $dialog.draggingDiv.focus();

        var e = window.event;
        var div = $dialog.draggingDiv;

        div.style.position = "absolute";
        div.style.top = (e.clientY - $dialog.offY) + "px";
        div.style.left = (e.clientX - $dialog.offX) + "px";
    
    }

$dialog.window_mouseupForResize = function window_mouseupForResize()
{
    

    var div = $dialog.resizingDiv;

    div.canResize = false;
    div.resizeOrientation = "";

    $dialog.resizingDiv = null;

    window.removeEventListener("mousemove", $dialog.window_mousemoveForResize);
    window.removeEventListener("mouseup", $dialog.window_mouseupForResize);

    //$console.writeLine("window_mouseupForResize");
    //$console.writeLine("div.canResize", div.canResize);
    //div.canResize
}
$dialog.window_mousemoveForResize = function window_mousemoveForResize()
{
    

    //$console.writeLine("$dialog.div_mousemoveForResize begin!");
    var div = $dialog.resizingDiv;
    
    var e = window.event;

    if (div.resizeOrientation == "RightBottom")
    {
        div.style.width = (div.resizeOriginalOffsetWidth + (e.clientX - div.resizeMouseOriginalX)) + "px";
        div.style.height = (div.resizeOriginalOffsetHeight + (e.clientY - div.resizeMouseOriginalY)) + "px";
    }
    else if (div.resizeOrientation == "LeftTop")
    {
        div.style.width = (div.resizeOriginalOffsetWidth - (e.clientX - div.resizeMouseOriginalX)) + "px";
        div.style.height = (div.resizeOriginalOffsetHeight - (e.clientY - div.resizeMouseOriginalY)) + "px";
        div.style.left = (div.resizeOriginalOffsetLeft + (e.clientX - div.resizeMouseOriginalX)) + "px";
        div.style.top = (div.resizeOriginalOffsetTop + (e.clientY - div.resizeMouseOriginalY)) + "px";
    }
    else if (div.resizeOrientation == "LeftBottom")
    {
        div.style.width = (div.resizeOriginalOffsetWidth - (e.clientX - div.resizeMouseOriginalX)) + "px";
        div.style.height = (div.resizeOriginalOffsetHeight + (e.clientY - div.resizeMouseOriginalY)) + "px";
        div.style.left = (div.resizeOriginalOffsetLeft + (e.clientX - div.resizeMouseOriginalX)) + "px";
        //div.style.top = (div.resizeOriginalOffsetTop + (e.clientY - div.resizeMouseOriginalY)) + "px";
    }
    else if (div.resizeOrientation == "RightTop")
    {
        div.style.width = (div.resizeOriginalOffsetWidth + (e.clientX - div.resizeMouseOriginalX)) + "px";
        div.style.height = (div.resizeOriginalOffsetHeight - (e.clientY - div.resizeMouseOriginalY)) + "px";
        //div.style.left = (div.resizeOriginalOffsetLeft + (e.clientX - div.resizeMouseOriginalX)) + "px";
        div.style.top = (div.resizeOriginalOffsetTop + (e.clientY - div.resizeMouseOriginalY)) + "px";
    }
    else if (div.resizeOrientation == "Left")
    {
        div.style.width = (div.resizeOriginalOffsetWidth - (e.clientX - div.resizeMouseOriginalX)) + "px";
        div.style.left = (div.resizeOriginalOffsetLeft + (e.clientX - div.resizeMouseOriginalX)) + "px";
    }
    else if (div.resizeOrientation == "Right")
    {
        div.style.width = (div.resizeOriginalOffsetWidth + (e.clientX - div.resizeMouseOriginalX)) + "px";
    }
    else if (div.resizeOrientation == "Top")
    {
        div.style.height = (div.resizeOriginalOffsetHeight - (e.clientY - div.resizeMouseOriginalY)) + "px";
        div.style.top = (div.resizeOriginalOffsetTop + (e.clientY - div.resizeMouseOriginalY)) + "px";
    }
    else if (div.resizeOrientation == "Bottom")
    {
        div.style.height = (div.resizeOriginalOffsetHeight + (e.clientY - div.resizeMouseOriginalY)) + "px";
    }

    if (div.onDialogResize) 
        div.onDialogResize.call();
    

    //$console.writeLine("div.offsetWidth " + div.offsetWidth);
    //$console.writeLine("e.clientX " + e.clientX);
    //$console.writeLine("div.resizeMouseOriginalX " + div.resizeMouseOriginalX);
    //$console.writeLine("div.offsetHeight " + div.offsetHeight);
    //$console.writeLine("e.clientY " + e.clientY);
    //$console.writeLine("div.resizeMouseOriginalY " + div.resizeMouseOriginalY);
    //$console.writeLine("div.offsetWidth + (e.clientX - div.resizeMouseOriginalX) " + (div.offsetWidth + (e.clientX - div.resizeMouseOriginalX)));
    //$console.writeLine("div.offsetHeight + (e.clientY - div.resizeMouseOriginalY) " + (div.offsetHeight + (e.clientY - div.resizeMouseOriginalY)));
    
        
    
    //$console.writeLine()
    
    


}

$dialog.div_mousemoveForResize = function div_mousemoveForResize(div)
{
    
    if ($dialog.resizingDiv != null)
        return;


    var e = window.event;
    
    
    if (e.offsetX >= ((div.offsetWidth - 1) - 10) && e.offsetX <= (div.offsetWidth - 1)
        && e.offsetY >= (div.offsetHeight - 1) - 10 && e.offsetY <= (div.offsetHeight - 1))
    {
        div.style.cursor = "se-resize";
        div.canResize = true;
        div.resizeOrientation = "RightBottom";
    }
    else if (e.offsetX >= 1 && e.offsetX <= 10
        && e.offsetY >= 1 && e.offsetY <= 10)
    {
        div.style.cursor = "nw-resize";
        div.canResize = true;
        div.resizeOrientation = "LeftTop";
    }
    else if (e.offsetX >= 1 && e.offsetX <= 10
        && e.offsetY >= (div.offsetHeight - 1) - 10 && e.offsetY <= (div.offsetHeight - 1))
    {
        div.style.cursor = "sw-resize";
        div.canResize = true;
        div.resizeOrientation = "LeftBottom";
    }
    else if (e.offsetX >= ((div.offsetWidth - 1) - 10) && e.offsetX <= (div.offsetWidth - 1)
        && e.offsetY >= 1 && e.offsetY <= 10)
    {
        div.style.cursor = "ne-resize";
        div.canResize = true;
        div.resizeOrientation = "RightTop";
    }
    else if (e.offsetX >= 1 && e.offsetX <= 10)
    {
        div.style.cursor = "w-resize";
        div.canResize = true;
        div.resizeOrientation = "Left";
    }
    else if (e.offsetX >= ((div.offsetWidth - 1) - 10) && e.offsetX <= (div.offsetWidth - 1))
    {
        div.style.cursor = "e-resize";
        div.canResize = true;
        div.resizeOrientation = "Right";
    }
    else if (e.offsetY >= 1 && e.offsetY <= 10) {
        div.style.cursor = "n-resize";
        div.canResize = true;
        div.resizeOrientation = "Top";
    }
    else if (e.offsetY >= (div.offsetHeight - 1) - 10 && e.offsetY <= (div.offsetHeight - 1))
    {
        div.style.cursor = "s-resize";
        div.canResize = true;
        div.resizeOrientation = "Bottom";
    }
    else
    {
        div.style.cursor = "";
        div.canResize = false;
        div.resizeOrientation = "";
    }

    
    //$console.writeLine(div.canResize);
}


$dialog.createDialog =
    function $dialog$createDialog(elemt, left, top, width, height, onDialogResize) {

        //if (!elemt.id)
        //    throw "elemt 必须指定 id 。";

        if (left == undefined || left == null)
            left = 200;
        if (top == undefined || top == null)
            top = 100;

        if (width == undefined || width == null)
            width = 200;
        if (height == undefined || height == null)
            height = 150;

        if ( $dialog.isInit == false )
        {
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
        div.style.width = width + "px";
        div.style.height = height + "px";
        
        //div.attributes["onmousedown"] = "return false;";
        div.setAttribute("onmousedown", "return false;");
        div.addEventListener("mousedown", new Function("$dialog.draggingDiv_mousedown( this );return false;"));
        div.addEventListener("mousemove", new Function("$dialog.div_mousemoveForResize( this );"));
        
        if (onDialogResize)
            div.onDialogResize = onDialogResize;

        document.documentElement.appendChild(div);

        div.appendChild(elemt);

        return div;
    }


function $animation() {

}

$animation.create =
    function $animation$create(action, interval) {
        var ani = new $animation();
        ani.action = action;
        ani.interval = interval;
        ani.inv = null;

        return ani;
    }

$animation.start =
    function $animation$start(ani) {

        if (ani.inv != null)
            $animation.stop(ani);

        ani.stepCount = 0;
        ani.inv = window.setInterval(ani.action, ani.interval, ani);
    }

$animation.stop =
    function $animation$stop(ani) {
        window.clearInterval(ani.inv);
        ani.inv = null;
    }



function $console() {

}

$console.maxLineCount = 1000;
$console.enableWrite = true;


$console.create = function create() {
    var div = document.createElement("div");

    div.style.border = "solid 1px gray";
    //div.style.padding = "20px";
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.overflow = "hidden";
    div.style.display = "flex";
    div.style.flexFlow = "column";

    var divTitle = document.createElement("div");
    divTitle.style.marginBottom = "20px";
    divTitle.style.backgroundColor = "yellow";
    divTitle.innerText = "jlet Console";
    divTitle.style.margin = "20px";

    var divContent = document.createElement("div");
    divContent.style.overflow = "scroll";
    //divContent.style.paddingRight = "80px";
    divContent.style.margin = "20px";
    divContent.style.flex = "1";

    div.divTitle = divTitle;
    div.divContent = divContent;

    div.appendChild(divTitle);
    div.appendChild(divContent);

    
    $console.div = div;

    
    var ddiv = $dialog.createDialog(div, 800, 100, 300, 400);
    //ddiv.style.border = "solid 10px blue";
    $console.isCreated = true;
}


$console.writeLine = function writeLine(val1, val2, val3) {
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

    if (val != "") {
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