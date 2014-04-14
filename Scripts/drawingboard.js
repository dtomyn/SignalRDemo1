$(function () {

    /////////////////////////////////////////////////////////////////////////
    // Standard drawing board functionalities
    /////////////////////////////////////////////////////////////////////////
    var $canvas = $("#canvas");
    var buttonPressed = false;
    //original... only worked if had a mouse... what about iPads??
    //$canvas
    //    .mousedown(function () {
    //        buttonPressed = true;
    //    })
    //    .mouseup(function () {
    //        buttonPressed = false;
    //    })
    //    .mousemove(function (e) {
    //        if (buttonPressed) {
    //            setPoint(e.offsetX, e.offsetY, $("#color").val());
    //        }
    //    });
    //let's see if this will work
    $canvas
        .bind("mousedown", function (e) {
            buttonPressed = true;
        })
        .bind("touchstart", function (e) {
            if (e.preventDefault) e.preventDefault();
            buttonPressed = true;
        })
        .bind("mouseup", function (e) {
            buttonPressed = false;
        })
        .bind("touchend", function (e) {
            buttonPressed = false;
        })
        .bind("touchmove", function (e) {
            if (buttonPressed) {
                if (e.preventDefault) e.preventDefault();

                setPoint(
                    e.originalEvent.changedTouches[0].pageX - e.originalEvent.changedTouches[0].target.offsetLeft
                    , e.originalEvent.changedTouches[0].pageY - e.originalEvent.changedTouches[0].target.offsetTop
                    , $("#color").val());
            }
        })
        .bind("mousemove", function (e) {
            if (buttonPressed) {
                setPoint(e.offsetX, e.offsetY, $("#color").val());
            }
        });

    var ctx = $canvas[0].getContext("2d");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    function setPoint(x, y, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
        //now call method to broadcast this
        if (buttonPressed && connected) {
            hub.server.broadcastPoint(
                x, y);
        }
    }
    function clearPoints() {
        ctx.clearRect(0, 0, $canvas.width(), $canvas.height());
    }

    $("#clear").click(function () {
        clearPoints();
    });

    /////////////////////////////////////////////////////////////////////////
    // SignalR specific code
    /////////////////////////////////////////////////////////////////////////

    var hub = $.connection.drawingBoard;
    hub.state.color = $("#color").val(); // Property accessible from server
    var connected = false;

    // UI events
    $("#color").change(function () {
        hub.state.color = $(this).val();
    });
    $canvas.mousemove(function (e) {
        if (buttonPressed && connected) {
            hub.server.broadcastPoint(e.offsetX, e.offsetY);
        }
    });
    $("#clear").click(function () {
        if (connected) {
            hub.server.broadcastClear();
        }
    });

    // Event handlers
    hub.client.clear = function () {
        clearPoints();
    };
    hub.client.drawPoint = function (x, y, color) {
        setPoint(x, y, color);
    };

    setTimeout(startConnection, 10000);

    function startConnection() {
        $canvas.show();
        $.connection.hub
            /*.start({ transport: 'longPolling' })*/
            /*.start({ transport: 'foreverFrame' })*/
            .start()
            .done(function () {
                connected = true;
                $('#connecting').hide();
                $('#connected').show().text('Now connected! Connection ID = ' + $.connection.hub.id + ' with transport ' + $.connection.hub.transport.name);
            })
            .fail(function (error) {
                $('#connecting').hide();
                $('#connected').show().text('Could not connect! Error ' + error);
            })
            ;
    }


    // Voila!
    //    

});
