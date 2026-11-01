# FleetCo IT Knowledge Base: Email Setup Guide

## Overview
FleetCo provides enterprise email via Microsoft 365 Exchange Online. All communications are protected with modern authentication, DKIM, and DLP controls.

## Webmail Access
You can access your email anytime from any corporate or approved BYOD browser at:
`https://outlook.office.com/mail`
Log in with your primary `username@fleetco.com` address and approve the Okta SSO push.

## Setting Up Outlook on Windows Desktop
1. Open Microsoft Outlook from the Start Menu.
2. If prompted, enter your email address `username@fleetco.com` and click "Connect".
3. When the FleetCo Okta Sign-In window appears, enter your password and complete MFA.
4. Check "Allow my organization to manage my device" and click Done.
5. Wait for the initial mailbox sync to complete (typically 3-5 minutes depending on network speed).

## Setting Up Email on iOS and Android (FleetCo Mobile)
1. Install Microsoft Outlook from the Apple App Store or Google Play Store.
   - Note: Do NOT use native iOS Mail or Samsung Mail; FleetCo MDM (Microsoft Intune) enforces Outlook app protection policies.
2. Open Outlook and tap "Add Account".
3. Enter `username@fleetco.com`.
4. Authenticate via Okta SSO and Duo/Okta Verify.
5. If prompted by Company Portal / Microsoft Intune, install the FleetCo Management Profile and set an app PIN code (minimum 6 digits).

## IMAP/SMTP Disabled Notice
Legacy IMAP and POP3 protocols are strictly disabled across FleetCo for security compliance. Only Modern Authentication (OAuth 2.0) via official Microsoft Outlook clients is permitted.
