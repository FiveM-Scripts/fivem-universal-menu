$(function() {
    window.addEventListener("message", function(event) {
        var data = event.data;
        
        if (data.config)
			handleConfig(data.config);
    });
});

function handleConfig(config) {
	setTitleColorFromConfig(config);
}

function setTitleColorFromConfig(config) {
	var color = config.menu.title.color;
	if (color.css)
		$(".menuoption.menutitle").css("background", color.css);
	else {
		var from = color.from;
		var to = color.to;
		$(".menuoption.menutitle").css("background",
			"linear-gradient(90deg, rgba(" + from.r + "," + from.g + "," + from.b + "," + from.a + ")" + 
			", rgba(" + to.r + "," + to.g + "," + to.b + "," + to.a + ")");
	}
}