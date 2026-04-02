'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { apiPost, useApi } from '@/lib/useApi';

interface AdminDash {
  stats: {
    pending_verifications: number;
    flagged_prices: number;
    active_merchants: number;
    active_farmers: number;
  };
  recent_activity: { id: number; action: string; details: string; created_at: string }[];
  active_emergencies: { id: number; title: string; risk_level: string; region?: { name_mm: string } }[];
}

interface MlSourceSummary {
  historical_market_rows?: number;
  live_portal_rows?: number;
  weather_rows?: number;
  training_rows?: number;
}

interface MlStatus {
  status: string;
  artifact_ready: boolean;
  loading: boolean;
  training?: boolean;
  training_error?: string | null;
  last_retrained_at?: string | null;
  last_training_mode?: string | null;
  source_summary?: MlSourceSummary | null;
}

function formatCount(value?: number) {
  return typeof value === 'number' ? value.toLocaleString() : '0';
}

function formatDate(value?: string | null) {
  if (!value) return 'Not yet';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminHomePage() {
  const { data, loading } = useApi<AdminDash>('/api/dashboard/admin');
  const {
    data: mlStatus,
    loading: mlLoading,
    error: mlError,
    refetch: refetchMlStatus,
  } = useApi<MlStatus>('/api/ml/status');

  const [retrainMode, setRetrainMode] = useState<'approved' | 'demo' | null>(null);
  const [retrainMessage, setRetrainMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!mlStatus?.loading && !mlStatus?.training) return;

    const timer = window.setInterval(() => {
      refetchMlStatus();
    }, 5000);

    return () => window.clearInterval(timer);
  }, [mlStatus?.loading, mlStatus?.training, refetchMlStatus]);

  const stats = data?.stats;
  const sourceSummary = mlStatus?.source_summary;
  const mlBadge = useMemo(() => {
    if (mlLoading) return { label: 'Loading', tone: 'pending' };
    if (mlStatus?.training) return { label: 'Training', tone: 'peer' };
    if (mlStatus?.loading) return { label: 'Warming up', tone: 'pending' };
    if (mlStatus?.artifact_ready) return { label: 'Ready', tone: 'verified' };
    if (mlError || mlStatus?.training_error) return { label: 'Issue', tone: 'flagged' };
    return { label: 'Unknown', tone: 'pending' };
  }, [mlError, mlLoading, mlStatus]);

  async function startRetrain(includePendingDemo: boolean) {
    setRetrainMode(includePendingDemo ? 'demo' : 'approved');
    setRetrainMessage(null);

    const { data: response, error } = await apiPost<{ message?: string; already_running?: boolean }>(
      '/api/ml/retrain',
      { include_pending_demo: includePendingDemo },
    );

    if (error) {
      setRetrainMessage(`Retrain failed: ${error}`);
      setRetrainMode(null);
      return;
    }

    setRetrainMessage(
      response?.already_running
        ? response.message || 'A training job is already running.'
        : response?.message || 'Retraining started in the background.',
    );

    setRetrainMode(null);
    refetchMlStatus();
  }

  return (
    <div className="tab-panel">
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="page-subtitle">Review platform activity, emergencies, and AI retraining in one place.</p>

      {data?.active_emergencies?.map((emergency) => (
        <div key={emergency.id} className="alert-banner danger mb-lg">
          <div>
            <strong>Emergency:</strong> {emergency.title}
            {emergency.region?.name_mm ? ` - ${emergency.region.name_mm}` : ''}
          </div>
        </div>
      ))}

      <div className="grid-4 mb-lg">
        {loading ? (
          [1, 2, 3, 4].map((item) => (
            <div key={item} className="stat-card">
              <div className="stat-label">Loading</div>
              <div className="stat-value" style={{ opacity: 0.3 }}>
                ...
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="stat-card">
              <div className="stat-label">Pending Verifications</div>
              <div className="stat-value">{stats?.pending_verifications || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Flagged Prices</div>
              <div className="stat-value">{stats?.flagged_prices || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Active Merchants</div>
              <div className="stat-value">{stats?.active_merchants || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Active Farmers</div>
              <div className="stat-value">{stats?.active_farmers || 0}</div>
            </div>
          </>
        )}
      </div>

      <div className="grid-2 mb-lg">
        <div className="card">
          <div className="card-title mb-md">Quick Actions</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Link href="/admin/verify" className="btn btn-primary">
              Review Prices
            </Link>
            <Link href="/admin/users" className="btn btn-primary">
              Manage Users
            </Link>
            <Link href="/admin/emergency" className="btn btn-danger">
              Emergencies
            </Link>
            <Link href="/admin/settings" className="btn btn-primary">
              Settings
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-title mb-md">Recent Activity</div>
          <div style={{ fontSize: 'var(--font-sm)' }}>
            {data?.recent_activity?.length ? (
              data.recent_activity.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  style={{
                    padding: '6px 0',
                    borderBottom: '1px solid var(--gray-100)',
                  }}
                >
                  {activity.details || activity.action}
                  <span style={{ color: 'var(--gray-400)', marginLeft: 8 }}>
                    {new Date(activity.created_at).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--gray-400)' }}>No recent activity yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: 'var(--space-md)',
          }}
        >
          <div>
            <div className="card-title">ML Training Control</div>
            <div style={{ color: 'var(--gray-500)', fontSize: 'var(--font-sm)', marginTop: 4 }}>
              Check current model health and trigger retraining with approved or demo portal prices.
            </div>
          </div>
          <span className={`verify-badge ${mlBadge.tone}`}>{mlBadge.label}</span>
        </div>

        {(mlError || mlStatus?.training_error) && (
          <div className="alert-banner danger mb-md">
            <div>{mlStatus?.training_error || mlError}</div>
          </div>
        )}

        {retrainMessage && (
          <div className="alert-banner success mb-md">
            <div>{retrainMessage}</div>
          </div>
        )}

        <div className="grid-4 mb-md">
          <div className="stat-card">
            <div className="stat-label">Artifact</div>
            <div className="stat-value" style={{ fontSize: '1.25rem' }}>
              {mlStatus?.artifact_ready ? 'Ready' : 'Not Ready'}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Training State</div>
            <div className="stat-value" style={{ fontSize: '1.25rem' }}>
              {mlStatus?.training ? 'Running' : mlStatus?.loading ? 'Loading' : 'Idle'}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Last Retrained</div>
            <div className="stat-value" style={{ fontSize: '1rem' }}>
              {formatDate(mlStatus?.last_retrained_at)}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Training Mode</div>
            <div className="stat-value" style={{ fontSize: '1rem' }}>
              {mlStatus?.last_training_mode || 'Not set'}
            </div>
          </div>
        </div>

        <div className="grid-4 mb-md">
          <div className="stat-card">
            <div className="stat-label">Historical Rows</div>
            <div className="stat-value">{formatCount(sourceSummary?.historical_market_rows)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Live Portal Rows</div>
            <div className="stat-value">{formatCount(sourceSummary?.live_portal_rows)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Weather Rows</div>
            <div className="stat-value">{formatCount(sourceSummary?.weather_rows)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Training Rows</div>
            <div className="stat-value">{formatCount(sourceSummary?.training_rows)}</div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <button
            className="btn btn-primary"
            onClick={() => startRetrain(false)}
            disabled={mlStatus?.training || retrainMode !== null}
          >
            {retrainMode === 'approved' ? 'Starting approved retrain...' : 'Retrain with approved prices'}
          </button>
          <button
            className="btn btn-outline"
            onClick={() => startRetrain(true)}
            disabled={mlStatus?.training || retrainMode !== null}
          >
            {retrainMode === 'demo' ? 'Starting demo retrain...' : 'Demo retrain with pending prices'}
          </button>
          <button className="btn btn-outline" onClick={() => refetchMlStatus()} disabled={mlLoading}>
            Refresh status
          </button>
        </div>

        <div
          style={{
            marginTop: 'var(--space-md)',
            padding: '12px 14px',
            borderRadius: '12px',
            background: 'var(--gray-50)',
            border: '1px solid var(--gray-200)',
            color: 'var(--gray-600)',
            fontSize: 'var(--font-sm)',
          }}
        >
          Use the approved retrain button for production data only. Use the demo retrain button only while
          merchant submissions are still pending and you need to test the end-to-end flow.
        </div>
      </div>
    </div>
  );
}
