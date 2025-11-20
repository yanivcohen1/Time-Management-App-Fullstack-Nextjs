"use client";

import { Paper, Stack, Typography } from "@mui/material";

type InterWorkspacePanelProps = {
  title?: string;
  description?: string;
};

export function InterWorkspacePanel({
  title = "Inter workspace",
  description = "Centralize your teammate onboarding tasks and monitor their progress. This section is a placeholder for upcoming collaboration tooling."
}: InterWorkspacePanelProps) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Stack spacing={1}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Stack>
    </Paper>
  );
}
