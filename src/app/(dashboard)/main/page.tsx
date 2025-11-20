"use client";

import { useMemo } from "react";
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { TodoStatusSummary } from "@/components/todos/TodoStatusSummary";
import { useSession } from "@/hooks/useAuth";
import { useTodos } from "@/hooks/useTodos";
import { tokenStorage } from "@/lib/http/token-storage";
import type { TodoFilterInput } from "@/lib/validation/todo";

export default function MainPage() {
  const { data: session, isLoading: sessionLoading, isError: sessionError } = useSession();
  const unfilteredKey = useMemo<Partial<TodoFilterInput>>(() => ({}), []);
  const { data: summaryData, isLoading: summaryLoading } = useTodos(unfilteredKey);

  const hasToken = !!tokenStorage.getAccessToken();

  if ((!hasToken || sessionError) && !sessionLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" minHeight="70vh" spacing={2}>
        <Typography variant="h5">Please sign in to review the main status board.</Typography>
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

  const summaryTodos = summaryData?.todos;
  const isSummaryLoading = summaryLoading && !summaryTodos?.length;

  return (
    <main>
      <Box sx={{ px: { xs: 2, md: 6 }, py: 6 }}>
        <Stack spacing={1} mb={4}>
          <Typography variant="h2" fontWeight={700}>
            Main status board
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Stay ahead of your workload with counts per status and due date.
          </Typography>
        </Stack>
        <TodoStatusSummary todos={summaryTodos} isLoading={isSummaryLoading} />
      </Box>
    </main>
  );
}
