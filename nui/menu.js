var itemcounter;
var currentpage;
var itemcounteroffset = 2;
var pagelimit = 10;

var $container;
var $subtitle;
var $desc;
var mainmenu;
var menus = [];
var items = [];

var content;
var pageindicator = "<p id='pageindicator'></p>"

$(function() {
    init();
    
    window.addEventListener("message", function(event) {
        var data = event.data;
        
        if (data.showmenu) {
            showMenu(mainmenu);
            $container.show();
            playSound("YES");
        } else if (data.hidemenu) {
			if ($container.is(":visible")) {
				$container.hide();
				playSound("NO");
			}
        }
        
        else if (data.menuenter)
            handleSelectedOption();
        else if (data.menuback)
            menuBack();
        
        else if (data.menuup)
            menuItemScroll("up");
        else if (data.menudown)
            menuItemScroll("down");
        
        else if (data.menuleft)
            menuPageScroll("left");
        else if (data.menuright)
            menuPageScroll("right");
		
		else if (data.addModuleMenu)
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
    });
});

function init() {
	$container = $("#menucontainer");
	$subtitle = $("#subtitle");
	$desc = $("#desc");
	
	mainmenu = {id: "mainmenu", name: "Main Menu", menu: $("#mainmenu").remove(), items: []};
	menus["mainmenu"] = mainmenu;
	addModuleItem(mainmenu, {name: "Nothing in here it seems 🤔", id: "thenking", preset: true});
	setModuleElementDesc("thenking", "Add modules for content");
}

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
	
	getEmptyItemSlotPage(parentmenu).push({item: "<p class='menuoption'>" + menu.name + "</p>", subid: menu.id, name: menu.name});
}

function addModuleItem(menu, item) {
	if (!menu.hasContent && !item.preset) {
		menu.items[0] = [];
		menu.hasContent = true;
	}
	
	var data = {item: "<p class='menuoption'>" + item.name + "</p>", itemid: item.id, name: item.name};
	if (item.onoff != null)
		data.datastate = item.onoff;
	
	var menuPage = getEmptyItemSlotPage(menu);
	var newSize = menuPage.push(data);
	// Get latest element from page array, which should be this item
	items[item.id] = menuPage[newSize - 1];
}

function setModuleElementDesc(id, text) {
	var element = getModuleElementByID(id);
	if (element)
		element.desc = text;
	
	if (content != null)
		updateDesc(content.items[currentpage][itemcounter]);
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
    $(".menuoption").eq(itemcounter + itemcounteroffset).attr("class", "menuoption");
    
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
    $(".menuoption").eq(itemcounter + itemcounteroffset).attr("class", "menuoption selected");
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

function menuPageScroll(dir) {
	var newpage;
	if (dir == "left")
		newpage = currentpage - 1;
	else if (dir == "right")
		newpage = currentpage + 1;
	
    if (pageExists(newpage))
        showPage(newpage);

    playSound("NAV_UP_DOWN");
}

function menuNextPage() {
    var newpage;
    if (pageExists(currentpage + 1))
        newpage = currentpage + 1;
    else
        newpage = 0;
    
    showPage(newpage);
    playSound("NAV_UP_DOWN");
}

function menuBack() {
    if (content.parent == null) {
        $container.hide();
        sendData("menuclose", {});
    } else
        showMenu(menus[content.parent]);
    
    playSound("BACK");
}

function handleSelectedOption() {
    var item = content.items[currentpage][itemcounter];
    
    if (item.subid != null) {
        showMenu(menus[item.subid]);
		sendData(item.subid, {});
    } else if (item.itemid != null) {
		var data = {};
		if (item.datastate != null) {
			item.datastate = !item.datastate;
			data.datastate = item.datastate;
			updateItemDataStateText($(".menuoption").eq(itemcounter + itemcounteroffset), data.datastate);
		}
		sendData(item.itemid, data);
	}
    
    playSound("SELECT");
}

function resetSelect() {
    $(".menuoption").each(function(i, obj) {
        if ($(this).attr("class") == "menuoption selected")
            $(this).attr("class", "menuoption");
    });
    
    itemcounter = 0;
	updateDesc(content.items[currentpage][itemcounter]);
    $(".menuoption").eq(itemcounter + itemcounteroffset).attr("class", "menuoption selected");
}

function showMenu(menu) {
    if (content != null)
        $("#" + content.id).remove();
    
    content = menu;
    $desc.before(content.menu);
	$subtitle.text(content.name);
    
    showPage(0);
}

function updateItemDataStateText($item, state) {
	var datastateText = "OFF";
	if (state)
		datastateText = "ON";
	$item.attr("data-state", datastateText);
}

function showPage(page) {
	var $content = $("#" + content.id);
	
    if (currentpage != null)
        $content.empty();
    
    currentpage = page;
    
    for (var i = 0; i < content.items[currentpage].length; i++) {
		var item = content.items[currentpage][i];
		var $item = $(item.item);
		
		if (item.datastate != null)
			updateItemDataStateText($item, item.datastate);
		$content.append($item);
	}
    
	$content.append(pageindicator);
    
    if (content.items.length - 1 > 0)
        $("#pageindicator").text("Page " + (currentpage + 1) + " / " + (content.items.length));
    
    resetSelect();
}

function pageExists(page) {
    return content.items[page] != null;
}

function sendData(name, data) {
    $.post("http://menu/" + name, JSON.stringify(data), function(datab) {
        console.log(datab);
    });
}

function playSound(sound) {
    sendData("playsound", {name: sound});
}

function debug(msg) {
    sendData("print", {msg: msg});
}

function getModuleElementByID(id) {
	if (menus[id] != null)
		return menus[id];
	else if (items[id] != null)
		return items[id];
}