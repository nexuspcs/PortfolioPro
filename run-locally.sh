#!/bin/bash

# Install PHP using Homebrew (brew)
brew install php

# Check if the installation was successful before starting the PHP server
if [ $? -eq 0 ]; then
  # Start the PHP development server in the background
  php -S localhost:9005 &

  # Wait for a short moment to ensure the server is up and running
  sleep 2

  # Open the default web browser with the URL hosted by localhost
  open "http://localhost:9005/"
else
  echo "Error: Installation failed. Please check the output above for any error messages."
fi

# Keep the script running in the background to keep the server running
while true; do
    sleep 1
done
