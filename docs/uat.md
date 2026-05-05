# User Acceptance Test (UAT)

---

## Test Case 1: User Registration and Login

### Preconditions
- Backend is running
- Database is available

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Open Signup Page | Signup form is displayed | Pass |
| 2 | Enter valid user data | Data accepted | Pass |
| 3 | Submit registration | User account created | Pass |
| 4 | Login with credentials | User redirected to main UI | Pass |

---

## Test Case 2: Create Conversation

### Preconditions
- User is logged in

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Click "Start Conversation" | Modal opens | Pass |
| 2 | Enter valid user ID | System accepts input | Pass |
| 3 | Confirm creation | Conversation appears in list | Pass |

---

## Test Case 3: Send and Receive Message

### Preconditions
- Conversation exists

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Open conversation | Chat window loads | Pass |
| 2 | Type message | Input accepted | Pass |
| 3 | Click "Send" | Message stored in database | Pass |
| 4 | Refresh messages | Message appears in chat | Pass |

---

## Test Case 4: Localization (i18n)

### Preconditions
- System supports multiple languages

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Select Arabic language | UI updates to Arabic | Pass |
| 2 | Select Japanese language | UI updates to Japanese | Pass |
| 3 | Request missing key | Falls back to English | Pass |

---

## Test Case 5: Invalid Input Handling

### Preconditions
- User is logged in

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Enter invalid friend ID | Error message shown | Pass |
| 2 | Send empty message | Message rejected | Pass |

---

## Test Summary

- Total Test Cases: 5
- Passed: 5
- Failed: 0
- Result: System meets functional requirements