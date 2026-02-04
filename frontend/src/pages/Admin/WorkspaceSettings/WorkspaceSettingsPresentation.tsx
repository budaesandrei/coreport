import { Box, Button, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { getWorkspaceSettings, updateWorkspaceSettings } from '@api';

const WorkspaceSettingsPresentation: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canonicalDataLanguage, setCanonicalDataLanguage] = useState('en');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWorkspaceSettings();
      setCanonicalDataLanguage(data.canonical_data_language || 'en');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Could not load workspace settings');
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
      const updated = await updateWorkspaceSettings({
        canonical_data_language: canonicalDataLanguage.trim(),
      });
      setCanonicalDataLanguage(updated.canonical_data_language);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Could not save workspace settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Workspace Settings
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <TextField
        label="Canonical data language"
        helperText="ISO language code (e.g. en, ro)"
        value={canonicalDataLanguage}
        onChange={(e) => setCanonicalDataLanguage(e.target.value)}
        disabled={loading || saving}
        inputProps={{ 'data-testid': 'canonical-data-language-input' }}
        sx={{ width: 360, maxWidth: '100%' }}
      />

      <Box mt={2}>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={loading || saving}
          data-testid="save-workspace-settings"
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default WorkspaceSettingsPresentation;
