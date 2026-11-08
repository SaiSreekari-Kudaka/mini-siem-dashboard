# Mini SIEM Dashboard

A full-stack, defensive Security Information and Event Management (SIEM) application designed to simulate core Security Operations Center (SOC) workflows.

The application ingests simulated security logs, parses and normalizes events, evaluates detection rules, generates alerts, and provides an interactive dashboard for monitoring and investigating security-related activity.

This project is intended for educational, portfolio, and defensive cybersecurity purposes. It does not include malware, exploitation tools, credential theft, attack automation, or other offensive functionality. All suspicious activity represented in the application uses simulated telemetry and safe sample logs.

## Project Overview

Mini SIEM Dashboard demonstrates a simplified end-to-end security monitoring workflow:

1. Security logs are uploaded or submitted to the backend.
2. The logs are parsed and normalized into structured security events.
3. Raw log data and normalized events are stored separately.
4. Detection rules evaluate incoming events.
5. Matching activity generates or updates security alerts.
6. Analysts can investigate events, manage alerts, and add notes.
7. Administrators can manage users, detection rules, threat intelligence indicators, and demo data.

The project combines a React-based SOC interface with a FastAPI backend and PostgreSQL database.

## Features

### Security Dashboard

- Centralized dashboard for monitoring security activity
- Security metrics and summary information
- Recent alerts and event activity
- SOC-style visualizations using existing application data
- Responsive dark security-focused interface

### Log Ingestion

- Upload support for JSON, CSV, TXT, and LOG files
- File type and size validation
- Structured event ingestion through the API
- Raw log storage separated from normalized events
- Upload processing results and previews
- Support for safe sample security logs

### Log Parsing and Normalization

The backend supports parsing and normalization for multiple log formats, including:

- SSH authentication logs
