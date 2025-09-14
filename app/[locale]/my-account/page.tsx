'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  FlightTakeoff,
  Hotel,
  History,
  Settings,
  Edit,
  Save,
  Cancel,
  Logout,
  Star,
  CalendarToday,
  AttachMoney
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { pathWithLocale } from '@/lib/routes';
import { Locale } from '@/lib/i18n';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  registerTime: string;
}

interface MyAccountPageProps {
  params: { locale: Locale };
}

export default function MyAccountPage({ params }: MyAccountPageProps) {
  const { locale } = params;
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push(pathWithLocale(locale, '/login'));
    }
    setLoading(false);
  }, [locale, router]);

  const handleEditProfile = () => {
    setEditData(user);
    setEditDialogOpen(true);
  };

  const handleSaveProfile = () => {
    if (editData) {
      setUser(editData);
      localStorage.setItem('user', JSON.stringify(editData));
      setEditDialogOpen(false);
      setEditMode(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push(pathWithLocale(locale, '/'));
  };

  const handleInputChange = (field: keyof User, value: string) => {
    if (editData) {
      setEditData({ ...editData, [field]: value });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e3a8a', mb: 1 }}>
            My Account
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            Manage your profile and travel preferences
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Profile Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: 'fit-content' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 2,
                      backgroundColor: '#1e3a8a',
                      fontSize: '2rem'
                    }}
                  >
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                    {user.email}
                  </Typography>
                  <Chip
                    label="Premium Member"
                    color="primary"
                    size="small"
                    sx={{ mb: 2 }}
                  />
                </Box>

                <List sx={{ '& .MuiListItem-root': { px: 0 } }}>
                  <ListItem>
                    <ListItemIcon>
                      <Email sx={{ color: '#666' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={user.email}
                      primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: '0.85rem' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Phone sx={{ color: '#666' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Phone"
                      secondary={user.phone || 'Not provided'}
                      primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: '0.85rem' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday sx={{ color: '#666' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Member Since"
                      secondary={new Date(user.registerTime).toLocaleDateString()}
                      primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: '0.85rem' }}
                    />
                  </ListItem>
                </List>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={handleEditProfile}
                  sx={{ mt: 2 }}
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {/* Quick Stats */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ textAlign: 'center', p: 2 }}>
                      <FlightTakeoff sx={{ fontSize: 40, color: '#1e3a8a', mb: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        12
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Flights Booked
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ textAlign: 'center', p: 2 }}>
                      <Hotel sx={{ fontSize: 40, color: '#10b981', mb: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        8
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Hotels Booked
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ textAlign: 'center', p: 2 }}>
                      <AttachMoney sx={{ fontSize: 40, color: '#f59e0b', mb: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        $2,450
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Total Saved
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>

              {/* Recent Bookings */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Recent Bookings
                      </Typography>
                      <Button size="small" startIcon={<History />}>
                        View All
                      </Button>
                    </Box>
                    <List>
                      <ListItem sx={{ borderBottom: '1px solid #f0f0f0' }}>
                        <ListItemIcon>
                          <FlightTakeoff sx={{ color: '#1e3a8a' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="New York → Los Angeles"
                          secondary="Dec 15, 2024 • American Airlines"
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                        <Chip label="Confirmed" color="success" size="small" />
                      </ListItem>
                      <ListItem sx={{ borderBottom: '1px solid #f0f0f0' }}>
                        <ListItemIcon>
                          <Hotel sx={{ color: '#10b981' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Marriott Downtown LA"
                          secondary="Dec 15-18, 2024 • 3 nights"
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                        <Chip label="Confirmed" color="success" size="small" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <FlightTakeoff sx={{ color: '#1e3a8a' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Los Angeles → New York"
                          secondary="Dec 18, 2024 • Delta Airlines"
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                        <Chip label="Confirmed" color="success" size="small" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Preferences */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Travel Preferences
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            Preferred Airlines
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip label="American Airlines" size="small" />
                            <Chip label="Delta" size="small" />
                            <Chip label="United" size="small" />
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            Seat Preference
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            Window seat preferred
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Logout Button */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{ px: 4 }}
          >
            Logout
          </Button>
        </Box>

        {/* Edit Profile Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={editData?.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={editData?.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={editData?.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={editData?.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveProfile} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
