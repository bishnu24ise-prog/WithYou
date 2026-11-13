'use client';
import React, { useState, useEffect } from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import Typography from '@mui/material/Typography';
import { useLocale, useTranslations } from 'next-intl';

interface CustomTimelineProps {
  createdAt?: string;
  status?: string;
  closedAt?: string;
}

export default function CustomTimeline({
  createdAt,
  status = 'pending',
  closedAt,
}: CustomTimelineProps) {
  const t = useTranslations('timeline');
  const [mounted, setMounted] = useState(false);
  let locale = 'en-IN';
  try {
    locale = useLocale();
  } catch {}

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatTime = (d: Date) => {
    try {
      return new Intl.DateTimeFormat(locale, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(d);
    } catch {
      return d
        .toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
        .toLowerCase();
    }
  };

  // 1. Live time when user created the issue
  const createdDate =
    createdAt && !isNaN(new Date(createdAt).getTime())
      ? new Date(createdAt)
      : new Date();
  const createdTimeStr = mounted ? formatTime(createdDate) : t('liveTime');

  // 2. Live time when location visited (25 minutes after creation)
  const visitedDate = new Date(createdDate.getTime() + 25 * 60 * 1000);
  const visitedTimeStr = mounted ? formatTime(visitedDate) : t('inProgress');

  // 3. Issue completed time
  const isClosed = status === 'closed' || status === 'resolved';
  const completedDate =
    closedAt && !isNaN(new Date(closedAt).getTime())
      ? new Date(closedAt)
      : new Date(visitedDate.getTime() + 35 * 60 * 1000);
  const completedTimeStr = mounted
    ? isClosed
      ? formatTime(completedDate)
      : t('inProgress')
    : t('pending');

  return (
    <Timeline position="alternate">
      {/* Stage 1: User Created Issue */}
      <TimelineItem>
        <TimelineOppositeContent
          sx={{ m: 'auto 0' }}
          align="right"
          variant="body2"
          color="text.secondary"
        >
          {createdTimeStr}
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineConnector />
          <TimelineDot color="primary">
            <EventAvailableIcon />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ py: '12px', px: 2 }}>
          <Typography
            variant="body1"
            component="span"
            sx={{
              fontWeight: 'bold',
            }}
          >
            {t('createdTitle')}
          </Typography>
          <Typography variant="body2">
            {t('createdDesc')}
          </Typography>
        </TimelineContent>
      </TimelineItem>

      {/* Stage 2: Visited the Location */}
      <TimelineItem>
        <TimelineOppositeContent
          sx={{ m: 'auto 0' }}
          variant="body2"
          color="text.secondary"
        >
          {visitedTimeStr}
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineConnector />
          <TimelineDot color="secondary">
            <LocationOnIcon />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ py: '12px', px: 2 }}>
          <Typography
            variant="body1"
            component="span"
            sx={{
              fontWeight: 'bold',
            }}
          >
            {t('visitedTitle')}
          </Typography>
          <Typography variant="body2">
            {t('visitedDesc')}
          </Typography>
        </TimelineContent>
      </TimelineItem>

      {/* Stage 3: Issue Completed */}
      <TimelineItem>
        <TimelineOppositeContent
          sx={{ m: 'auto 0' }}
          align="right"
          variant="body2"
          color={isClosed ? 'success.main' : 'text.secondary'}
        >
          {completedTimeStr}
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineConnector />
          <TimelineDot color={isClosed ? 'success' : 'grey'}>
            {isClosed ? <CheckCircleIcon /> : <HourglassEmptyIcon />}
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ py: '12px', px: 2 }}>
          <Typography
            variant="body1"
            component="span"
            sx={{
              fontWeight: 'bold',
              color: isClosed ? 'success.dark' : 'inherit',
            }}
          >
            {isClosed ? t('completedTitle') : t('pendingTitle')}
          </Typography>
          <Typography variant="body2">
            {isClosed
              ? t('completedDesc')
              : t('pendingDesc')}
          </Typography>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
