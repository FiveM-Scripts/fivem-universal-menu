local controls = {
	{control = 167, action = "toggle", alwayslisten = true},
	{control = 172, action = "up"},
	{control = 173, action = "down"},
	{control = 174, action = "left"},
	{control = 175, action = "right"},
	{control = 176, action = "enter"},
	{control = 177, action = "back"}
}

Citizen.CreateThread(function()
	while true do
		Wait(1)
		
		if not blockinput then
			for _, data in ipairs(controls) do
				if menuopen or data.alwayslisten then
					if IsControlJustPressed(1, data.control) then
						data.scrollcooldown = config.scrolling.cooldown
						send(data.action)
					elseif IsControlPressed(1, data.control) and data.scrollcooldown then
						if data.scrollcooldown > 0 then
							data.scrollcooldown = data.scrollcooldown - 1
						else
							data.scrollcooldown = config.scrolling.continouscooldown
							send(data.action)
						end
					elseif IsControlJustReleased(1, data.control) then
						data.scrollcooldown = 0
					end
				end
			end
		end
	end
end)

RegisterNUICallback("playsound", function(data, cb)
	PlaySoundFrontend(-1, data.name, "HUD_FRONTEND_DEFAULT_SOUNDSET",  true)
end)

RegisterNUICallback("menuclose", function(data, cb)
	menuopen = false
end)

RegisterNUICallback("print", function(data, cb)
	print(data.msg)
end)

function drawNotification(text)
	SetNotificationTextEntry("STRING")
	AddTextComponentString(text)
	DrawNotification(false, false)
end

function stringsplit(inputstr, sep)
    if sep == nil then
            sep = "%s"
    end
    local t={} ; i=1
    for str in string.gmatch(inputstr, "([^"..sep.."]+)") do
            t[i] = str
            i = i + 1
    end
    return t
end

function send(data)
	if data == "toggle" then
		if not menuopen then
			menuopen = true
			SendNUIMessage({
				showmenu = true
			})
		else
			menuopen = false
			SendNUIMessage({
				hidemenu = true
			})
		end
	elseif data == "enter" then
		SendNUIMessage({
			menuenter = true
		})
	elseif data == "back" then
		SendNUIMessage({
			menuback = true
		})
	elseif data == "up" then
		SendNUIMessage({
			menuup = true
		})
	elseif data == "down" then
		SendNUIMessage({
			menudown = true
		})
	elseif data == "right" then
		SendNUIMessage({
			menuright = true
		})
	elseif data == "left" then
		SendNUIMessage({
			menuleft = true
		})
	end
end