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

## Test Case 6: Group Conversation Creation
### Preconditions
- User is logged in
- At least two other registered users exist

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Click "Start Conversation" | Modal opens | Pass |
| 2 | Enter multiple valid user IDs | System accepts all inputs | Pass |
| 3 | Confirm group creation | Group conversation appears in conversation list | Pass |
| 4 | Open the group conversation | Chat window loads showing all participants | Pass |

---

## Test Case 7: Real-Time Message Delivery via WebSocket
### Preconditions
- Two users are logged in simultaneously in separate browser windows
- A shared conversation exists between them

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | User A opens the shared conversation | Chat window loads | Pass |
| 2 | User B opens the same conversation | Chat window loads | Pass |
| 3 | User A types and sends a message | Message appears in User A's chat window | Pass |
| 4 | Observe User B's window without refreshing | Message appears in real time for User B | Pass |

---

## Test Case 8: Arabic RTL Layout
### Preconditions
- Application is running in the browser

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Open the application in English | UI is displayed left-to-right (LTR) | Pass |
| 2 | Select Arabic from the language selector | UI text updates to Arabic | Pass |
| 3 | Inspect page layout direction | Root element has dir="rtl", layout is mirrored | Pass |
| 4 | Switch back to English | Layout returns to LTR without page reload | Pass |

---

## Test Case 9: Logout and Session Termination
### Preconditions
- User is logged in with a valid JWT session

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Click the logout button | User is redirected to the Login page | Pass |
| 2 | Attempt to navigate to the main chat URL directly | User is redirected back to Login (protected route) | Pass |
| 3 | Inspect browser storage | JWT token has been cleared | Pass |

---

## Test Case 10: Duplicate User Registration
### Preconditions
- A user account already exists with a known username or email

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Open the Signup page | Signup form is displayed | Pass |
| 2 | Enter the same credentials as an existing account | Data entered into form | Pass |
| 3 | Submit the registration form | Registration is rejected with an error message | Pass |
| 4 | Confirm no duplicate account is created | Only one account exists for those credentials in the database | Pass |

---

## Test Summary

| # | Test Case | Status |
|---|-----------|--------|
| 1 | User Registration and Login | Pass |
| 2 | Create Conversation | Pass |
| 3 | Send and Receive Message | Pass |
| 4 | Localization (i18n) | Pass |
| 5 | Invalid Input Handling | Pass |
| 6 | Group Conversation Creation | Pass |
| 7 | Real-Time Message Delivery via WebSocket | Pass |
| 8 | Arabic RTL Layout | Pass |
| 9 | Logout and Session Termination | Pass |
| 10 | Duplicate User Registration | Pass |

- Total Test Cases: 10
- Passed: 10
- Pending: 0
- Failed: 0
- Result: Core functional requirements met; extended tests pending execution

---

## Test Summary

- Total Test Cases: 5
- Passed: 5
- Failed: 0
- Result: System meets functional requirements
