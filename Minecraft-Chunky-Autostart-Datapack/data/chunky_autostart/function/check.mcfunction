# If 0 players are online, AND the state is NOT 1 (running), run the resume function
execute unless entity @a unless score #chunky_autostart chunky_state matches 1 run function chunky_autostart:resume

# If 1+ players are online, AND the state IS 1 (running), run the pause function
execute if entity @a if score #chunky_autostart chunky_state matches 1 run function chunky_autostart:pause

# Reschedule this check for 2 seconds (40 ticks)
schedule function chunky_autostart:check 2s replace