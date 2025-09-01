# HavenX CSV Data Management System

## 🚀 Overview

The HavenX system now includes comprehensive CSV data management functionality for storing user login data, managing new users, and generating detailed reports. This system provides enterprise-grade user management with CSV import/export capabilities.

## 📁 File Structure

```
src/
├── utils/
│   └── csvManager.ts          # Core CSV management functionality
├── components/
│   ├── UserManagement.tsx     # User management interface
│   ├── CSVExport.tsx          # CSV export and reporting
│   └── Login.tsx              # Enhanced login with CSV integration
└── contexts/
    └── AuthContext.tsx        # Authentication with CSV data
```

## 🔧 Core Features

### 1. CSV Data Manager (`csvManager.ts`)

**Key Features:**
- **User Management**: Add, edit, delete, and authenticate users
- **Login Tracking**: Record all login attempts (successful/failed)
- **Activity Logging**: Track user activities and security events
- **CSV Import/Export**: Full CSV data import and export capabilities
- **Risk Analysis**: Automatic security scoring and risk assessment
- **Account Locking**: Automatic account suspension after failed attempts

**Data Structures:**
```typescript
interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer';
  department: string;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
  securityScore: number;
  failedLoginAttempts: number;
  lastPasswordChange: string;
  twoFactorEnabled: boolean;
}

interface LoginRecord {
  id: string;
  userId: string;
  username: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  device: string;
  status: 'success' | 'failed' | 'suspended';
  riskLevel: 'low' | 'medium' | 'high';
  sessionDuration?: number;
  logoutTime?: string;
  notes?: string;
}
```

### 2. User Management Interface (`UserManagement.tsx`)

**Features:**
- ✅ **Add New Users**: Complete user registration with role assignment
- ✅ **Edit Users**: Modify user profiles and settings
- ✅ **Delete Users**: Remove users from the system
- ✅ **User Status Management**: Activate/deactivate user accounts
- ✅ **Search & Filter**: Find users by name, role, department
- ✅ **CSV Import**: Bulk import users from CSV files
- ✅ **CSV Export**: Export user data to CSV format
- ✅ **Real-time Updates**: Live data synchronization

**User Roles:**
- **Admin**: Full system access and user management
- **Analyst**: Security analysis and reporting capabilities
- **Viewer**: Read-only access to dashboards

### 3. CSV Export & Reporting (`CSVExport.tsx`)

**Report Types:**
1. **User Data**: Complete user profiles and information
2. **Login Records**: All login attempts and session data
3. **User Activities**: Detailed activity logs and security events
4. **Security Analytics**: Comprehensive security metrics

**Export Features:**
- 📊 **Multiple Report Types**: Choose from 4 different report categories
- 📅 **Date Range Filtering**: Export data for specific time periods
- 📈 **Real-time Statistics**: Live metrics and analytics
- 💾 **Automatic Downloads**: Direct CSV file downloads
- 🔄 **Export History**: Track previous exports

## 🔐 Authentication & Security

### Enhanced Login System

**Security Features:**
- **Account Locking**: Automatic suspension after 5 failed attempts
- **Login Tracking**: Record all login attempts with metadata
- **Risk Assessment**: Automatic risk level calculation
- **Session Management**: Track login sessions and durations
- **IP Tracking**: Monitor login locations and devices

**Default Users:**
```
Username: devv       Password: devv123      Role: Admin (Devv Saxena)
Username: priyanshi   Password: priyanshi123  Role: Analyst (Priyanshi Saxena)
Username: mohak      Password: mohak123     Role: Viewer (Mohak)
Username: tushar     Password: tushar123    Role: Viewer (Tushar Suthar)
Username: riya       Password: riya123      Role: Viewer (Riya Raut)
```

## 📊 CSV Export Formats

### 1. User Data Export
```csv
ID,Username,Name,Email,Role,Department,Created At,Last Login,Is Active,Security Score,Failed Login Attempts,Last Password Change,2FA Enabled
1,admin,System Administrator,admin@havenx.com,admin,IT,2024-01-01T00:00:00.000Z,2024-01-15T10:30:00.000Z,Yes,95,0,2024-01-01T00:00:00.000Z,Yes
```

### 2. Login Records Export
```csv
ID,User ID,Username,Timestamp,IP Address,User Agent,Location,Device,Status,Risk Level,Session Duration,Logout Time,Notes
1,1,admin,2024-01-15T10:30:00.000Z,192.168.1.100,Mozilla/5.0...,Office,Desktop,success,low,3600,2024-01-15T11:30:00.000Z,
```

### 3. User Activities Export
```csv
ID,User ID,Username,Action,Timestamp,Resource,IP Address,Device,Risk Level,Details
1,1,admin,login,2024-01-15T10:30:00.000Z,/dashboard,192.168.1.100,Desktop,low,Successful login
```

### 4. Security Analytics Export
```csv
Metric,Value,Description
Total Logins,150,Total number of login attempts
Successful Logins,145,Number of successful logins
Failed Logins,5,Number of failed login attempts
Success Rate,96.67%,Percentage of successful logins
```

## 🚀 Usage Guide

### For Administrators

1. **Access User Management:**
   - Login as admin user
   - Navigate to "Users" tab in AdminPanel
   - Use the comprehensive user management interface

2. **Add New Users:**
   - Click "Add User" button
   - Fill in user details (username, password, role, etc.)
   - Set security preferences (2FA, department)
   - Save to create new user

3. **Import Users from CSV:**
   - Click "Import CSV" button
   - Paste CSV data or upload file
   - Review import results
   - Users are automatically added to system

4. **Export Data:**
   - Navigate to "Reports" tab
   - Select report type (Users, Logins, Activities, Analytics)
   - Choose date range
   - Click "Export CSV" to download

### For Security Analysts

1. **Monitor Login Activity:**
   - View login records in real-time
   - Track failed login attempts
   - Monitor suspicious activity patterns

2. **Generate Security Reports:**
   - Export login records for analysis
   - Generate security analytics reports
   - Track user activity patterns

3. **Risk Assessment:**
   - View user security scores
   - Identify high-risk users
   - Monitor account lockouts

### For End Users

1. **Login Process:**
   - Enter username and password
   - System validates credentials against CSV data
   - Login attempts are logged automatically
   - Account locks after 5 failed attempts

2. **Password Security:**
   - Minimum 6 characters required
   - Failed attempts are tracked
   - Account suspension for security

## 🔧 Technical Implementation

### Data Storage
- **LocalStorage**: Primary data storage for demo purposes
- **CSV Format**: Standard CSV format for data portability
- **JSON Backup**: Automatic JSON backup of all data

### Security Features
- **Password Validation**: Client-side password requirements
- **Account Locking**: Automatic suspension mechanism
- **Session Tracking**: Complete login session monitoring
- **Risk Scoring**: Dynamic security score calculation

### Performance
- **Singleton Pattern**: Single CSV manager instance
- **Lazy Loading**: Data loaded on demand
- **Efficient Filtering**: Client-side search and filtering
- **Real-time Updates**: Live data synchronization

## 📈 Analytics & Reporting

### Security Metrics
- **Login Success Rate**: Percentage of successful logins
- **Failed Login Tracking**: Monitor suspicious activity
- **User Risk Distribution**: High/Medium/Low risk users
- **Session Analytics**: Login duration and patterns

### Risk Analysis
- **Security Score Calculation**: Based on user behavior
- **Risk Level Classification**: Automatic risk assessment
- **Threat Detection**: Identify potential security threats
- **Compliance Reporting**: Generate audit-ready reports

## 🔄 Data Migration

### Importing Existing Data
1. Prepare CSV file in required format
2. Use "Import CSV" functionality
3. Review import results and errors
4. Verify data integrity

### Exporting for Backup
1. Select appropriate report type
2. Choose "All Time" date range
3. Export CSV file
4. Store backup securely

## 🛠️ Customization

### Adding New User Fields
1. Update `User` interface in `csvManager.ts`
2. Modify CSV export/import functions
3. Update UserManagement component forms
4. Test data integrity

### Custom Report Types
1. Add new report type to `CSVExport.tsx`
2. Implement export function in `csvManager.ts`
3. Add UI components for report selection
4. Test export functionality

## 🔍 Troubleshooting

### Common Issues

1. **Import Errors:**
   - Check CSV format matches expected structure
   - Verify all required fields are present
   - Ensure no duplicate usernames

2. **Export Failures:**
   - Check browser download permissions
   - Verify sufficient data exists for export
   - Clear browser cache if needed

3. **Login Issues:**
   - Verify user exists in system
   - Check account is not locked
   - Confirm password is correct

### Data Recovery
- All data is stored in localStorage
- CSV exports provide backup capability
- Import functionality allows data restoration

## 📞 Support

For technical support or feature requests:
- Check the console for error messages
- Verify CSV format compliance
- Test with default user accounts
- Review browser compatibility

---

**Note**: This system is designed for demonstration purposes. In production environments, implement proper server-side authentication, database storage, and security measures. 