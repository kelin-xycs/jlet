
function $docEditor()
{

}

$docEditor.editors = [];

$docEditor.createNew = function createNew()
{
    return new $docEditor();
}

$docEditor.create = function create( docEditor )
{
    docEditor.create();
}

$docEditor.div_mousedown = function div_mousedown( id )
{
    var docEditor = this.editors[id];
    docEditor.div_mousedown();
}

$docEditor.txtBoxForInput_keydown = function txtBoxForInput_keydown( id )
{
    //$writeMsg("txtBoxForInput_keydown 1");
    var docEditor = this.editors[id];
    docEditor.txtBoxForInput_keydown();
},

$docEditor.div_mousemove = function div_mousemove( id )
{
    var docEditor = this.editors[id];
    docEditor.div_mousemove();
}

$docEditor.div_mouseup = function div_mouseup( id )
{
    var docEditor = this.editors[id];
    docEditor.div_mouseup();
}

$docEditor.txtBoxForInput_input = function txtBoxForInput_input(id)
{
    var docEditor = this.editors[id];
    docEditor.txtBoxForInput_input();
}

$docEditor.setFont = function setFont( docEditor, font )
{
    docEditor.setFont(font);
}

$docEditor.setFontSize = function setFontSize( docEditor, fontSize )
{
    docEditor.setFontSize(fontSize);
}

$docEditor.setFontColor = function setFontColor( docEditor, color )
{
    docEditor.setFontColor(color);
}

$docEditor.prototype =
    {
        id : null,
        div: null,

        editAreaPadding: 10,
        txtBoxForInputTopOffset : 60,

        insertPosition : null,
        isDivMouseDown : false,

        rowArray : null,
        beginX : null,
        beginY : null,
        span1 : null,
        span2 : null,

        txtBoxForInput: null,
        spanIcon: null,

        create : function create()
        {
            
            

            if (this.id == null || this.id == "")
                throw "必须为 docEditor 指定 id。";
            
            $docEditor.editors[this.id] = this;


            var div = this.div;

            this.txtBoxForInput = document.createElement("input");
            this.txtBoxForInput.style.position = "absolute";
            this.txtBoxForInput.style.width = "1px";
            this.txtBoxForInput.style.height = "1px";
            this.txtBoxForInput.style.zIndex = -1;
            document.documentElement.appendChild(this.txtBoxForInput);

            this.spanIcon = document.createElement("span");//document.getElementById("spanIcon");
            this.spanIcon.style.display = "block";
            this.spanIcon.style.backgroundColor = "black";
            this.spanIcon.style.width = "1px";
            //spanIcon.style.height = "18px";
            this.spanIcon.style.position = "absolute";

            document.documentElement.appendChild(this.spanIcon);

            if (div.childNodes.length == 0) {
                var spanSpace = this.createSpanSpace();

                div.appendChild(spanSpace);
                this.insertPosition = spanSpace;
            }
            else {
                this.insertPosition = div.childNodes[0];
            }

            this.setSpanIcon();

            div.addEventListener("mousedown", new Function("$docEditor.div_mousedown( '" + this.id + "' );"));
            
            div.addEventListener("mousemove", new Function("$docEditor.div_mousemove( '" + this.id + "' );"));
            
            //div.addEventListener("mouseup", div_mouseup);
            window.addEventListener("mouseup", new Function("$docEditor.div_mouseup( '" + this.id + "' );"));
            this.txtBoxForInput.addEventListener("input", new Function("$docEditor.txtBoxForInput_input( '" + this.id + "' );"));
            this.txtBoxForInput.addEventListener("keydown", new Function("$docEditor.txtBoxForInput_keydown( '" + this.id + "' );"));

            var ani = $animation.create(this.spanIcon_Action, 360);
            ani.spanIcon = this.spanIcon;
            $animation.start(ani);

        },

        createSpanSpace : function createSpanSpace()
        {
            var spanSpace = this.createSpan();
            spanSpace.innerHTML = "&nbsp;&nbsp;";
            spanSpace.style.display = "inline-block";

            return spanSpace;
        },

        txtBoxForInput_keydown : function txtBoxForInput_keydown()
        {
            var e = window.event;

            if (e.keyCode == 8) {
                this.doBackspace();
            }
            else if (e.keyCode == 13) {
                this.doEnter();
            }
        },

        doEnter: function doEnter()
        {
            //var spanBr = document.createElement("span");

            this.deleteSelection();

            var spanBr = this.createSpan();
            spanBr.innerHTML = "&nbsp;&nbsp;<br />";

            this.div.insertBefore(spanBr, this.insertPosition);

            if (this.insertPosition == null) {
                //var spanSpace = document.createElement("span");
                var spanSpace = this.createSpanSpace();

                this.div.insertBefore(spanSpace, this.insertPosition);
                this.insertPosition = spanSpace;
            }

            this.setSpanIcon();
        },

        doBackspace: function doBackspace()
        {
            if (this.div.childNodes.length == 0)
                return;

            var selectedSpanArray = this.getSelectedSpanArray();

            if (selectedSpanArray.length > 0) {
                this.deleteSelection();
            }
            else {
                //$writeMsg("txtBoxForInput_keydown 2");

                var deleteSpan;

                if (this.insertPosition == null) {
                    deleteSpan = this.div.childNodes[this.div.childNodes.length - 1];
                }
                else {
                    deleteSpan = this.insertPosition.previousElementSibling;
                }

                if (deleteSpan != null)
                {
                    this.div.removeChild(deleteSpan);
                }
                
            }


            this.setSpanIcon();
        },

        getE: function getE()
        {
            var e = window.event;

            var newE = new Object();

            newE.clientX = e.clientX;
            newE.clientY = e.clientY + document.body.scrollTop;

            return newE;
        },

        div_mousedown: function div_mousedown()
        {
            //$writeMsg("div_mousedown 1");
            
            this.isDivMouseDown = true;
            
            //$writeMsg("this.isDivMouseDown " + this.isDivMouseDown);
            this.unselectSpanAll();

            //var e = window.event;
            var e = this.getE();

            this.beginX = e.clientX;
            this.beginY = e.clientY;

            //alert("div_mousedown 2");
            this.rowArray = this.getRowArray();
            //alert("after getRowArray");
            var row;
            var span;
            var tempInsertPosition = null;

            for (var i = 0; i < this.rowArray.length; i++)
            {
                row = this.rowArray[i];

                if (e.clientY <= row.bottomY)
                {
                    tempInsertPosition = this.getSpanOnMouseFromRowForSetIcon(row, e.clientX);

                    //for (var j=row.beginSpanIndex; j<=row.endSpanIndex; j++)
                    //{
                    //    span = this.div.childNodes[j];

                    //    if (e.clientX >= span.offsetLeft && e.clientX < (span.offsetLeft + span.offsetHeight))
                    //    {
                    //        if (e.clientX < (span.offsetLeft + span.offsetWidth/2))
                    //            tempInsertPosition = span;
                    //        else
                    //            tempInsertPosition = span.nextElementSibling;
                    //    }

                    //    if (tempInsertPosition != null)
                    //        break;
                    //}
                }

                if (tempInsertPosition != null)
                    break;
            }

            //for (var i = 0; i < this.div.childNodes.length; i++)
            //{
            //    span = this.div.childNodes[i];

                
            //    if ((e.clientY + document.body.scrollTop) < (span.offsetTop + span.offsetHeight) && (e.clientX >= span.offsetLeft)
            //        && (e.clientX <= (span.offsetLeft + span.offsetWidth))
            //        )
            //    {
            //        tempInsertPosition = span;
            //        break;
            //    }
                
            //    if ((e.clientY + document.body.scrollTop) < (span.offsetTop + span.offsetHeight) && (e.clientX > span.offsetLeft)
            //        && span.nextElementSibling != null
            //        && (span.offsetTop + span.offsetHeight) < (span.nextElementSibling.offsetTop + span.nextElementSibling.offsetHeight)
            //        ) 
            //    {
            //        tempInsertPosition = span;
            //        break;
            //    }
                
            //}

            //if (tempInsertPosition == null && this.div.childNodes.length > 0)
            //    tempInsertPosition = this.div.childNodes[this.div.childNodes.length - 1];

            this.insertPosition = tempInsertPosition;
            //$writeMsg(this.insertPosition == null ? "insertPosition null" : this.insertPosition.outerHTML);
            
            //this.txtBoxForInput.blur();
            this.setSpanIcon();
        },

        getRowArray : function getRowArray()
        {
            var tempRowArray = [];
            var span;
            var firstSpan = this.div.childNodes[0];

            var j=0;
            for(var i=0; i<this.div.childNodes.length; i++)
            {
                span = this.div.childNodes[i];

                if (span.offsetLeft == firstSpan.offsetLeft)
                {
                    tempRowArray[j] = { beginSpanIndex: i, endSpanIndex : null };
                }
                if (span.nextElementSibling == null || span.nextElementSibling.offsetLeft == firstSpan.offsetLeft)
                {
                    tempRowArray[j].endSpanIndex = i;
                    j++;
                }
            }

            //alert("333333");
            
            var row;
            var span;
            var maxBottomY;
            
            for(var i=0; i<tempRowArray.length; i++)
            {
                //alert("44444 tempRowArray.length " + tempRowArray.length);
                maxBottomY = null;
                

                row = tempRowArray[i];
                
                for(var j=row.beginSpanIndex; j<=row.endSpanIndex; j++)
                {
                    
                    //alert("55555 row.beginSpanIndex " + row.beginSpanIndex);
                    //alert("55555 row.endSpanIndex " + row.endSpanIndex);
                    span = this.div.childNodes[j];

                    //$writeMsg(span.outerHTML);
                    //$writeMsg(span.offsetTop);

                    if (maxBottomY == null)
                    {
                        maxBottomY = span.offsetTop + span.offsetHeight;
                    }
                    else
                    {
                        if (maxBottomY < (span.offsetTop + span.offsetHeight))
                        {
                            maxBottomY = span.offsetTop + span.offsetHeight;
                        }
                    }

                }

                
                row.bottomY = maxBottomY;
                
            }

            return tempRowArray;
        },

        div_mousemove: function div_mousemove()
        {
            
            this.txtBoxForInput.focus();
            //$writeMsg("this.isDivMouseDown " + this.isDivMouseDown);
            if (this.isDivMouseDown == false)
                return;

            $writeMsg("");
            $writeMsg("div_mousemove 1");

            //$writeMsg("div_mousemove 2");
            this.unselectSpanAll();
            
            //var e = window.event;
            var e = this.getE();


            this.rowArray = this.getRowArray();

            var row;
            var span;

            var x1;
            var y1;
            var x2;
            var y2;

            //$writeMsg("开始循环");
            for (var i = 0; i < this.rowArray.length; i++)
            {
                $writeMsg("rowArray length " + this.rowArray.length);
                $writeMsg("i " + i);
                row = this.rowArray[i];

                if (x1 == null)
                {
                    $writeMsg("if (x1 == null)");
                    if (e.clientY <= row.bottomY && this.beginY <= row.bottomY)
                    {
                        $writeMsg("if (e.clientY <= row.bottomY && this.beginY <= row.bottomY)");
                        if (e.clientX < this.beginX)
                        {
                            x1 = e.clientX;
                            y1 = e.clientY;
                            x2 = this.beginX;
                            y2 = this.beginY;
                        }
                        else
                        {
                            x1 = this.beginX; 
                            y1 = this.beginY;
                            x2 = e.clientX;
                            y2 = e.clientY;
                        }

                        $writeMsg("this.span1 = this.getSpanOnMouseFromRowForSelect(row, x1);");
                        this.span1 = this.getSpanOnMouseFromRowForSelect(row, x1);
                        $writeMsg("span1 " + this.span1.outerHTML);
                        $writeMsg("this.span2 = this.getSpanOnMouseFromRowForSelect(row, x2);");
                        this.span2 = this.getSpanOnMouseFromRowForSelect(row, x2);
                        $writeMsg("span2 " + this.span2.outerHTML);
                        $writeMsg("e.clientX " + e.clientX);
                        $writeMsg("e.clientY " + e.clientY);
                        $writeMsg("this.beginX " + this.beginX);
                        $writeMsg("this.beginY " + this.beginY);
                        $writeMsg("row.bottomY " + row.bottomY);
                        break;
                    }
                    else 
                    {
                        $writeMsg("else");
                        $writeMsg("this.beginY " + this.beginY);
                        $writeMsg("e.clientY " + e.clientY);
                        $writeMsg("row.topY " + row.topY);
                        $writeMsg("row.bottomY " + row.bottomY);
                        if (e.clientY <= row.bottomY && !(this.beginY <= row.bottomY))
                        {
                            x1 = e.clientX;
                            y1 = e.clientY;
                            x2 = this.beginX;
                            y2 = this.beginY;
                        }
                        else if (!(e.clientY <= row.bottomY) && this.beginY <= row.bottomY)
                        {
                            x1 = this.beginX;
                            y1 = this.beginY;
                            x2 = e.clientX;
                            y2 = e.clientY;
                        }

                        this.span1 = this.getSpanOnMouseFromRowForSelect(row, x1);
                        continue;
                    }
                }
                else
                {
                    $writeMsg("x != null");
                    if (y2 <= row.bottomY)
                    {
                        $writeMsg("this.span2 = this.getSpanOnMouseFromRowForSelect(row, x2, true);");
                        this.span2 = this.getSpanOnMouseFromRowForSelect(row, x2, true);
                        $writeMsg(this.span2 == null ? "span2 is null" : this.span2.outerHTML);
                        break;
                    }
                    
                }
                
            }

            
            //$writeMsg("span1 " + this.span1.outerHTML);
            //$writeMsg("span2 " + this.span2);

            $writeMsg("for循环结束");
            $writeMsg("span1 " + (this.span1 == null ? "span1 is null" : this.span1.outerHTML));
            $writeMsg("span2 " + (this.span2 == null ? "span2 is null" : this.span2.outerHTML));
            if (this.span1 != null && this.span2 == null)
            {
                this.span2 = this.div.childNodes[this.div.childNodes.length - 1];
            }


            //$writeMsg("span1 " + this.span1.outerHTML);
            //$writeMsg("span2 " + this.span2.outerHTML);
            var selectedSpanArray = this.getSelectedSpanArray();
            //$writeMsg(selectedSpanArray.length);
            for (var i=0; i<selectedSpanArray.length; i++)
            {
                var span = selectedSpanArray[i];
                this.selectSpan(span);
            }

            //this.txtBoxForInput.focus();
        },

        getSpanOnMouseFromRowForSelect: function getSpanOnMouseFromRowForSelect(row, x, is_x2_and_x1x2notInOneRow)
        {
            $writeMsg("getSpanOnMouseFromRowForSelect begin!");
            var span;
            
            span = this.div.childNodes[row.beginSpanIndex];
            if (x < span.offsetLeft)
            {
                $writeMsg("if (x < span.offsetLeft) ");
                if (is_x2_and_x1x2notInOneRow == true)
                    return span.previousElementSibling == null ? span : span.previousElementSibling;
                else
                    return span;
            }

            span = this.div.childNodes[row.endSpanIndex];
            if (x > (span.offsetLeft + span.offsetWidth))
            {
                $writeMsg("if (x > (span.offsetLeft + span.offsetWidth))");
                return span;
            }

            for (var i=row.beginSpanIndex; i<=row.endSpanIndex; i++)
            {
                $writeMsg("for (var i=row.beginSpanIndex; i<=row.endSpanIndex; i++)");
                span = this.div.childNodes[i];

                if (x >= span.offsetLeft && x <= (span.offsetLeft + span.offsetWidth))
                {
                    return span;
                }

                $writeMsg(span.outerHTML);
                $writeMsg("x " + x);
                $writeMsg("span.offsetLeft " + span.offsetLeft);
                $writeMsg("span.offsetWidth " + span.offsetWidth);
                //if (x >= span.offsetLeft && x< (span.offsetLeft + span.offsetWidth / 2))
                //{
                //    $writeMsg("if (x >= span.offsetLeft && x< (span.offsetLeft + span.offsetWidth / 2))");
                //    return span;
                //}
                //else if (x >= (span.offsetLeft + span.offsetWidth / 2) && x <= (span.offsetLeft + span.offsetWidth))
                //{
                //    $writeMsg("else if (x >= (span.offsetLeft + span.offsetWidth / 2) && x <= (span.offsetLeft + span.offsetWidth))");
                //    return span.nextElementSibling == null ? span : span.nextElementSibling;
                //}
            }
            $writeMsg("getSpanOnMouseFromRowForSelect end!");
        },

        getSpanOnMouseFromRowForSetIcon: function getSpanOnMouseFromRowSetIcon(row, x)
        {
            var span;

            span = this.div.childNodes[row.beginSpanIndex];
            if (x < span.offsetLeft)
            {
                return span;
            }

            span = this.div.childNodes[row.endSpanIndex];
            if (x > (span.offsetLeft + span.offsetWidth))
            {
                return span;
            }

            for (var i = row.beginSpanIndex; i <= row.endSpanIndex; i++)
            {
                span = this.div.childNodes[i];

                if (x >= span.offsetLeft && x < (span.offsetLeft + span.offsetWidth / 2))
                {
                    return span;
                }
                else if (x >= (span.offsetLeft + span.offsetWidth / 2) && x <= (span.offsetLeft + span.offsetWidth))
                {
                    return span.nextElementSibling;
                }
            }

        },

        div_mouseup: function div_mouseup()
        {
            this.isDivMouseDown = false;
        },

        selectSpan: function selectSpan(span)
        {
            span.style.backgroundColor = "blue";
            span.style.color = "white";
        },

        unselectSpanAll: function unselectSpanAll()
        {
            //$writeMsg("unselectSpanAll");

            var selectedSpanArray = this.getSelectedSpanArray();

            for (var i = 0; i < selectedSpanArray.length; i++) {
                this.unselectSpan(selectedSpanArray[i]);
            }

            this.span1 = null;
            this.span2 = null;
        },

        unselectSpan: function unselectSpan(span)
        {
            span.style.backgroundColor = "";

            if (span.myColor == undefined || span.myColor == "")
                span.style.color = "";
            else
                span.style.color = span.myColor;

        },

        deleteSelection : function deleteSelection() {
            //$writeMsg(1111);
            var selectedSpanArray = this.getSelectedSpanArray();
            //$writeMsg(2222);
            if (selectedSpanArray.length == 0)
                return;

            this.insertPosition = selectedSpanArray[selectedSpanArray.length - 1].nextElementSibling;

            //$writeMsg("deleteSelection insert position " + insertPosition.outerHTML);

            for (var i = 0; i < selectedSpanArray.length; i++) {
                //$writeMsg(selectedSpanArray[i].outerHTML);
                this.div.removeChild(selectedSpanArray[i]);
            }

            this.span1 = null;
            this.span2 = null;
            //return insertPosition;
        },

        getSelectedSpanArray: function getSelectedSpanArray()
        {
            var spanArray = [];
            //$writeMsg("span1 " + span1.outerHTML);
            //$writeMsg("span2 " + span2.outerHTML);
            if (this.span1 == null || this.span2 == null)
                return spanArray;


            spanArray[0] = this.span1;

            if (this.span1 == this.span2)
                return spanArray;

            var nextSpan = this.span1.nextElementSibling;

            for (var i = 1; i < 2000; i++) {
                //$writeMsg(i);

                spanArray[i] = nextSpan;
                //$writeMsg("spanArray[i] " + spanArray[i].outerHTML);
                if (nextSpan == this.span2)
                    break;
                nextSpan = nextSpan.nextElementSibling;
            }

            return spanArray;
        },

        txtBoxForInput_input: function txtBoxForInput_input()
        {
            //div.removeChild(spanIcon);
            //div.innerHTML += txtBoxForInput.value;
            //$writeMsg("txtBoxForInput_input");
            //var insertPosition = null;
            //if (span1 != null)
            //insertPosition = deleteSelection();

            this.deleteSelection();

            //if (insertPosition == null)
            //    $writeMsg("insert Position is null.");
            //else
            //    $writeMsg("insert Position " + insertPosition.outerHTML);
            var span;
            var text;
            for (var i = 0; i < this.txtBoxForInput.value.length; i++) {
                //s += "<span onmouseover='span_mouseover(this);'>" + txtBoxForInput.value[i] + "</span>";

                //$writeMsg(txtBoxForInput.value[i]);

                span = this.createSpan();
                //var span = document.createElement("span");
                //span.addEventListener("mousemove", new Function("span_mousemove(this);"));
                //span.addEventListener("mousedown", new Function("span_mousedown(this);"));

                text = this.txtBoxForInput.value[i];

                //$writeMsg("text == '' " + (text == " "));

                if (text == " ")
                    span.innerHTML = "&nbsp;";
                else
                    span.innerText = text;

                span.style.display = "inline-block";
                //span.style.backgroundColor = "yellow";

                this.div.insertBefore(span, this.insertPosition);

                //if (text == " ")
                //{
                //    $writeMsg("set span innerHTML ' '");
                //    span.innerHTML == "456";
                //    //span.innerText = "456";
                //}

            }

            this.setSpanIcon();
            //$writeMsg(div.innerHTML);
            this.txtBoxForInput.value = "";
            //div.innerHTML += s;

            //div.appendChild(spanIcon);
        },

        createSpan: function createSpan()
        {
            var span = document.createElement("span");

            //span.addEventListener("mousemove", new Function("span_mousemove(this);"));
            //span.addEventListener("mousedown", new Function("span_mousedown(this);"));

            return span;
        },

        setSpanIcon: function setSpanIcon()
        {
            //$writeMsg(e.clientX);
            //$writeMsg(e.clientX < (span.offsetLeft + (span.offsetWidth / 2)));

            if (this.div.childNodes.length == 0)
            {
                var spanSpace = this.createSpanSpace();

                this.div.appendChild(spanSpace);
                this.insertPosition = spanSpace;

                this.spanIcon.style.top = this.insertPosition.offsetTop + "px";
                this.spanIcon.style.left = this.insertPosition.offsetLeft + "px";
                this.spanIcon.style.height = this.insertPosition.offsetHeight + "px";

                this.txtBoxForInput.style.top = (this.insertPosition.offsetTop + this.txtBoxForInputTopOffset) + "px";
                this.txtBoxForInput.style.left = this.insertPosition.offsetLeft + "px";

                return;
            }


            if (this.insertPosition == null)
            {
                
                var lastSpan = this.div.childNodes[this.div.childNodes.length - 1];
                
                this.spanIcon.style.top = lastSpan.offsetTop + "px";
                this.spanIcon.style.left = (lastSpan.offsetLeft + lastSpan.offsetWidth) + "px";
                this.spanIcon.style.height = lastSpan.offsetHeight + "px";

                this.txtBoxForInput.style.top = (lastSpan.offsetTop + this.txtBoxForInputTopOffset) + "px";
                this.txtBoxForInput.style.left = (lastSpan.offsetLeft + lastSpan.offsetWidth) + "px";
                

            }
            else
            {
                
                this.spanIcon.style.top = this.insertPosition.offsetTop + "px";
                this.spanIcon.style.left = this.insertPosition.offsetLeft + "px";
                this.spanIcon.style.height = this.insertPosition.offsetHeight + "px";

                this.txtBoxForInput.style.top = (this.insertPosition.offsetTop + this.txtBoxForInputTopOffset) + "px";
                this.txtBoxForInput.style.left = this.insertPosition.offsetLeft + "px";
                

            }

        },

        spanIcon_Action: function spanIcon_Action(ani)
        {
            var spanIcon = ani.spanIcon;
            //$writeMsg(spanIcon.style.display);
            if (spanIcon.style.display != "none") {
                if (ani.stepCount > 1) {
                    spanIcon.style.display = "none";
                    ani.stepCount = 0;
                }
            }

            else {
                if (ani.stepCount > 0) {
                    spanIcon.style.display = "";
                    ani.stepCount = 0;
                }

            }

            ani.stepCount++;

        },

        setFont : function setFontFamily( font )
        {

            var selectedSpanArray = this.getSelectedSpanArray();

            for (var i = 0; i < selectedSpanArray.length; i++) 
            {
                selectedSpanArray[i].style.fontFamily = font;
            }
        },

        setFontSize: function setFontSize( fontSize )
        {

            var selectedSpanArray = this.getSelectedSpanArray();

            for (var i = 0; i < selectedSpanArray.length; i++) 
            {
                selectedSpanArray[i].style.fontSize = fontSize;
            }
        },

        setFontColor: function setFontColor( color )
        {
            //$writeMsg(color);
            var selectedSpanArray = this.getSelectedSpanArray();

            for (var i = 0; i < selectedSpanArray.length; i++)
            {
                selectedSpanArray[i].style.color = color;
                selectedSpanArray[i].myColor = color;
            }
        }

    }





function $writeMsg(msg) {

    //document.getElementById("txaMsg").value += msg + "\r\n";
}






//$writeMsg(11111111111111);

//$writeMsg(22222222222);


