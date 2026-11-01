# FleetCo IT Knowledge Base: Password Reset Guide

## Overview
FleetCo uses Okta Single Sign-On (SSO) integrated with Azure Active Directory. Passwords expire every 90 days according to SOC2 compliance standards.

## Self-Service Password Reset (SSPR)
Employees can reset their password independently at any time:
1. Navigate in a browser to `https://sso.fleetco.com/recovery` or click "Forgot Password?" on the login screen.
2. Enter your FleetCo email address (`username@fleetco.com`).
3. Complete MFA authentication using your registered authenticator (Okta Verify, Duo Push, or SMS backup code).
4. Enter your new password twice adhering to password complexity rules.

## Password Complexity Requirements
- Minimum length: 14 characters
- Must include at least:
  - 1 uppercase letter (A-Z)
  - 1 lowercase letter (a-z)
  - 1 numerical digit (0-9)
  - 1 special symbol (!@#$%^&*()_+)
- Cannot contain your first name, last name, or "FleetCo"
- Cannot be any of your previous 6 passwords

## Account Lockout Policy
- If you enter an incorrect password 5 consecutive times, your account locks for 30 minutes.
- To unlock immediately without waiting 30 minutes, visit `https://sso.fleetco.com/unlock` and authenticate via SMS or Okta push.

## Updating Credentials on Local Machines
- After changing your SSO password, lock your workstation (`Win + L` on Windows, `Cmd + Ctrl + Q` on macOS).
- Enter the NEW password to sync your local offline cache with Active Directory.
- If prompted in Outlook, Teams, or Slack, enter the new credentials once.
