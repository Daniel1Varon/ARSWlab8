var app = (function () {

    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }        
    }
    
    var stompClient = null;
    var idPoint = null;

    var addPointToCanvas = function (point) {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.stroke();
    };


    var connectAndSubscribe = function (id) {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        idPoint = id;
        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe("/topic/newpoint."+id, function (evt) {
                var tmpPnt = JSON.parse(evt.body);
                addPointToCanvas(tmpPnt);
                
            });

            stompClient.subscribe("/topic/newpolygon."+id, function (eventbody) {
                var canvas = document.getElementById("canvas");
                var ctx = canvas.getContext("2d");
                ctx.beginPath();
                var puntosTMP = JSON.parse(eventbody.body);
                ctx.moveTo(puntosTMP[0].x,puntosTMP[0].y);
                puntosTMP.map(function(element){
                    ctx.lineTo(element.x,element.y);
                });
                ctx.lineTo(puntosTMP[0].x,puntosTMP[0].y)
                ctx.stroke();

            });
        });

    };
    
    

    return {

        init: function (id) {
            //websocket connection
            connectAndSubscribe(id);
        },

        publishPoint: function(px,py){
            pt=new Point(px,py)
            console.info("publishing point at x: "+px+" y: "+py);
            addPointToCanvas(pt);

            //publicar el evento
            stompClient.send("/app/newpoint."+idPoint, {}, JSON.stringify(pt));
        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            setConnected(false);
            console.log("Disconnected");
        }
    };

})();