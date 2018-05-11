RegisterNetEvent("menu:registerModuleMenu")
RegisterNetEvent("menu:addModuleSubMenu")
RegisterNetEvent("menu:addModuleItem")
local moduleMenus = {}

AddEventHandler("menu:registerModuleMenu", function(name, cb)
	if not name or not cb then
		return
	end
	
	id = uuid()
	table.insert(moduleMenus, {id = id, name = name, items = {}})
	SendNUIMessage({
		addModuleMenu = {id = id, name = name}
	})
	cb(id)
end)

AddEventHandler("menu:addModuleSubMenu", function(parent, name, cb)
	if not parent or not name or not cb then
		return
	end

	local moduleMenu = _getModuleMenu(parent)
	if not moduleMenu then
		cb(nil)
	else
		id = uuid()
		table.insert(moduleMenu.items, {id = id, name = name, type = "menu", items = {}})
		SendNUIMessage({
			addModuleSubMenu = {parent = parent, id = id, name = name}
		})
		cb(id)
	end
end)

AddEventHandler("menu:addModuleItem", function(menu, name, cbid, cbclick)
	if not menu or not name or not cb then
		return
	end

	local moduleMenu = _getModuleMenu(parent)
	if not moduleMenu then
		cb(nil, nil)
	else
		id = uuid()
		cbname = uuid()
		table.insert(moduleMenu.items, {id = id, name = name, type = "action"})
		SendNUIMessage({
			addModuleItem = {menu = menu, id = id, name = name, cbname = cbname}
		})
		RegisterNUICallback(cbname, function(data, mcb)
			cbclick(id)
		end)
		cbid(id)
	end
end)

function _getModuleMenu(id)
	for _, moduleMenu in ipairs(moduleMenus) do
		if moduleMenu.id == id or _getModuleSubMenu(moduleMenu, id) then
			return moduleMenu
		end
	end
end

function _getModuleSubMenu(parent, id)
	for _, item in ipairs(parent.items) do
		if item.id == id or (item.type == "menu" and _getModuleSubMenu(item, id)) then
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