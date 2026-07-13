# TODO - Student login + error panel fix

## Step 1: Backend-backed Student login
- [x] Add backend endpoint for student lookup by schoolCode + admissionNo
- [ ] Confirm frontend uses the backend endpoint (login flow)
- [ ] Validate login end-to-end with real schoolCode/admissionNo


## Step 2: Fix error section corporate color mismatch
- [ ] Update error panel styling logic in `akilihub/src/pages/Login.tsx`
- [ ] Ensure consistent success/error detection (no fragile string includes)

## Step 3: Validate
- [ ] Run TypeScript build/lint for frontend and backend
- [ ] Manual test: student login succeeds with valid schoolCode/admissionNo

