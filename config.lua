-- Controls: https://wiki.fivem.net/wiki/Controls

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
	
	menu = {
		title = {
			color = { -- (Left to Right)
				from = {
					r = 2, -- Red
					g = 136, -- Green
					b = 209, -- Blue
					a = 0.9 -- Alpha
				},
				
				to = {
					r = 1, -- Red
					g = 87, -- Green
					b = 155, -- Blue
					a = 0.8 -- Alpha
				},
				
				css = nil -- Advanced users only, replace nil with css background attribute
			}
		}
	},
	
	scrolling = {
		cooldown = 25, -- Time after holding an arrow key to start continous scrolling
		continouscooldown = 5 -- Time between scrolls in continous scrolling mode
	},
	
	items = {
		maxtextlength = 25 -- Maximum length a text can be
	}
}
