const token = 'ef6bc8b53769124c36402b20a91b104f6677a4c8';

function init(){
}

function showStation(station, output) {
	station = "madrid"
	output = $("#stationInfo")

	output.html("<h2>Pollutants & Weather conditions:</h2>")
	output.append($("<div/>").html("Loading..."))
	output.append($("<div/>").addClass("cp-spinner cp-meter"))

	$.getJSON("//api.waqi.info/feed/"+station+"/?token="+token,function(result){
		console.log(result)

		output.html("<h2>Pollutants & Weather conditions:</h2>")
		if (!result || (result.status!="ok")) {
			output.append("Sorry, something wrong happend: ")
			if (result.data) output.append($("<code>").html(result.data))
			return
		}

		var names = {
			pm25: "PM<sub>2.5</sub>",
			pm10: "PM<sub>10</sub>",
			o3: "Ozone",
			no2: "Nitrogen Dioxide",
			so2: "Sulphur Dioxide",
			co: "Carbon Monoxyde",
			t: "Temperature",
			w: "Wind",
			r: "Rain (precipitation)",
			h: "Relative Humidity",
			d: "Dew",
			p: "Atmostpheric Pressure"
		}

		output.append($("<div>").html("Station: "+result.data.city.name+" on "+result.data.time.s))

		var table = $("<table/>").addClass("result")
		output.append(table)

		for (var specie in result.data.iaqi) {
			var aqi = result.data.iaqi[specie].v
			var tr = $("<tr>");
			tr.append($("<td>").html(names[specie]||specie))
			tr.append($("<td>").html(colorize(aqi,specie)))
			table.append(tr)
		}
	})
}

function colorize(aqi, specie ) {
	specie = specie||"aqi"
	if (["pm25","pm10","no2","so2","co","o3","aqi"].indexOf(specie)<0) return aqi;

	var spectrum = [
		{a:0,  b:"#cccccc",f:"#ffffff"},
		{a:50, b:"#009966",f:"#ffffff"},
		{a:100,b:"#ffde33",f:"#000000"},
		{a:150,b:"#ff9933",f:"#000000"},
		{a:200,b:"#cc0033",f:"#ffffff"},
		{a:300,b:"#660099",f:"#ffffff"},
		{a:500,b:"#7e0023",f:"#ffffff"}
		];


	var i = 0;
	for (i=0;i<spectrum.length-2;i++) {
		if (aqi=="-"||aqi<=spectrum[i].a) break;
	};	
	return $("<div/>")
		.html(aqi)
		.css("font-size","120%")
		.css("min-width","30px")
		.css("text-align","center")
		.css("background-color",spectrum[i].b)
		.css("color",spectrum[i].f)

}