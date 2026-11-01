# FleetCo IT Knowledge Base: VPN Reset Guide

## Overview
FleetCo utilizes Cisco AnyConnect and WireGuard secure gateways for remote staff. If you cannot connect to internal resources, AWS VPCs, or corporate intranets, follow these reset procedures.

## Common Symptoms
- "Login failed" error when connecting to `vpn.fleetco.internal`
- Gateway timeout or connection drops after 30 seconds
- MFA push notification not received on Duo Mobile

## Step-by-Step VPN Reset Procedure
1. **Kill Existing Sessions**: Right-click the FleetCo VPN icon in your system tray/menu bar, select "Disconnect", then completely exit the client.
2. **Flush DNS Cache**:
   - Windows: Open PowerShell as Administrator and run: `ipconfig /flushdns` followed by `ipconfig /renew`.
   - macOS: Open Terminal and run: `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`.
3. **Clear Cached VPN Credentials**:
   - Navigate to FleetCo VPN Client -> Settings -> Preferences.
   - Uncheck "Remember Credentials" and restart the application.
4. **MFA Resync**:
   - Open Duo Mobile on your registered smartphone.
   - If no push appears, enter the manual 6-digit one-time passcode (OTP) appended directly to your password (`YourPassword123,456789`).
5. **Gateway Selection**:
   - Primary Gateway: `vpn-primary.fleetco.com:443`
   - Backup Gateway: `vpn-dr.fleetco.com:443` (use if primary is undergoing maintenance)

## Troubleshooting Certificate Issues
If prompted with "Certificate Invalid", ensure the FleetCo Root CA certificate is installed under Trusted Root Authorities. You can reinstall certificates from `https://cert.fleetco.internal/enroll`.

## Escalation Policy
If VPN connectivity fails after resetting DNS and verifying Duo MFA, contact FleetCo Network SecOps via #it-helpdesk or request human escalation for IP whitelist review.
