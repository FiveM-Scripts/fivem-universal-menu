RegisterNetEvent("menu:registerModuleMenu")
RegisterNetEvent("menu:addModuleSubMenu")
RegisterNetEvent("menu:addModuleItem")
RegisterNetEvent("menu:isIDRegistered")
RegisterNetEvent("menu:setDesc")

local moduleMenus = {}

AddEventHandler("menu:registerModuleMenu", function(name, cbdone, cbclicked)
	if not name then
		if cbdone then
			cbdone(nil)
		end
		return
	end
	local name = trimTextLength(name, config.items.maxnamelength)
	
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
	local name = trimTextLength(name, config.items.maxnamelength)

	if not isIDRegistered(parent) then
		if cbdone then
			cbdone(nil)
		end
	else
		local id = uuid()
		
		local moduleMenu = getByID(moduleMenus, parent)
		table.insert(moduleMenu.items, {id = id, name = name, items = {}})
		
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
	if not name then
		if cbdone then
			cbdone(nil)
		end
		return
	end
	local name = trimTextLength(name, config.items.maxnamelength)
	if menu and not isIDRegistered(menu) then
		if cbdone then
			cbdone(nil)
		end
	else
		local id = uuid()
		
		local data = {id = id, name = name}
		if not menu then
			table.insert(moduleMenus, data)
		else
			local moduleMenu = getByID(moduleMenus, menu)
			table.insert(moduleMenu.items, data)
		end
			
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

AddEventHandler("menu:isIDRegistered", function(id, cb)
	result = false
	if id then
		result = isIDRegistered(id)
	end
	
	if cb then
		cb(result)
	end
end)

AddEventHandler("menu:setDesc", function(id, text)
	if not id or not isIDRegistered(id) or not text then
		return
	end
	
	local text = trimTextLength(text, config.items.maxdesclength)
	
	SendNUIMessage({
		setDesc = {id = id, text = text}
	})
end)

function trimTextLength(text, length)
	if string.len(text) > length then
		return string.sub(text, 1, length)
	else
		return text
	end
end

function getByID(items, id)
	for _, item in ipairs(items) do
		if item.id == id or (item.items and getByID(item.items, id)) then
			return item
		end
	end
end

function isIDRegistered(id)
	return getByID(moduleMenus, id) ~= nil
end

math.randomseed(GetGameTimer())
function uuid()
    local template ='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    return string.gsub(template, '[xy]', function (c)
        local v = (c == 'x') and math.random(0, 0xf) or math.random(8, 0xb)
        return string.format('%x', v)
    end)
end