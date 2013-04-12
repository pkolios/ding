var width = 560,
    height = 600;

var projection = d3.geo.albers()
    .center([9, 51])
    .rotate([0, 0])
    .scale(1400 * 3)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json(settings.map, function(error, de) {

    svg.append("path")
	.datum(topojson.object(de, de.objects.subunits))
	.attr("class", function(d) { return "subunit"})
    .attr("d", path);

    // Append place dots (cities)
	//svg.append("path")
    //.datum(topojson.object(de, de.objects.places))
    //.attr("d", path)
    //.attr("class", "place");

    // Append place labels (city names)
	//svg.selectAll(".place-label")
    //.data(topojson.object(de, de.objects.places).geometries)
    //.enter().append("text")
    //.attr("class", "place-label")
    //.attr("transform", function(d) { return "translate(" + projection(d.coordinates) + ")"; })
    //.attr("dx", "0.75em")
    //.text(function(d) { return d.properties.name; });

});

var increment_counter = function() {
    var c = $('#counter').html();
    c = parseInt(c) + 1;
    $('#counter').html(c);
    return c;
};

var increment_total= function(amount) {
    var t = $('#total').html();
    t = parseFloat(t) + parseFloat(amount);
    $('#total').html(t.toFixed(2));
    return t;
};

var ding = function(lat, lon) {
    // projection expects pair of [lon,lat]
    var point = [lon, lat];
    // add the persistent dot
    svg.append('svg:circle')
    .attr("transform", "translate(" + projection(point) + ")")
    .attr("r", 1)
    .attr("fill", "cyan");
    // create the ping element
    var ping = svg.append('svg:circle')
    .attr("transform", "translate(" + projection(point) + ")")
    .attr("r", 0)
    .attr("fill-opacity", 0)
    .attr("stroke-width", 4)
    .attr("stroke-opacity", 0.9)
    .attr("stroke", "cyan");
    // do the ping animation and remove the ping element after
    ping.transition()
    .duration(1000)
    .attr("stroke-opacity", 0)
    .attr("r", 70)
    .call( function(d) { d.remove() });

    return point;
};

$(function() {
    // Open up a connection to our server
    var ws = new WebSocket("ws://localhost:10000/");

    // What do we do when we get a message?
    ws.onmessage = function(evt) {
        ping = JSON.parse(evt.data);
        increment_counter();
        increment_total(ping.amount);
        ding(ping.lat, ping.lon);
    }
    // Just update our conn_status field with the connection status
    ws.onopen = function(evt) {
        $('.circle').removeClass("connected");
        $('.circle').removeClass("error");
        $('.circle').addClass("connected");
    }
    ws.onerror = function(evt) {
        $('.circle').removeClass("connected");
        $('.circle').removeClass("error");
        $('.circle').addClass("error");
    }
    ws.onclose = function(evt) {
        $('.circle').removeClass("connected");
        $('.circle').removeClass("error");
        $('.circle').addClass("error");
    }
});
