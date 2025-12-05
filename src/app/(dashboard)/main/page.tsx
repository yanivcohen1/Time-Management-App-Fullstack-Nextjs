"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const hasToken = !!tokenStorage.getAccessToken();

  if (!isMounted) {
    return (
      <Stack alignItems="center" justifyContent="center" minHeight="70vh">
        <CircularProgress />
      </Stack>
    );
  }

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
      <Box sx={{ px: { xs: 2, md: 6 }, py: 1 }}>
        <TodoStatusSummary todos={summaryTodos} isLoading={isSummaryLoading} />
      </Box>
    </main>
  );
}
