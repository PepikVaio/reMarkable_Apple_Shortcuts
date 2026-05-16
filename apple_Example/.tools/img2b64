#!/bin/bash

# Show help
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
  echo "img2b64 - Convert image to Base64"
  echo ""
  echo "Usage:"
  echo "  img2b64 <path to image>"
  echo ""
  echo "Examples:"
  echo "  img2b64 image.png"
  echo "  img2b64 ~/Desktop/photo.jpg"
  echo ""
  echo "Output:"
  echo "  Copies Base64 string to clipboard."
  echo ""
  exit 0
fi

# No file provided
if [ -z "$1" ]; then
  echo "No image file provided."
  echo "Use: img2b64 --help"
  echo ""
  exit 1
fi

# Convert image to Base64
base64 -b 0 -i "$1" | pbcopy
echo "Base64 copied to clipboard"
echo ""
