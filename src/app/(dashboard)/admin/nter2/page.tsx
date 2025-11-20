"use client";

import { Paper, Stack, Typography } from "@mui/material";
import { InterWorkspaceSection } from "@/components/dashboard/InterWorkspaceSection";
import { AdminPageLayout } from "../page";

export default function InterWorkspaceTwoPage() {
  return (
    <AdminPageLayout>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h3" fontWeight={700}>
              Inter2 workspace
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track the second workspace stream and prototype shared tooling before promoting updates to the main admin flow.
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </AdminPageLayout>
  );
}
