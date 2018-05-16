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
	setSubtitleColorFromConfig(config);
	//setItemsColorFromConfig(config);
	//setSelectedItemsColorFromConfig(config);
	
	if (config.items.pagelimit)
		pagelimit = config.items.pagelimit;
}

function setTitleTextFromConfig(config) {
	if (config.title.text)
		$("#title").text(config.title.text);
}

function setTitleColorFromConfig(config) {
	var color = config.title.color;
	var $title = $("#title");
	if (color) {
		if (color.css)
			$title.css("background", color.css);
		else {
			var from = color.from;
			var to = color.to;
			$title.css("background",
				"linear-gradient(90deg, rgba(" + from.r + "," + from.g + "," + from.b + "," + from.a + ")" + 
				", rgba(" + to.r + "," + to.g + "," + to.b + "," + to.a + ")");
		}
		
		$title.css("color", "rgb(" + color.font.r + "," + color.font.g + "," + color.font.b + ")");
	}
}

function setSubtitleColorFromConfig(config) {
	var color = config.title.color.subtitle;
	var $subtitle = $("#subtitle");
	if (color) {
		if (color.css)
			$subtitle.css("background", color.css);
		else {
			var from = color.from;
			var to = color.to;
			$subtitle.css("background",
				"linear-gradient(90deg, rgba(" + from.r + "," + from.g + "," + from.b + "," + from.a + ")" + 
				", rgba(" + to.r + "," + to.g + "," + to.b + "," + to.a + ")");
		}
		
		$subtitle.css("color", "rgb(" + color.font.r + "," + color.font.g + "," + color.font.b + ")");
	}
}

/*function setItemsColorFromConfig(config) {
	var color = config.items.color;
	if (color) {
		if (color.css)
			$("head").append(".menuoption{background:'" + color.css + "'}");
		else {
			var from = color.from;
			var to = color.to;
			$("head").append("<style id='addedCSSa' type='text/css'>.menuoption{background:'linear-gradient(90deg, rgba(" +
				from.r + "," + from.g + "," + from.b + "," + from.a + "), rgba(" + to.r + "," + to.g + "," + to.b + "," + to.a + ")'}</style>");
		}
	}
}

function setSelectedItemsColorFromConfig(config) {
	var color = config.items.color.selected;
	if (color) {
		if (color.css)
			$("head").append(".menuoption.selected{background:'" + color.css + "'}");
		else {
			var from = color.from;
			var to = color.to;
			$("head").append("<style id='addedCSSb' type='text/css'>.menuoption.selected{background:'linear-gradient(90deg, rgba(" +
				from.r + "," + from.g + "," + from.b + "," + from.a + "), rgba(" + to.r + "," + to.g + "," + to.b + "," + to.a + ")'}</style>");
		}
	}
}*/