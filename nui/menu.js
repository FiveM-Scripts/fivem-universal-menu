var itemcounter;
var currentpage;

var $container;
var $title;
var mainmenu;
var menus = [];
var firstmodule = true;

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
            $container.hide();
            playSound("NO");
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
		else if (data.addModuleItem)
			addModuleItem(menus[data.addModuleItem.menu], data.addModuleItem);
    });
});

function init() {
	$container = $("#menucontainer");
	$title = $("#title");
	mainmenu = {id: "mainmenu", name: "Universal Menu", menu: $("#mainmenu").remove(), items: [[]]};
	menus["mainmenu"] = mainmenu;
	
	mainmenu.menu.children().each(function(i, obj) {
		mainmenu.items[0].push({item: $(this).remove()});
	});
}

function addModuleMenu(parentmenu, menu) {
	if (!parentmenu.hasContent) {
		parentmenu.items[0] = [];
		parentmenu.hasContent = true;
	}
	
	menu.menu = "<div id='" + menu.id + "'></div>";
	menu.parent = parentmenu.id;
	menu.items = [[]];
	menu.items[0].push({item: "<p class='menuoption'>It's empty in here!</p>"});
	menus[menu.id] = menu;
	
	getEmptyItemSlotPage(parentmenu).push({item: "<p class='menuoption'>" + menu.name + "</p>", subid: menu.id, name: menu.name});
}

function addModuleItem(menu, item) {
	if (!menu.hasContent) {
		menu.items[0] = [];
		menu.hasContent = true;
	}
	
	var data = {item: "<p class='menuoption'>" + item.name + "</p>", itemid: item.id, name: item.name};
	if (item.onoff != null)
		data.datastate = item.onoff;
	getEmptyItemSlotPage(menu).push(data);
}

function getEmptyItemSlotPage(menu) {
	var page = 0;
	while (true) {
		if (menu.items[page] == null) {
			menu.items[page] = [];
			return menu.items[page];
		} else if (menu.items[page].length < 10)
			return menu.items[page];
		page++;
	}
}

function menuItemScroll(dir) {
    $(".menuoption").eq(itemcounter + 1).attr("class", "menuoption");
    
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
    
    $(".menuoption").eq(itemcounter + 1).attr("class", "menuoption selected");
    playSound("NAV_UP_DOWN");
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
			updateItemDataStateText($(".menuoption").eq(itemcounter + 1), data.datastate);
		}
		sendData(item.itemid, data);
	}
    
    playSound("SELECT");
}

function resetSelected() {
    $(".menuoption").each(function(i, obj) {
        if ($(this).attr("class") == "menuoption selected")
            $(this).attr("class", "menuoption");
    });
    
    itemcounter = 0;
    $(".menuoption").eq(itemcounter + 1).attr("class", "menuoption selected");
}

function showMenu(menu) {
    if (content != null)
        $("#" + content.id).remove();
    
    content = menu;
    $container.append(content.menu);
	$title.text(content.name);
    
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
    
    resetSelected();
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