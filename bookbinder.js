// Bookbinder.
// author = ["eric", "berg"]
// email = copyright[0] + "@" + author[1] + "d.net"

var bookbinder = (function () {

    // silly MVC

    // 'controller'
    function eventuality (that) {
        // adds methods that process events.
        // JavaScript: The Good Parts
        // API: fire, on

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



    // 'view'
    function transforming (that) {
        // adds methods that manipulate the DOM.
        // API: changeID, addClassTo, shiftLeft, shiftRight

        var that = that || {};

        that.renderScreen = function () {
            return undefined;
        };

        that.addClassIn = function (classDOM, idDOM) {
            return undefined;
        };

        that.removeClassIn = function (classDOM, idDOM) {
            return undefined;
        };

        that.changeID = function (before, after) {
            errorID = document.getElementById(before);
            if (errorID !== null) {
                errorID.setAttribute("id", after);
            } else {
                return("Error: No " + before + " ID");
            }
        };

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

        return that;

    };



    // 'model'
    function remembering (that) {
        // add CRUD operations for browser window state
        
        var b = that || {};

        b.currentWidth = function () {
            return window.scrollMaxX;
        };

        b.currentHeight = function () {
            return window.scrollMaxY;
        };

        b.currentPageWidth = function () {
            return window.innerWidth;
        };

        b.currentPageHeight = function () {
            return window.innerHeight;
        };

        return b;
    };


    // Bookbinder-specific MVC methods

    function bookEvents (that) {
        // add bookbinder's events

        var b = that || {};


        b.on('window load', b.toVisibleBook);
        b.on('window load', b.initBook);
        b.on('render the screen', b.setBookHeight);

        window.onload = function () { 
            b.fire('window load');
            b.fire('render the screen');
        };
        window.onresize = function () {
            b.fire('render the screen');
        };
        
        //Register the keydown event handler:
        document.onkeyup = function (e) {
            switch (e.keyCode) {
                case 37:
                    b.prev();
                    break;
                case 39:
                    b.next();
                    break;
                case 72:
                    b.prev();
                    break;
                case 76:
                    b.next();
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

    function bookTransforms (that) {
        // add bookbinder's transitions

        var b = that || {};

        b.setBookHeight = function () {
            calculatedHeight = b.currentPageHeight() / 1.25;
            document.getElementById("text").style.height = calculatedHeight + "px";
        }
        
        b.toVisibleBook = function () {
            b.changeID("warning", "warning-display-off");
            b.changeID("text-display-off", "text");
        };

        b.next = function () {
            b.shiftHorizontally(b.currentPageWidth(), "right");
            // TODO: hook into bookMemory
        };

        b.prev = function () {
            b.shiftHorizontally(b.currentPageWidth(), "left");
            // TODO: hook into bookMemory
        };

        return b;
    };

    function bookMemory (that) {
        // add bookbinder's CRUD

        var pageNumber = -1,
            pagesTotal = -1,
            pageWidth = -1;

        var b = that || {};

        b.initBook = function () {
            pageNumber = 1;
            pagesTotal = b.currentPagesTotal();
            pageWidth = b.currentPageWidth();
            return(pageNumber + " out of " + pagesTotal);
        };

        b.currentPagesTotal = function () {
            return Math.floor( (b.currentWidth() / b.currentPageWidth()) + 1);
        };

        b.currentPage = function () {
            if (pageNumber > 0) {
                return pageNumber;
            } else {
                throw {
                    name: 'TypeError',
                    message: 'Page Numbers must be positive'
                };
            }
        };

        return b;
    };
    
    // Compose Bookbinder out of parts
    var b = bookEvents(bookTransforms(bookMemory(
            eventuality(transforming(remembering())))));

    return b;

}());