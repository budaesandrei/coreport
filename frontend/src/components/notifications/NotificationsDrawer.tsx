import React, { useMemo } from 'react';
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useNotifications } from '@context/NotificationsContext';

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString(undefined, { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default function NotificationsDrawer() {
  const { panelOpen, closePanel, notifications, loading, unreadCount, markRead, markAllRead } =
    useNotifications();

  const hasNotifications = notifications.length > 0;
  const hasUnread = unreadCount > 0;

  const title = useMemo(() => {
    if (!hasNotifications) return 'Notifications';
    return hasUnread ? `Notifications (${unreadCount} unread)` : 'Notifications';
  }, [hasNotifications, hasUnread, unreadCount]);

  return (
    <Drawer
      anchor="right"
      open={panelOpen}
      onClose={closePanel}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 420 },
          bgcolor: 'background.paper',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
          <Typography variant="h6" data-testid="notifications-title">
            {title}
          </Typography>
          <IconButton aria-label="Close notifications" onClick={closePanel}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Stack direction="row" gap={1} sx={{ mt: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<DoneAllIcon />}
            onClick={() => void markAllRead()}
            disabled={!hasUnread || !hasNotifications}
            aria-label="Mark all as read"
          >
            Mark all read
          </Button>
        </Stack>
      </Box>

      <Divider />

      <Box sx={{ p: 2, flex: 1 }}>
        {loading ? (
          <Typography variant="body2" color="text.secondary">
            Loading...
          </Typography>
        ) : !hasNotifications ? (
          <Box sx={{ py: 6, textAlign: 'center' }} data-testid="notifications-empty">
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              You’re all caught up
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              No notifications right now.
            </Typography>
          </Box>
        ) : (
          <List disablePadding data-testid="notifications-list">
            {notifications.map((n) => {
              const unread = !n.readAt;
              return (
                <React.Fragment key={n.id}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label={`Mark notification ${n.id} as read`}
                        onClick={() => void markRead(n.id)}
                        disabled={!unread}
                      >
                        <MarkEmailReadIcon />
                      </IconButton>
                    }
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: unread ? 'action.hover' : 'transparent',
                    }}
                  >
                    <ListItemText
                      primary={
                        <Stack direction="row" alignItems="baseline" gap={1}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: unread ? 700 : 500 }}
                            data-testid={unread ? 'notification-unread' : 'notification-read'}
                          >
                            {n.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(n.createdAt)}
                          </Typography>
                        </Stack>
                      }
                      secondary={
                        n.body ? (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {n.body}
                          </Typography>
                        ) : null
                      }
                    />
                  </ListItem>
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Box>
    </Drawer>
  );
}
