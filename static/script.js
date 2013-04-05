var width = 960,
    height = 1160;


var projection = d3.geo.albers()
    .center([9, 50])
    .rotate([0, 0])
    .scale(1200 * 5)
    .translate([width / 2, height / 2]);


var path = d3.geo.path()
    .projection(projection);


var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("de.json", function(error, de) {

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

var ding = function(lat, lon) {
    // projection expects pair of [lon,lat]
    var point = [lon, lat];
    // add the persistent dot
    svg.append('svg:circle')
    .attr("transform", "translate(" + projection(point) + ")")
    .attr("r", 2)
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
        ding(ping.lat, ping.lon);
    }
    // Just update our conn_status field with the connection status
    ws.onopen = function(evt) {
        $('#conn_status').html('<b>Connected</b>');
    }
    ws.onerror = function(evt) {
        $('#conn_status').html('<b>Error</b>');
    }
    ws.onclose = function(evt) {
        $('#conn_status').html('<b>Closed</b>');
    }
});
