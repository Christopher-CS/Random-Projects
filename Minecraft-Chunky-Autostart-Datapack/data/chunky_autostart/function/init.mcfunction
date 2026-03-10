# Create the state tracker (fails silently if it already exists)
scoreboard objectives add chunky_state dummy

# Reset the state to 0 on server boot so it forces a fresh check
scoreboard players set #chunky_autostart chunky_state 0

# Start the checking loop
function chunky_autostart:check