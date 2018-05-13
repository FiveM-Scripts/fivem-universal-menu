RegisterNetEvent("menu:registerModuleMenu")
RegisterNetEvent("menu:addModuleSubMenu")
RegisterNetEvent("menu:addModuleItem")
RegisterNetEvent("menu:blockInput")
RegisterNetEvent("menu:isIDRegistered")
RegisterNetEvent("menu:hideMenu")

local moduleMenus = {}

AddEventHandler("menu:registerModuleMenu", function(name, cbdone, cbclicked)
	if not name then
		if cbdone then
			cbdone(nil)
		end
		return
	end
	name = trimTextLength(name)
	
	local id = uuid()
	table.insert(moduleMenus, {id = id, name = name, items = {}})
	SendNUIMessage({
		addModuleMenu = {id = id, name = name}
	})
	
	if cbclicked then
		RegisterNUICallback(id, function(data, mcb)
			cbclicked(id)
		end)
	end
	
	if cbdone then
		cbdone(id)
	end
end)

AddEventHandler("menu:addModuleSubMenu", function(parent, name, cbdone, cbclicked)
	if not parent or not name then
		if cbdone then
			cbdone(nil)
		end
		return
	end
	name = trimTextLength(name)

	if not isIDRegistered(parent) then
		if cbdone then
			cbdone(nil)
		end
	else
		local moduleMenu = getByID(parent)
		local id = uuid()
		table.insert(moduleMenu.items, {id = id, name = name, type = "menu", items = {}})
		SendNUIMessage({
			addModuleSubMenu = {parent = parent, id = id, name = name}
		})
		
		if cbclicked then
			RegisterNUICallback(id, function(data, mcb)
				cbclicked(id)
			end)
		end
		
		if cbdone then
			cbdone(id)
		end
	end
end)

AddEventHandler("menu:addModuleItem", function(menu, name, onoff, cbdone, cbclicked)
	if not menu or not name then
		if cbdone then
			cbdone(nil)
		end
		return
	end
	name = trimTextLength(name)

	if not isIDRegistered(menu) then
		if cbdone then
			cbdone(nil)
		end
	else
		local moduleMenu = getByID(menu)
		local id = uuid()
		table.insert(moduleMenu.items, {id = id, name = name, type = "action"})
		SendNUIMessage({
			addModuleItem = {menu = menu, id = id, name = name, onoff = onoff}
		})
		
		if cbclicked then
			if onoff ~= false and onoff ~= true then
				RegisterNUICallback(id, function(data, mcb)
					cbclicked(id, nil)
				end)
			else
				RegisterNUICallback(id, function(data, mcb)
					cbclicked(id, data.datastate)
				end)
			end
		end
		
		if cbdone then
			cbdone(id)
		end
	end
end)

AddEventHandler("menu:blockInput", function(state)
	if state == false or state == true then
		blockinput = state
	end
end)

AddEventHandler("menu:isIDRegistered", function(id, cb)
	local result = false
	if id then
		result = isIDRegistered(id)
	end
	
	if cb then
		cb(result)
	end
end)

AddEventHandler("menu:hideMenu", function()
	if menuopen then
		SendNUIMessage({
			hidemenu = true
		})
	end
end)

function trimTextLength(text)
	if string.len(text) > config.items.maxtextlength then
		return string.sub(text, 1, config.items.maxtextlength)
	else
		return text
	end
end

function getByID(items, id)
	for _, item in ipairs(items) do
		if item.id == id or (item.type == "menu" and getItemByID(item.items, id)) then
			return item
		end
	end
end

function isIDRegistered(id)
	return getItemByID(moduleMenus, id) ~= nil
end

math.randomseed(GetGameTimer())
function uuid()
    local template ='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    return string.gsub(template, '[xy]', function (c)
        local v = (c == 'x') and math.random(0, 0xf) or math.random(8, 0xb)
        return string.format('%x', v)
    end)
end