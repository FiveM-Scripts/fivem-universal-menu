config = {
	controls = {
		{control = 167, action = "toggle", alwayslisten = true}, -- Open/Close Menu
		{control = 172, action = "up"}, -- Up
		{control = 173, action = "down"}, -- Down
		{control = 174, action = "left"}, -- Previous Page
		{control = 175, action = "right"}, -- Next Page
		{control = 176, action = "enter"}, -- Enter
		{control = 177, action = "back"} -- Back
	},
	
	scrolling = {
		cooldown = 25, -- Time after holding an arrow key to start continous scrolling
		continouscooldown = 5 -- Time between scrolls in continous scrolling mode
	},
	
	items = {
		maxtextlength = 25 -- Maximum length a text can be
	}
}