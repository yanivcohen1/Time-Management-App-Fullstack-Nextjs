"use client";

import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { InterWorkspacePanel } from "@/components/dashboard/InterWorkspacePanel";
import { useSession } from "@/hooks/useAuth";
import { tokenStorage } from "@/lib/http/token-storage";

export default function InterWorkspacePage() {
  const { data: session, isLoading: sessionLoading, isError: sessionError } = useSession();
  const hasToken = !!tokenStorage.getAccessToken();

  if ((!hasToken || sessionError) && !sessionLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" minHeight="70vh" spacing={2}>
        <Typography variant="h5">Please sign in to see the Inter workspace.</Typography>
        <Button href="/login" variant="contained">
          Go to login
        </Button>
      </Stack>
    );
  }

  if (sessionLoading || !session) {
    return (
      <Stack alignItems="center" justifyContent="center" minHeight="70vh">
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <main>
      <Box sx={{ px: { xs: 2, md: 6 }, py: 6 }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h3" fontWeight={700}>
              Inter workspace
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Drill directly into onboarding needs or embed collaboration widgets specific to this workspace.
            </Typography>
          </Stack>

          <InterWorkspacePanel />
        </Stack>
      </Box>
    </main>
  );
}
