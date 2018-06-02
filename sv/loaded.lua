local currentVersion = GetResourceMetadata(GetCurrentResourceName(), "resource_version", 0)

PerformHttpRequest("94.130.180.216/menu/version.json", function(statusCode, text, headers)
	local version = json.decode(text).version
	if version ~= currentVersion then
		print("[Universal Menu] Newer Version " .. version .. " is available!")
	end
	RconPrint("[Universal Menu] Version " .. currentVersion .. " loaded!\n")
end)