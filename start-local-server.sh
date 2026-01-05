#!/bin/bash

echo "========================================"
echo " AyudaVenezuela.org - Local Test Server"
echo "========================================"
echo ""
echo "Starting local web server..."
echo ""
echo "Your site will be available at:"
echo "  http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo "========================================"
echo ""

cd "$(dirname "$0")"
python3 -m http.server 8000
