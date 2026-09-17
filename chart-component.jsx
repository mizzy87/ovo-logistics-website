import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.98)',
        border: '1px solid rgba(15, 44, 89, 0.15)',
        borderRadius: '10px',
        padding: '12px 16px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
        fontSize: '13px',
        minWidth: '200px'
      }}>
        <div style={{ fontWeight: 700, color: '#0F2C59', marginBottom: '6px', fontSize: '14px' }}>
          {data.fullDate}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: '#4A5568' }}>Total Bookings:</span>
          <strong style={{ fontSize: '16px', color: '#0F2C59' }}>{data.bookings}</strong>
        </div>
        
        {data.bookings > 0 ? (
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '6px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {data.pending > 0 && (
              <span style={{ background: '#FEF3C7', color: '#92400E', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                {data.pending} Pending
              </span>
            )}
            {data.inTransit > 0 && (
              <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                {data.inTransit} Active
              </span>
            )}
            {data.delivered > 0 && (
              <span style={{ background: '#D1FAE5', color: '#065F46', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                {data.delivered} Delivered
              </span>
            )}
          </div>
        ) : (
          <div style={{ color: '#94A3B8', fontSize: '12px' }}>No bookings recorded</div>
        )}

        {data.packages && data.packages.length > 0 && (
          <div style={{ marginTop: '8px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '6px' }}>
            <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '4px' }}>Parcels:</span>
            {data.packages.slice(0, 3).map((p, idx) => (
              <div key={idx} style={{ fontSize: '11px', color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                • <strong>{p.id}</strong> ({p.pickup.split(',')[0]} ➔ {p.dropoff.split(',')[0]})
              </div>
            ))}
            {data.packages.length > 3 && (
              <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>
                +{data.packages.length - 3} more...
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  return null;
}

export function BookingsTrendChart({ bookings = [], onFilterDate }) {
  const [chartType, setChartType] = useState('area');
  const [selectedDayKey, setSelectedDayKey] = useState(null);

  // Compute 7 days trend data
  const { chartData, stats } = useMemo(() => {
    const days = [];
    const now = new Date();

    // Map bookings by date string (YYYY-MM-DD in local time)
    const bookingsByDate = {};
    bookings.forEach(b => {
      if (!b.createdAt) return;
      const d = new Date(b.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!bookingsByDate[key]) {
        bookingsByDate[key] = [];
      }
      bookingsByDate[key].push(b);
    });

    let total7Days = 0;
    let peakDay = { label: 'None', count: 0 };

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      
      const dayBookings = bookingsByDate[dateKey] || [];
      const count = dayBookings.length;
      total7Days += count;

      const dayName = i === 0 ? 'Today' : (i === 1 ? 'Ystd' : d.toLocaleDateString('en-US', { weekday: 'short' }));
      const label = `${dayName} ${d.getDate()}`;
      const fullDate = d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

      if (count >= peakDay.count) {
        peakDay = { label: `${dayName} (${count})`, count };
      }

      const pending = dayBookings.filter(b => (b.status || '').toLowerCase() === 'pending').length;
      const delivered = dayBookings.filter(b => (b.status || '').toLowerCase() === 'delivered').length;
      const inTransit = dayBookings.filter(b => ['in transit', 'picked up'].includes((b.status || '').toLowerCase())).length;

      days.push({
        dateKey,
        label,
        fullDate,
        bookings: count,
        pending,
        inTransit,
        delivered,
        packages: dayBookings
      });
    }

    const avgDaily = (total7Days / 7).toFixed(1);

    return {
      chartData: days,
      stats: {
        total7Days,
        avgDaily,
        peakDay: peakDay.count > 0 ? peakDay.label : 'None',
        todayCount: days[days.length - 1]?.bookings || 0
      }
    };
  }, [bookings]);

  const handlePointClick = (data) => {
    if (!data) return;
    const clickedKey = data.dateKey || (data.activePayload && data.activePayload[0]?.payload?.dateKey);
    if (!clickedKey) return;

    if (selectedDayKey === clickedKey) {
      setSelectedDayKey(null);
      if (onFilterDate) onFilterDate(null);
    } else {
      setSelectedDayKey(clickedKey);
      if (onFilterDate) onFilterDate(clickedKey);
    }
  };

  return (
    <div style={{
      background: 'rgba(248, 249, 250, 0.95)',
      borderRadius: '12px',
      padding: '1.25rem 1.5rem',
      marginBottom: '1.5rem',
      border: '1px solid rgba(15, 44, 89, 0.12)',
      boxShadow: '0 4px 15px rgba(15, 44, 89, 0.04)'
    }}>
      {/* Chart Top Header & Summary Stats */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1rem',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        paddingBottom: '0.85rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>📈</span>
            <h4 style={{
              margin: 0,
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#0F2C59',
              letterSpacing: '-0.01em'
            }}>
              Weekly Booking Trend (Recharts)
            </h4>
            <span style={{
              background: '#E2E8F0',
              color: '#334155',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '12px'
            }}>
              Last 7 Days
            </span>
          </div>
          <p style={{ margin: '3px 0 0 0', fontSize: '0.82rem', color: '#64748B' }}>
            Daily shipment order volume logged across Lagos & interstate routes
          </p>
        </div>

        {/* Quick metrics pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{
            background: '#FFFFFF',
            padding: '4px 10px',
            borderRadius: '8px',
            border: '1px solid rgba(15, 44, 89, 0.1)',
            fontSize: '0.8rem'
          }}>
            <span style={{ color: '#64748B' }}>7-Day Total: </span>
            <strong style={{ color: '#0F2C59', fontSize: '0.9rem' }}>{stats.total7Days}</strong>
          </div>

          <div style={{
            background: '#FFFFFF',
            padding: '4px 10px',
            borderRadius: '8px',
            border: '1px solid rgba(15, 44, 89, 0.1)',
            fontSize: '0.8rem'
          }}>
            <span style={{ color: '#64748B' }}>Daily Avg: </span>
            <strong style={{ color: '#0F2C59', fontSize: '0.9rem' }}>{stats.avgDaily}</strong>
          </div>

          <div style={{
            background: '#FFFFFF',
            padding: '4px 10px',
            borderRadius: '8px',
            border: '1px solid rgba(15, 44, 89, 0.1)',
            fontSize: '0.8rem'
          }}>
            <span style={{ color: '#64748B' }}>Peak: </span>
            <strong style={{ color: '#2563EB', fontSize: '0.9rem' }}>{stats.peakDay}</strong>
          </div>

          {/* Chart Type Toggle Button Group */}
          <div style={{
            display: 'inline-flex',
            borderRadius: '8px',
            background: '#E2E8F0',
            padding: '2px',
            marginLeft: '4px'
          }}>
            <button
              type="button"
              onClick={() => setChartType('area')}
              style={{
                background: chartType === 'area' ? '#0F2C59' : 'transparent',
                color: chartType === 'area' ? '#FFFFFF' : '#475569',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              🌊 Trend Curve
            </button>
            <button
              type="button"
              onClick={() => setChartType('bar')}
              style={{
                background: chartType === 'bar' ? '#0F2C59' : 'transparent',
                color: chartType === 'bar' ? '#FFFFFF' : '#475569',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              📊 Daily Bars
            </button>
          </div>
        </div>
      </div>

      {/* Recharts Visualizer Canvas */}
      <div style={{ width: '100%', height: 210 }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart
              data={chartData}
              onClick={handlePointClick}
              margin={{ top: 10, right: 15, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="ovoBookingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#25D366" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0F2C59" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(15, 44, 89, 0.07)" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: 'rgba(15, 44, 89, 0.15)' }}
                tick={{ fill: '#4A5568', fontSize: 11, fontWeight: 600 }}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748B', fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#0F2C59"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#ovoBookingGrad)"
                dot={{ r: 4, fill: '#25D366', stroke: '#0F2C59', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#25D366', stroke: '#FFFFFF', strokeWidth: 3 }}
                name="Daily Bookings"
              />
            </AreaChart>
          ) : (
            <BarChart
              data={chartData}
              onClick={handlePointClick}
              margin={{ top: 10, right: 15, left: -25, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(15, 44, 89, 0.07)" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: 'rgba(15, 44, 89, 0.15)' }}
                tick={{ fill: '#4A5568', fontSize: 11, fontWeight: 600 }}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748B', fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="bookings"
                fill="#0F2C59"
                radius={[6, 6, 0, 0]}
                name="Daily Bookings"
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Interactive Filter Status Bar */}
      <div style={{
        marginTop: '0.65rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.8rem',
        color: '#64748B'
      }}>
        <span>
          💡 <em>Hover over data points to inspect package details.</em>
        </span>
        {selectedDayKey && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#0F2C59', fontWeight: 600 }}>
              Filtered to: <strong>{selectedDayKey}</strong>
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedDayKey(null);
                if (onFilterDate) onFilterDate(null);
              }}
              style={{
                background: '#FEE2E2',
                color: '#DC2626',
                border: 'none',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ✕ Clear Day Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Global browser mount helper
window.renderBookingsTrendChart = function(containerId, bookings = [], onFilterDate) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!container._reactRoot) {
    container._reactRoot = createRoot(container);
  }

  container._reactRoot.render(
    <BookingsTrendChart bookings={bookings} onFilterDate={onFilterDate} />
  );
};
