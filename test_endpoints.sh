#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Testing Tool Inventory Management System API Endpoints"
echo "===================================================="

# Test 1: Create a new tool
echo -e "\n${GREEN}Test 1: Creating a new tool${NC}"
CREATE_TOOL_RESPONSE=$(curl -s -X POST http://localhost:5001/api/tools \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hammer",
    "description": "Standard claw hammer"
  }')
echo "Response: $CREATE_TOOL_RESPONSE"

# Extract tool ID from response using Python
TOOL_ID=$(echo $CREATE_TOOL_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])")
echo "Created tool ID: $TOOL_ID"

# Test 2: Get all tools
echo -e "\n${GREEN}Test 2: Getting all tools${NC}"
curl -s http://localhost:5001/api/tools | python3 -m json.tool

# Test 3: Get specific tool
echo -e "\n${GREEN}Test 3: Getting specific tool${NC}"
curl -s http://localhost:5001/api/tools/$TOOL_ID | python3 -m json.tool

# Test 4: Get tool QR code
echo -e "\n${GREEN}Test 4: Getting tool QR code${NC}"
curl -s http://localhost:5001/api/tools/$TOOL_ID/qr | python3 -m json.tool

# Test 5: Lend a tool
echo -e "\n${GREEN}Test 5: Lending a tool${NC}"
LEND_RESPONSE=$(curl -s -X POST http://localhost:5001/api/tools/$TOOL_ID/lend \
  -H "Content-Type: application/json" \
  -d '{
    "borrower_name": "John Doe",
    "notes": "For weekend project"
  }')
echo "Response: $LEND_RESPONSE"

# Test 6: Get lending records
echo -e "\n${GREEN}Test 6: Getting all lending records${NC}"
curl -s http://localhost:5001/api/lending-records | python3 -m json.tool

# Test 7: Return a tool
echo -e "\n${GREEN}Test 7: Returning a tool${NC}"
RETURN_RESPONSE=$(curl -s -X POST http://localhost:5001/api/tools/$TOOL_ID/return \
  -H "Content-Type: application/json")
echo "Response: $RETURN_RESPONSE"

# Test 8: Verify tool status after return
echo -e "\n${GREEN}Test 8: Verifying tool status after return${NC}"
curl -s http://localhost:5001/api/tools/$TOOL_ID | python3 -m json.tool

# Test 9: Create another tool
echo -e "\n${GREEN}Test 9: Creating another tool${NC}"
curl -s -X POST http://localhost:5001/api/tools \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Screwdriver",
    "description": "Phillips head screwdriver"
  }' | python3 -m json.tool

# Test 10: Final tools list
echo -e "\n${GREEN}Test 10: Final list of all tools${NC}"
curl -s http://localhost:5001/api/tools | python3 -m json.tool 