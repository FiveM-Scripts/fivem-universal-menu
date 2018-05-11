RegisterNetEvent("menu:registerModuleMenu")
RegisterNetEvent("menu:addModuleSubMenu")
RegisterNetEvent("menu:addModuleItem")
RegisterNetEvent("menu:blockInput")

local moduleMenus = {}

AddEventHandler("menu:registerModuleMenu", function(name, cbdone, cbclicked)
	if not name or not cbdone or not cbclicked then
		cbdone(nil)
		return
	end
	name = trimTextLength(name)
	
	id = uuid()
	table.insert(moduleMenus, {id = id, name = name, items = {}})
	SendNUIMessage({
		addModuleMenu = {id = id, name = name}
	})
	
	RegisterNUICallback(id, function(data, mcb)
		cbclicked(id)
	end)
	cbdone(id)
end)

AddEventHandler("menu:addModuleSubMenu", function(parent, name, cbdone, cbclicked)
	if not parent or not name or not cbdone or not cbclicked then
		cbdone(nil)
		return
	end
	name = trimTextLength(name)

	local moduleMenu = getModuleMenu(parent)
	if not moduleMenu then
		cb(nil)
	else
		id = uuid()
		table.insert(moduleMenu.items, {id = id, name = name, type = "menu", items = {}})
		SendNUIMessage({
			addModuleSubMenu = {parent = parent, id = id, name = name}
		})
		
		RegisterNUICallback(id, function(data, mcb)
			cbclicked(id)
		end)
		cbdone(id)
	end
end)

AddEventHandler("menu:addModuleItem", function(menu, name, onoff, cbdone, cbclicked)
	if not menu or not name or not cbdone or not cbclicked then
		cbdone(nil)
		return
	end
	name = trimTextLength(name)

	local moduleMenu = getModuleMenu(menu)
	if not moduleMenu then
		cbdone(nil)
	else
		id = uuid()
		cbname = uuid()
		table.insert(moduleMenu.items, {id = id, name = name, type = "action"})
		SendNUIMessage({
			addModuleItem = {menu = menu, id = id, name = name, onoff = onoff}
		})
		
		if onoff ~= false and onoff ~= true then
			RegisterNUICallback(id, function(data, mcb)
				cbclicked(id, nil)
			end)
		else
			RegisterNUICallback(id, function(data, mcb)
				cbclicked(id, data.datastate)
			end)
		end
		cbdone(id)
	end
end)

AddEventHandler("menu:blockInput", function(state, cb)
	if cb and (state == false or state == true) then
		blockInput = state
	end
	cb()
end)

function trimTextLength(text)
	if string.len(text) > config.items.maxtextlength then
		return string.sub(text, 1, config.items.maxtextlength)
	else
		return text
	end
end

function getModuleMenu(id)
	for _, moduleMenu in ipairs(moduleMenus) do
		if moduleMenu.id == id or getModuleSubMenu(moduleMenu, id) then
			return moduleMenu
		end
	end
end

function getModuleSubMenu(parent, id)
	for _, item in ipairs(parent.items) do
		if item.id == id or (item.type == "menu" and getModuleSubMenu(item, id)) then
			return item
		end
	end
end

math.randomseed(GetGameTimer())
function uuid()
    local template ='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    return string.gsub(template, '[xy]', function (c)
        local v = (c == 'x') and math.random(0, 0xf) or math.random(8, 0xb)
        return string.format('%x', v)
    end)
end