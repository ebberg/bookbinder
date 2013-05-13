var bookbinder = (function () {

    function events (that) {
        // via _JavaScript: The Good Parts_
        // by Douglass Crockford
        var that = that || {};
        var registry = {}; // type: {'string': [{ 'method': function or string, 'parameters': array }] }

        that.fire = function (event) {
            // Loops through all events registered to the event.
            var array,
                func,
                handler,
                i,
                type = typeof event === 'string' ? event : event.type;

            if (registry.hasOwnProperty(type)) {
                array = registry[type];
                for (i = 0; i < array.length; i += 1) {
                    handler = array[i];

                    // Handle two types for func: function or string (the name of a function).
                    func = handler.method;
                    if (typeof func === 'string') {
                        func = this[func];
                    }

                    func.apply(this,
                        handler.parameters || [event]);
                }
            }
            //return this;
        };

        that.on = function (type, method, parameters) {
            var handler = {
                method: method,        // type: function, string (the name of a function).
                parameters: parameters // type: array (optional)
            };
            if (registry.hasOwnProperty(type)) {
                registry[type].push(handler);
            } else {
                registry[type] = [handler];
            }
            //return this;
        };

        return that;
    };


    function animations (that) {
        var that = that || {};

        that.animate = function (elem, style, unit, from, to, time) {
            // TODO: probably chuck this function
            if ( elem === undefined ) {
                return;
            }
            var start = new Date().getTime();
            timer = setInterval(function () {
                var step = Math.min(1, (new Date().getTime() - start) / time );
                elem.style[style] = (from + step * (to - from)) + unit;
                if ( step === 1 ) {
                    clearInterval(timer);
                }
            }, 25);
            elem.style[style] = from + unit;
        };

        that.shiftHorizontally = function (xCordShift, direction) {
            // TODO: add animations to page slides
            if (direction === 'right') {
                window.scrollBy(xCordShift, 0);
            } else if (direction === 'left') {
                window.scrollBy(-1 * xCordShift, 0);
            } else {
                throw {
                    name: 'TypeError',
                    message: 'shiftHorizontally uses either left or right for directions'
                };
            }
        };

        that.fadeIn = function (id) {
            return undefined;
        };

        that.fadeOut = function (id) {
            return undefined;
        };

        return that;

    };


    function actions (that) {        
        var b = that || {};

        b = animations(b);

        b.textWidth = function () {
            return window.scrollMaxX;
        };

        b.textHeight = function () {
            return window.innerHeight;
        };

        b.pageWidth = function () {
            return window.innerWidth;
        };

        b.pageOffset = function () {
            // TODO: IE8 support. detect document.body.scrollLeft
            return window.pageXOffset;
        };

        b.addClassIn = function (classDOM, idDOM) {
            return undefined;
        };

        b.removeClassIn = function (classDOM, idDOM) {
            return undefined;
        };

        b.changeID = function (before, after) {
            errorID = document.getElementById(before);
            if (errorID !== null) {
                errorID.setAttribute("id", after);
            } else {
                return("Error: No " + before + " ID");
            }
        };

        b.pageRight = function () {
            b.shiftHorizontally(b.pageWidth(), "right");
            // TODO: hook into bookMemory
        };

        b.pageLeft = function () {
            b.shiftHorizontally(b.pageWidth(), "left");
            // TODO: hook into bookMemory
        };

        b.setBookHeight = function () {
            calculatedHeight = b.textHeight() / 1.25;
            document.getElementById("text").style.height = calculatedHeight + "px";
        }
        
        b.toVisibleBook = function () {
            b.changeID("warning", "warning-display-off");
            b.changeID("text-display-off", "text");
        };


        return b;
    };


    function book (that) {

        var b = that || {};

        var pageNumber = -1,
            pageTotal = -1,
            pageWidth = -1,
            textOffset = -1;

        b = events(b);
        b = actions(b);

        b.initBook = function () {
            pageNumber = 1;
            pagesTotal = b.currentPagesTotal();
            pageWidth = b.currentPageWidth();
            return(pageNumber + " out of " + pagesTotal);
        };

        b.showPageInfo = function () {
            // TODO: print out pageNumber of pageTotal in div#pageinfo
            return undefined;
        };

        b.currentPageTotal = function () {
            return Math.floor( (b.currentWidth() / b.currentPageWidth()) + 1);
        };

        b.currentPageNumber = function () {
            if (pageNumber > 0) {
                return pageNumber;
            } else {
                throw {
                    name: 'TypeError',
                    message: 'Page Numbers must be positive'
                };
            }
        };

        b.recalculatePages = function () {
            // TODO
            var oldPN = pagesNumber,
                oldPT = pagesTotal,
                oldPW = pageWidth,
                newPW = b.currentPageWidth();

            //given this info, calculate the new page numbers and page total.

        };

        b.on('window load', b.toVisibleBook);
        b.on('window load', b.initBook);
        b.on('render the screen', b.setBookHeight);
        b.on('render the screen', b.showPageInfo);

        window.onload = function () { 
            b.fire('window load');
            b.fire('render the screen');
        };

        window.onscroll = function () {
            // TODO
            console.log("scrolling");
        };

        window.onresize = function () {
            b.fire('render the screen');
        };
        
        //Register the keydown event handlers:
        document.onkeyup = function (e) {
            switch (e.keyCode) {
                case 37:
                    b.pageLeft();
                    break;
                case 39:
                    b.pageRight();
                    break;
                case 72:
                    b.pageLeft();
                    break;
                case 76:
                    b.pageRight();
                    break;
                default:
                    break;
            }
            return false;
        };

        document.onkeydown = function (e) {
            switch (e.keyCode) {
                case 37:
                    return false;
                    break;
                case 39:
                    return false;
                    break;
                default:
                    return true;
                    break;
            }
        }

        return b;
    };
    
    var bb = book();

    return bb;

}());