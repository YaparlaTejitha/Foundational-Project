function Settings() {
  return (
    <div className="dashboard-page settings-page">

      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account and application preferences.</p>
        </div>
      </div>

      {/* Admin Profile */}
      <div className="dashboard-box settings-section">
        <div className="box-header">
          <div>
            <h2>Admin Profile</h2>
            <p>Administrator account information.</p>
          </div>
        </div>

        <div className="settings-profile">
          <div className="settings-avatar">A</div>
          <div>
            <h3>Admin</h3>
            <p>Administrator</p>
          </div>
        </div>

        <div className="settings-field">
          <label>Full Name</label>
          <input type="text" defaultValue="Admin" />
        </div>

        <div className="settings-field">
          <label>Email Address</label>
          <input type="email" defaultValue="admin@aegisai.com" />
        </div>
      </div>

      {/* Notification Settings */}
      <div className="dashboard-box settings-section">
        <div className="box-header">
          <div>
            <h2>Notification Preferences</h2>
            <p>Choose which notifications you want to receive.</p>
          </div>
        </div>

        <div className="settings-option">
          <div>
            <h3>Fraud Alerts</h3>
            <p>Receive notifications when suspicious activity is detected.</p>
          </div>
          <input type="checkbox" defaultChecked />
        </div>

        <div className="settings-option">
          <div>
            <h3>High Risk Transactions</h3>
            <p>Receive alerts for high-risk transactions.</p>
          </div>
          <input type="checkbox" defaultChecked />
        </div>

        <div className="settings-option">
          <div>
            <h3>Investigation Updates</h3>
            <p>Receive updates when investigation statuses change.</p>
          </div>
          <input type="checkbox" defaultChecked />
        </div>
      </div>

      {/* Security Settings */}
      <div className="dashboard-box settings-section">
        <div className="box-header">
          <div>
            <h2>Security Settings</h2>
            <p>Manage account security preferences.</p>
          </div>
        </div>

        <div className="settings-option">
          <div>
            <h3>Two-Factor Authentication</h3>
            <p>Additional verification for account access.</p>
          </div>
          <span className="settings-status">Not Configured</span>
        </div>

        <div className="settings-option">
          <div>
            <h3>Login Alerts</h3>
            <p>Get notified about new account login activity.</p>
          </div>
          <input type="checkbox" defaultChecked />
        </div>
      </div>

      {/* System Preferences */}
      <div className="dashboard-box settings-section">
        <div className="box-header">
          <div>
            <h2>System Preferences</h2>
            <p>Application display preferences.</p>
          </div>
        </div>

        <div className="settings-field">
          <label>Language</label>
          <select defaultValue="English">
            <option>English</option>
            <option>Hindi</option>
            <option>Kannada</option>
          </select>
        </div>

        <div className="settings-field">
          <label>Time Zone</label>
          <select defaultValue="Asia/Kolkata">
            <option value="Asia/Kolkata">India Standard Time</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
      </div>

    </div>
  );
}

export default Settings;
