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
        var item = event.data;
        
        if (item.showmenu) {
            showMenu(mainmenu);
            $container.show();
            playSound("YES");
        } else if (item.hidemenu) {
            $container.hide();
            playSound("NO");
        }
        
        else if (item.menuenter)
            handleSelectedOption();
        else if (item.menuback)
            menuBack();
        
        else if (item.menuup)
            menuItemScroll("up");
        else if (item.menudown)
            menuItemScroll("down");
        
        else if (item.menuleft)
            menuPageScroll("left");
        else if (item.menuright)
            menuPageScroll("right");
		
		else if (item.addModuleMenu)
			addModuleMenu(mainmenu, item.addModuleMenu);
		else if (item.addModuleSubMenu)
			addModuleMenu(menus[item.addModuleSubMenu.parent], item.addModuleSubMenu);
		else if (item.addModuleItem)
			addModuleItem(menus[item.addModuleItem.menu], item.addModuleItem);
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
	
	getEmptyItemSlotPage(parentmenu).push({item: "<p class='menuoption'>" + menu.name + "</p>", subid: menu.id});
}

function addModuleItem(menu, item) {
	if (!menu.hasContent) {
		menu.items[0] = [];
		menu.hasContent = true;
	}
	
	menu.menu = "<div id='" + menu.id + "'></div>";
	menu.parent = menu.id;
	menu.items = [[]];
	menu.items[0].push({item: "<p class='menuoption'>It's empty in here!</p>"});
	menus[menu.id] = menu;
	debug(menu.menu);
	
	getEmptyItemSlotPage(menu).push({item: "<p class='menuoption'>" + menu.name + "</p>", subid: menu.id});
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

/*function init() {
    $("div").each(function(i, obj) {
        if ($(this).attr("id") == "menu$container")
			return;
		
		var data = {};
		data.menu = $(this).detach();
		
		data.items = [];
		$(this).children().each(function(i, obj) {
			// send true state if it exists
			if ($(this).data("state") == "ON") {
				var statedata = $(this).data("action").split(" ");
				sendData(statedata[0], {action: statedata[1], newstate: true});
			}
			
			var page = Math.floor(i / 7);
			if (data.items[page] == null)
				data.items[page] = [];
			
			data.items[page].push($(this).detach());
			data.maxitems = page;
		});
		
		menus[$(this).attr("id")] = data;
    });
}*/

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
    
    if (item.subid != null)
        showMenu(menus[item.subid]);
    /*else if (item.data("action")) {
        var newstate = true;
        if (item.data("state")) {
            // .attr() because .data() gives original values
            if (item.attr("data-state") == "ON") {
                newstate = false;
                item.attr("data-state", "OFF");
            } else if (item.attr("data-state") == "OFF")
                item.attr("data-state", "ON");
        }
        
        var data = item.data("action").split(" ");
        if (data[1] == "*")
            data[1] = item.parent().attr("data-subdata");
        
        sendData(data[0], {action: data[1], newstate: newstate});
    }*/
    
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

function showPage(page) {
	var $menu = $("#" + content.id);
	
    if (currentpage != null)
        $menu.empty();
    
    currentpage = page;
    
    for (var i = 0; i < content.items[currentpage].length; i++)
        $menu.append(content.items[currentpage][i].item);
    
	$menu.append(pageindicator);
    
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