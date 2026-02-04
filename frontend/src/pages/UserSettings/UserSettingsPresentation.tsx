import { Box, Button, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { getUserSettings, updateUserSettings } from '@api';

const UserSettingsPresentation: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uiLanguage, setUiLanguage] = useState('en');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserSettings();
      setUiLanguage(data.ui_language || 'en');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Could not load user settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateUserSettings({ ui_language: uiLanguage.trim() });
      setUiLanguage(updated.ui_language);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Could not save user settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        User Settings
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <TextField
        label="UI language"
        helperText="ISO language code (e.g. en, ro)"
        value={uiLanguage}
        onChange={(e) => setUiLanguage(e.target.value)}
        disabled={loading || saving}
        inputProps={{ 'data-testid': 'ui-language-input' }}
        sx={{ width: 360, maxWidth: '100%' }}
      />

      <Box mt={2}>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={loading || saving}
          data-testid="save-user-settings"
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default UserSettingsPresentation;
