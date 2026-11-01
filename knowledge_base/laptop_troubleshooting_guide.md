# FleetCo IT Knowledge Base: Laptop Troubleshooting Guide

## Overview
FleetCo provisions Lenovo ThinkPad P-Series (Windows 11 Enterprise) and Apple MacBook Pro M-series (macOS Sonoma). This guide addresses common hardware, display, and performance faults.

## Battery and Power Issues
1. **Unresponsive Laptop / Won't Power On**:
   - Disconnect docking station, external monitors, and USB hubs.
   - For ThinkPads: Locate the emergency reset pinhole on the bottom cover. Insert a straightened paperclip for 10 seconds, reconnect OEM 65W/100W USB-C charger, and wait 5 minutes before pressing Power.
   - For MacBooks: Hold the Power/TouchID button down firmly for 10 seconds, release, wait 5 seconds, then press once.
2. **Battery Not Charging Past 80%**:
   - FleetCo battery threshold conservation is enabled via Lenovo Vantage / macOS Battery Health to extend battery longevity. This is normal behavior when docked continuously.

## Display & Docking Station Connection
1. If external 4K monitors are black or blinking:
   - Unplug the Thunderbolt 4 cable from your laptop.
   - Power cycle the Dell/CalDigit dock by pulling its AC power cable for 15 seconds.
   - Re-seat the Thunderbolt cable into the designated Thunderbolt port (indicated by the lightning bolt icon).
2. **Display Resolution / Scaling**:
   - Windows: Settings -> System -> Display -> Scaling (set to 100% or 125%).
   - macOS: System Settings -> Displays -> Advanced -> Set resolution to Default.

## Sluggish Performance and High Memory Usage
1. Open Task Manager (`Ctrl + Shift + Esc`) or macOS Activity Monitor (`Cmd + Space` -> Activity Monitor).
2. Check for runaway Chrome tabs, unclosed Docker containers, or background indexing.
3. Perform a clean reboot: FleetCo policy mandates rebooting your device at least once every 7 days to apply Windows/macOS patches.

## Wi-Fi Troubleshooting
- If FleetCo-Corp 802.1x Wi-Fi refuses to connect, forget the network `FleetCo-Corp`, reconnect, and select EAP method: PEAP, Inner Auth: MSCHAPv2, Domain: `fleetco.internal`.
