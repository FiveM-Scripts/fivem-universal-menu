$(function() {
    window.addEventListener("message", function(event) {
        var data = event.data;
        
        if (data.config)
			handleConfig(data.config.data);
    });
});

function handleConfig(config) {
	setTitleTextFromConfig(config);
	setTitleColorFromConfig(config);
	//setItemsColorFromConfig(config);
	//setSelectedItemsColorFromConfig(config);
}

function setTitleTextFromConfig(config) {
	menus["mainmenu"].name = config.title.text;
}

function setTitleColorFromConfig(config) {
	var color = config.title.color;
	if (color.css)
		$("#title").css("background", color.css);
	else {
		var from = color.from;
		var to = color.to;
		$("#title").css("background",
			"linear-gradient(90deg, rgba(" + from.r + "," + from.g + "," + from.b + "," + from.a + ")" + 
			", rgba(" + to.r + "," + to.g + "," + to.b + "," + to.a + ")");
	}
}

function setItemsColorFromConfig(config) {
	var color = config.items.color;
	if (color.css)
		$("head").append(".menuoption{background:'" + color.css + "'}");
	else {
		var from = color.from;
		var to = color.to;
		$("head").append("<style id='addedCSSa' type='text/css'>.menuoption{background:'linear-gradient(90deg, rgba(" +
			from.r + "," + from.g + "," + from.b + "," + from.a + "), rgba(" + to.r + "," + to.g + "," + to.b + "," + to.a + ")'}</style>");
	}
}

function setSelectedItemsColorFromConfig(config) {
	var color = config.items.color.selected;
	if (color.css)
		$("head").append(".menuoption.selected{background:'" + color.css + "'}");
	else {
		var from = color.from;
		var to = color.to;
		$("head").append("<style id='addedCSSb' type='text/css'>.menuoption.selected{background:'linear-gradient(90deg, rgba(" +
			from.r + "," + from.g + "," + from.b + "," + from.a + "), rgba(" + to.r + "," + to.g + "," + to.b + "," + to.a + ")'}</style>");
	}
}