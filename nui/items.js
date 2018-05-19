$(function() {
    window.addEventListener("message", function(event) {
        var data = event.data;

		if (data.addModuleMenu)
			addModuleMenu(mainmenu, data.addModuleMenu);
		else if (data.addModuleSubMenu)
			addModuleMenu(menus[data.addModuleSubMenu.parent], data.addModuleSubMenu);
		else if (data.addModuleItem) {
			if (!data.addModuleItem.menu)
				addModuleItem(mainmenu, data.addModuleItem);
			else
				addModuleItem(menus[data.addModuleItem.menu], data.addModuleItem);
		} else if (data.setDesc)
			setModuleElementDesc(data.setDesc.id, data.setDesc.text);
		else if (data.setExtraClass)
			setModuleElementExtraClass(data.setExtraClass.id, data.setExtraClass.className, data.setExtraClass.state);
    });
});

function addModuleMenu(parentmenu, menu) {
	if (!parentmenu.hasContent && !menu.preset) {
		parentmenu.items[0] = [];
		parentmenu.hasContent = true;
	}
	
	menu.menu = "<div id='" + menu.id + "'></div>";
	menu.parent = parentmenu.id;
	menu.items = [];
	menus[menu.id] = menu;
	addModuleItem(menu, {name: "It's empty in here!", id: menu.id + "-empty", preset: true});
	
	getEmptyItemSlotPage(parentmenu).push({item: "<p class='menuoption submenuitem'>" + menu.name + "</p>", id: menu.id,
		name: menu.name, type: "menu", extraClasses: []});
}

function addModuleItem(menu, item) {
	if (!menu.hasContent && !item.preset) {
		menu.items[0] = [];
		menu.hasContent = true;
	}
	
	var data = {item: "<p class='menuoption'>" + item.name + "</p>", id: item.id, name: item.name, type: "item", extraClasses: []};
	if (item.onoff != null)
		data.datastate = item.onoff;
	
	var menuPage = getEmptyItemSlotPage(menu);
	var newSize = menuPage.push(data);
	// Get latest element from page array, which should be this item
	items[item.id] = menuPage[newSize - 1];
}

function setModuleElementDesc(id, text) {
	getModuleElementByID(id).desc = text;
	
	if (content)
		updateDesc(content.items[currentpage][itemcounter]);
}

function setModuleElementExtraClass(id, className, state) {
	var element = getModuleElementByID(id);
	
	var extraClass = getModuleElementExtraClass(element, className);
	if (extraClass == null)
		element.extraClasses.push({name: className, state: state});
	else
		extraClass.state = state;
	
	// Update if element is being displayed
	if (content != null) {
		for (var i = 0; i < content.items[currentpage].length; i++) {
			if (content.items[currentpage][i].id == id) {
				if (!state)
					$(".menuoption").eq(i + itemcounteroffset).removeClass(className);
				else
					$(".menuoption").eq(i + itemcounteroffset).addClass(className);
			}
		}
	}
}

function getModuleElementExtraClass(element, className) {
	for (var i = 0; i < element.extraClasses.length; i++)
		if (element.extraClasses[i].name == className)
			return element.extraClasses[i];
}

function getEmptyItemSlotPage(menu) {
	var page = 0;
	while (true) {
		if (menu.items[page] == null) {
			menu.items[page] = [];
			return menu.items[page];
		} else if (menu.items[page].length < pagelimit)
			return menu.items[page];
		page++;
	}
}

function menuItemScroll(dir) {
    $(".menuoption").eq(itemcounter + itemcounteroffset).removeClass("selected");
    
	var itemamount = content.items[currentpage].length - 1;
	if (dir == "up") {
		if (itemcounter > 0)
			itemcounter -= 1;
		else
			itemcounter = itemamount;
	} else if (dir == "down") {
		if (itemcounter < itemamount)
			itemcounter += 1;
		else
			itemcounter = 0;
	}
	
    updateDesc(content.items[currentpage][itemcounter]);
    $(".menuoption").eq(itemcounter + itemcounteroffset).addClass("selected");
    playSound("NAV_UP_DOWN");
}

function updateDesc(item) {
	if (item.desc == null)
		$desc.hide();
	else {
		$desc.show();
		$desc.text(item.desc);
	}
}

function updateItemDataStateText($item, state) {
	var datastateText = "OFF";
	if (state)
		datastateText = "ON";
	$item.attr("data-state", datastateText);
}

function getModuleElementByID(id) {
	if (menus[id] != null)
		return menus[id];
	else if (items[id] != null)
		return items[id];
}