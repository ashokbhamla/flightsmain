'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Switch,
  FormControlLabel,
  Alert,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

interface Settings {
  flightPopupEnabled: boolean;
  bookingPopupEnabled: boolean;
  overlayEnabled: boolean;
  phoneNumber: string;
  leadPageEnabled: boolean;
}

const defaultSettings: Settings = {
  flightPopupEnabled: true,
  bookingPopupEnabled: true,
  overlayEnabled: true,
  phoneNumber: '(888) 351-1711',
  leadPageEnabled: false,
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [saveMessage, setSaveMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSettings();
    }
  }, [isAuthenticated]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setSettings({ ...defaultSettings, ...data });
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setUsername('');
        setPassword('');
      } else {
        setLoginError('Invalid username or password');
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
      setIsAuthenticated(false);
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSaveSettings = async () => {
    setSaveMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSaveMessage('Settings saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('Failed to save settings');
      }
    } catch (error) {
      setSaveMessage('Error saving settings');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'center' }}>
            <LockIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" component="h1">
              Admin Login
            </Typography>
          </Box>

          {loginError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {loginError}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              autoComplete="username"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ mt: 3 }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SettingsIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" component="h1">
            Popup Settings
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      {saveMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {saveMessage}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Popup Controls
        </Typography>

        <Card sx={{ mb: 3, backgroundColor: '#f5f5f5' }}>
          <CardContent>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.leadPageEnabled}
                  onChange={(e) =>
                    setSettings({ ...settings, leadPageEnabled: e.target.checked })
                  }
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Lead Capture Homepage
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Replaces the standard homepage with the high-converting lead page
                  </Typography>
                </Box>
              }
            />
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, backgroundColor: '#f5f5f5' }}>
          <CardContent>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.flightPopupEnabled}
                  onChange={(e) =>
                    setSettings({ ...settings, flightPopupEnabled: e.target.checked })
                  }
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Flight Popup (Auto-popup)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Shows flight deals popup automatically after 2 seconds
                  </Typography>
                </Box>
              }
            />
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, backgroundColor: '#f5f5f5' }}>
          <CardContent>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.bookingPopupEnabled}
                  onChange={(e) =>
                    setSettings({ ...settings, bookingPopupEnabled: e.target.checked })
                  }
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Booking Popup
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Shows when user clicks on flight results (collects contact info)
                  </Typography>
                </Box>
              }
            />
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, backgroundColor: '#f5f5f5' }}>
          <CardContent>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.overlayEnabled}
                  onChange={(e) =>
                    setSettings({ ...settings, overlayEnabled: e.target.checked })
                  }
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Clickable Overlay
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Transparent overlay that opens booking popup when clicked
                  </Typography>
                </Box>
              }
            />
          </CardContent>
        </Card>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Contact Settings
        </Typography>

        <TextField
          fullWidth
          label="Phone Number"
          value={settings.phoneNumber}
          onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
          helperText="Phone number displayed in booking popup"
          margin="normal"
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleSaveSettings}
          disabled={isLoading}
          sx={{ mt: 3 }}
        >
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>

        <Box sx={{ mt: 3, p: 2, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            💡 Quick Info:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Turn off popups during testing or maintenance
            <br />
            • Update phone number as needed
            <br />
            • Changes take effect immediately on the search page
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
