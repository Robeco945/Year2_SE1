# User Acceptance Test (UAT)

---

## Test Case 1: Add Friend and Send Message

**Design date:** 28/04/2026  
**Executed by:** Roberto  
**Execution date:** 28/04/2026  

### Preconditions
- User has access to the system
- User has a valid account
- User knows friend's ID

### Steps

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Sign up | Account created and messaging UI opens | Pass |
| 2 | Click "Start Conversation" | Modal opens | Pass |
| 3 | Enter friend ID and confirm | Chat window opens | Pass |
| 4 | Type message and send | Message appears in chat | Pass |

---

## Test Case 2: Login Existing User

**Preconditions**
- User account already exists

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Enter valid credentials | User logged in | Pass |
| 2 | Open messaging UI | UI loads correctly | Pass |

---

## Test Case 3: Invalid Friend ID

**Preconditions**
- User logged in

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Start conversation | Modal opens | Pass |
| 2 | Enter invalid ID | Error message displayed | Pass |
| 3 | Retry with correct ID | Chat opens | Pass |

---

## Test Summary

- Total Test Cases: 3
- Passed: 3
- Failed: 0
- Result: System meets user requirements