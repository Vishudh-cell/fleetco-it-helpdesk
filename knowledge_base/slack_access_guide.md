# FleetCo IT Knowledge Base: Slack Access Guide

## Overview
FleetCo Enterprise Grid Slack (`fleetco.slack.com`) is the primary real-time communication platform for all engineering, logistics, and corporate departments.

## Joining the FleetCo Slack Workspace
1. Navigate to `https://fleetco.slack.com` in your browser or launch the desktop Slack app.
2. Click "Sign in with FleetCo Okta SSO".
3. Authenticate using your FleetCo credentials (`username@fleetco.com`) and complete Okta Verify MFA.
4. If you are a new hire, you will automatically be added to mandatory default channels:
   - `#announcements-all`
   - `#general-fleetco`
   - `#it-helpdesk`
   - `#hr-benefits`

## Troubleshooting Slack Login Issues
- **Error: "Workspace not found" or "Account Deactivated"**:
  Ensure you are visiting `fleetco.slack.com` (not personal Slack or previous company workspaces). If account deactivation is displayed, check with your manager that your onboarding ticket was approved in Workday.
- **SSO Loop / Blank Screen**:
  1. In Slack Desktop client, press `Ctrl + R` (Windows) or `Cmd + R` (macOS) to reload.
  2. Click `Help` -> `Troubleshooting` -> `Clear Cache and Restart`.
  3. Ensure your default browser is set to Chrome or Edge with third-party cookies permitted for `*.slack.com` and `*.okta.com`.

## Requesting Access to Private Channels and User Groups
- FleetCo department channels (e.g., `#finance-confidential`, `#infra-oncall`, `#executive-team`) require explicit owner approval.
- Use the Slack workflow command `/request-channel` or submit a quick request in `#it-helpdesk` referencing your cost-center and manager's Slack handle.

## Guest & Contractor Access
External vendors and contractors must be invited as Single-Channel or Multi-Channel Guests with an assigned expiration date. Guest invites must be sponsored by a Director-level FleetCo employee via ServiceNow IT portal.
