#!/bin/bash

# Pull the built comfoair-card from the AI dev machine to the HA server.
# Run this script from the HA server.
#
# Usage: ./pull_from_ai.sh
#
# It rsyncs the dist/ directory from the dev machine into the HA
# www/community/lovelace-comfoair/ directory, then reloads HA resources
# via a webhook (if changes were detected).

# Define paths
SOURCE="zb@192.168.1.210:/home/zb/code/lovelace-comfoair/dist/"
DEST="/mnt/nvme/data/hass/config/www/community/lovelace-comfoair/"

# Ensure destination exists
mkdir -p "$DEST"

# Run rsync (-i prints a line for each changed file)
CHANGES=$(rsync -azi --checksum --no-o --no-g \
  "$SOURCE" "$DEST")

# Reload home assistant resources only if rsync transferred something
if [ -n "$CHANGES" ]; then
  echo "$CHANGES"
  echo "Files changed — please refresh your browser (Ctrl+Shift+R) to reload the card"
else
  echo "No changes"
fi
