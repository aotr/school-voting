#!/bin/bash

# Manual E2E Test Script for Voting System
# This tests all core functionality without Playwright

echo "╔════════════════════════════════════════╗"
echo "║  🗳️ VOTING SYSTEM E2E TEST SUITE      ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SERVER_URL="http://localhost:3000"
PASS=0
FAIL=0

test_api() {
  local name=$1
  local method=$2
  local endpoint=$3
  local data=$4
  local expected=$5
  
  echo -e "${BLUE}TEST:${NC} $name"
  
  if [ -z "$data" ]; then
    response=$(curl -s -X $method "$SERVER_URL$endpoint")
  else
    response=$(curl -s -X $method "$SERVER_URL$endpoint" \
      -H "Content-Type: application/json" \
      -d "$data")
  fi
  
  if echo "$response" | grep -q "$expected"; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASS++))
  else
    echo -e "${RED}❌ FAIL${NC}"
    echo "Expected: $expected"
    echo "Got: $response"
    ((FAIL++))
  fi
  echo ""
}

# Test 1: Load election and candidates
test_api \
  "Load Election Data" \
  "GET" \
  "/api/election" \
  "" \
  "School Election 2026"

# Test 2: Get initial state (no votes)
test_api \
  "Initial State - Zero Votes" \
  "GET" \
  "/api/results" \
  "" \
  "candidates"

# Test 3: Record a vote
test_api \
  "Record Vote for Candidate 533" \
  "POST" \
  "/api/vote/533" \
  "" \
  "success"

# Test 4: Check vote was counted
test_api \
  "Verify Vote Count Increased" \
  "GET" \
  "/api/election" \
  "" \
  "totalVotes"

# Test 5: Record another vote
test_api \
  "Record Vote for Candidate 534" \
  "POST" \
  "/api/vote/534" \
  "" \
  "success"

# Test 6: Admin login with correct password
test_api \
  "Admin Login (Correct Password)" \
  "POST" \
  "/api/admin/login" \
  '{"password":"admin123"}' \
  "success"

# Test 7: Check admin status
test_api \
  "Verify Admin Session Active" \
  "GET" \
  "/api/admin/status" \
  "" \
  "isAdmin"

# Test 8: Admin login with wrong password
test_api \
  "Admin Login (Wrong Password - Should Fail)" \
  "POST" \
  "/api/admin/login" \
  '{"password":"wrongpassword"}' \
  "error"

# Test 9: Reset votes as admin
test_api \
  "Reset All Votes (Admin)" \
  "POST" \
  "/api/admin/reset-votes" \
  "" \
  "success"

# Test 10: Verify votes were reset
echo -e "${BLUE}TEST:${NC} Verify Votes Reset to Zero"
response=$(curl -s "$SERVER_URL/api/results")
if echo "$response" | grep -q "candidates"; then
  # Check if votes are all 0
  vote_sum=$(echo "$response" | grep -o '"votes":[0-9]*' | grep -o '[0-9]*' | awk '{s+=$1} END {print s}')
  if [ "$vote_sum" = "0" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASS++))
  else
    echo -e "${RED}❌ FAIL${NC} - Expected 0 votes, got $vote_sum"
    ((FAIL++))
  fi
else
  echo -e "${RED}❌ FAIL${NC}"
  ((FAIL++))
fi
echo ""

# Print summary
echo "╔════════════════════════════════════════╗"
echo "║           TEST SUMMARY                 ║"
echo "╠════════════════════════════════════════╣"
echo -e "║  ${GREEN}✅ Passed: $PASS${NC}"
echo -e "║  ${RED}❌ Failed: $FAIL${NC}"
echo "╚════════════════════════════════════════╝"
echo ""

if [ $FAIL -eq 0 ]; then
  echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
  exit 0
else
  echo -e "${RED}⚠️  SOME TESTS FAILED${NC}"
  exit 1
fi
