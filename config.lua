--[[
	-- Controls --
	https://wiki.fivem.net/wiki/Controls
	
	-- Colors --
	r: Red (0 - 255)
	g: Green (0 - 255)
	b: Blue (0 - 255)
	a: Alpha (0.0 - 1.0)
	From Left to Right
]]--

config = {
	controls = {
		{control = 167, action = "toggle", alwayslisten = true}, -- Open/Close Menu (F6 by default)
		{control = 172, action = "up"}, -- Up
		{control = 173, action = "down"}, -- Down
		{control = 174, action = "left"}, -- Previous Page
		{control = 175, action = "right"}, -- Next Page
		{control = 176, action = "enter"}, -- Enter
		{control = 177, action = "back"} -- Back
	},
	
	title = {
		text = "Universal Menu", -- Header Default Text
		color = {
			from = {
				r = 2,
				g = 136,
				b = 209,
				a = 0.9
			},
			
			to = {
				r = 1,
				g = 87,
				b = 155,
				a = 0.8
			}
		}
	},
	
	scrolling = {
		cooldown = 25, -- Time after holding an arrow key to start continous scrolling
		continouscooldown = 5 -- Time between scrolls in continous scrolling mode
	},
	
	items = {
		maxtextlength = 25, -- Maximum length a text can be
	}
}
