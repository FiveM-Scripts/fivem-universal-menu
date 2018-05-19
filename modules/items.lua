RegisterNetEvent("menu:registerModuleMenu")
RegisterNetEvent("menu:addModuleSubMenu")
RegisterNetEvent("menu:addModuleItem")
RegisterNetEvent("menu:isIDRegistered")
RegisterNetEvent("menu:setDesc")
RegisterNetEvent("menu:setGreyedOut")
RegisterNetEvent("menu:isGreyedOut")
RegisterNetEvent("menu:setRightText")

local moduleContent = {}

AddEventHandler("menu:registerModuleMenu", function(name, cbdone, cbclicked)
	if not name then
		if cbdone then
			cbdone(nil)
		end
	else
		local name = trimTextLength(name, config.items.maxnamelength)
		
		local id = uuid()
		table.insert(moduleContent, {id = id, name = name, items = {}})
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
	end
end)

AddEventHandler("menu:addModuleSubMenu", function(parent, name, cbdone, cbclicked)
	if not parent or not isIDRegistered(parent) or not name then
		if cbdone then
			cbdone(nil)
		end
	else
		local name = trimTextLength(name, config.items.maxnamelength)

		local id = uuid()
		
		table.insert(moduleContent, {id = id, name = name, items = {}})
		
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
	else
		local name = trimTextLength(name, config.items.maxnamelength)
		if menu and not isIDRegistered(menu) then
			if cbdone then
				cbdone(nil)
			end
		else
			local id = uuid()
			
			local data = {id = id, name = name, onoff = onoff}
			table.insert(moduleContent, data)
				
			SendNUIMessage({
				addModuleItem = {menu = menu, id = id, name = name, onoff = onoff}
			})
			
			if cbclicked then
				if type(onoff) ~= "boolean" then
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
	if id and isIDRegistered(id) and text then
		local text = trimTextLength(text, config.items.maxdesclength)
		
		SendNUIMessage({
			setDesc = {id = id, text = text}
		})
	end
end)

AddEventHandler("menu:setGreyedOut", function(state, id)
	if id and isIDRegistered(id) and type(state) == "boolean" then
		getByID(id).greyedout = state
		
		SendNUIMessage({
			setExtraClass = {id = id, className = "greyedout", state = state}
		})
	end
end)

AddEventHandler("menu:isGreyedOut", function(id, cb)
	if id and isIDRegistered(id) and cb then
		cb(getByID(id).greyedout)
	end
end)

AddEventHandler("menu:setRightText", function(id, text)
	if id and isIDRegistered(id) then
		if text then
			local text = trimTextLength(text, config.items.righttextlength)
		end
		local element = getByID(id)
		element.righttext = text
		
		if element.onoff == nil and not element.items then
			SendNUIMessage({
				setRightText = {id = id, text = text}
			})
		end
	end
end)

AddEventHandler("menu:getRightText", function(id, cb)
	if id and isIDRegistered(id) and cb then
		cb(getByID(id).righttext)
	end
end)

function trimTextLength(text, length)
	if string.len(text) > length then
		return string.sub(text, 1, length)
	else
		return text
	end
end

function getByID(id)
	for _, item in ipairs(moduleContent) do
		if item.id == id then
			return item
		end
	end
end

function isIDRegistered(id)
	return getByID(id) ~= nil
end

math.randomseed(GetGameTimer())
function uuid()
    local template ='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    return string.gsub(template, '[xy]', function (c)
        local v = (c == 'x') and math.random(0, 0xf) or math.random(8, 0xb)
        return string.format('%x', v)
    end)
end