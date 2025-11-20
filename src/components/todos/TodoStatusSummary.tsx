"use client";

import { useMemo } from "react";
import { Box, Chip, CircularProgress, Grid, Paper, Stack, Typography } from "@mui/material";
import { TODO_STATUSES, type TodoDTO, type TodoStatus } from "@/types/todo";

const STATUS_LABELS: Record<TodoStatus, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed"
};

const STATUS_COLORS: Record<TodoStatus, "warning" | "info" | "success"> = {
  PENDING: "warning",
  IN_PROGRESS: "info",
  COMPLETED: "success"
};

const ZERO_COUNTS = TODO_STATUSES.reduce<Record<TodoStatus, number>>((acc, status) => {
  acc[status] = 0;
  return acc;
}, {} as Record<TodoStatus, number>);

type TodoStatusSummaryProps = {
  todos?: TodoDTO[];
  isLoading?: boolean;
};

type DateGroup = {
  key: string;
  label: string;
  sortValue: number;
  counts: Record<TodoStatus, number>;
  total: number;
};

const NO_DATE_LABEL = "No due date";
const NO_DATE_KEY = "no-date";
const NO_DATE_SORT_VALUE = Number.MAX_SAFE_INTEGER;

const formatDateLabel = (value?: string | null) => {
  if (!value) {
    return { key: NO_DATE_KEY, label: NO_DATE_LABEL, sortValue: NO_DATE_SORT_VALUE };
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { key: NO_DATE_KEY, label: NO_DATE_LABEL, sortValue: NO_DATE_SORT_VALUE };
  }

  const key = date.toISOString().split("T")[0];
  const formatter = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return { key, label: formatter.format(date), sortValue: date.setHours(0, 0, 0, 0) };
};

export function TodoStatusSummary({ todos, isLoading }: TodoStatusSummaryProps) {
  const statusCounts = useMemo(() => {
    const counts = { ...ZERO_COUNTS };
    (todos ?? []).forEach((todo) => {
      counts[todo.status] += 1;
    });
    return counts;
  }, [todos]);

  const groupedByDate = useMemo<DateGroup[]>(() => {
    const groups = new Map<string, DateGroup>();

    (todos ?? []).forEach((todo) => {
      const { key, label, sortValue } = formatDateLabel(todo.dueDate);
      const existing = groups.get(key);
      if (existing) {
        existing.counts[todo.status] += 1;
        existing.total += 1;
        return;
      }

      groups.set(key, {
        key,
        label,
        sortValue,
        counts: { ...ZERO_COUNTS, [todo.status]: 1 },
        total: 1
      });
    });

    return Array.from(groups.values()).sort((a, b) => a.sortValue - b.sortValue);
  }, [todos]);

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="overline">Overview</Typography>
        <Typography variant="h4" fontWeight={700}>
          Main status board
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review how many tasks sit in each status and which dates are the busiest.
        </Typography>
      </Stack>

      {isLoading && !todos?.length ? (
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={28} />
            <Typography variant="body2" color="text.secondary">
              Loading summary
            </Typography>
          </Stack>
        </Paper>
      ) : (
        <>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Grid container spacing={2}>
              {TODO_STATUSES.map((status) => (
                <Grid item xs={12} sm={4} key={status}>
                  <Stack
                    sx={{
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                      p: 2,
                      height: "100%"
                    }}
                    spacing={0.5}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {STATUS_LABELS[status]}
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {statusCounts[status]}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Stack spacing={2}>
              <Typography variant="subtitle1" fontWeight={600}>
                Dates by workload
              </Typography>
              {!groupedByDate.length ? (
                <Stack alignItems="center" spacing={1} py={4}>
                  <Typography variant="body2" color="text.secondary">
                    No todos captured yet. Add one to see the breakdown.
                  </Typography>
                </Stack>
              ) : (
                groupedByDate.map((group) => (
                  <Box
                    key={group.key}
                    sx={{
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                      p: 2
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      spacing={1.5}
                    >
                      <Stack spacing={0.5}>
                        <Typography fontWeight={600}>{group.label}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {group.total} {group.total === 1 ? "task" : "tasks"}
                        </Typography>
                      </Stack>
                      <Chip label={`${group.total} total`} color="default" size="small" />
                    </Stack>
                    <Stack direction="row" spacing={2} mt={2} flexWrap="wrap" useFlexGap>
                      {TODO_STATUSES.map((status) => (
                        <Stack
                          key={status}
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ minWidth: 120 }}
                        >
                          <Chip size="small" label={STATUS_LABELS[status]} color={STATUS_COLORS[status]} variant="outlined" />
                          <Typography variant="subtitle1" fontWeight={600}>
                            {group.counts[status] ?? 0}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                ))
              )}
            </Stack>
          </Paper>
        </>
      )}
    </Stack>
  );
}
