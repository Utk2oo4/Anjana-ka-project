import React, { useState } from 'react';

// 1. Accuracy Trend Area Chart (SVG based)
export const AccuracyTrendChart = ({ data, timeRange = '30d' }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const points = data || [];
  const width = 800;
  const height = 260;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const minVal = 0;
  const maxVal = 100;

  const getX = (index) => padding.left + (index / (points.length - 1 || 1)) * innerWidth;
  const getY = (value) => padding.top + innerHeight - ((value - minVal) / (maxVal - minVal)) * innerHeight;

  // Build SVG path
  let pathD = '';
  let areaD = '';

  if (points.length > 0) {
    pathD = `M ${getX(0)} ${getY(points[0].accuracy)}`;
    for (let i = 1; i < points.length; i++) {
      const xPrev = getX(i - 1);
      const yPrev = getY(points[i - 1].accuracy);
      const xCurr = getX(i);
      const yCurr = getY(points[i].accuracy);
      const cx = (xPrev + xCurr) / 2;
      pathD += ` C ${cx} ${yPrev}, ${cx} ${yCurr}, ${xCurr} ${yCurr}`;
    }

    areaD = `${pathD} L ${getX(points.length - 1)} ${padding.top + innerHeight} L ${getX(0)} ${padding.top + innerHeight} Z`;
  }

  return (
    <div className="w-full">
      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[500px]">
          <defs>
            <linearGradient id="lavenderGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B7EC8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8B7EC8" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines & Y axis labels */}
          {[0, 20, 40, 60, 80, 100].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#EFEBF5"
                  strokeDasharray={val === 0 ? '0' : '4 4'}
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[11px] fill-[#6E6A82] font-medium"
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaD} fill="url(#lavenderGradient)" />

          {/* Line Stroke */}
          <path
            d={pathD}
            fill="none"
            stroke="#8B7EC8"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((p, idx) => {
            if (idx % 5 === 0 || idx === points.length - 1) {
              const x = getX(idx);
              const y = getY(p.accuracy);
              return (
                <g key={idx}>
                  <circle
                    cx={x}
                    cy={y}
                    r={hoveredPoint === idx ? 6 : 4}
                    className="fill-white stroke-[#8B7EC8] stroke-2 cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredPoint(idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* X axis labels */}
                  <text
                    x={x}
                    y={height - 15}
                    textAnchor="middle"
                    className="text-[11px] fill-[#6E6A82] font-medium"
                  >
                    Day {p.day}
                  </text>
                </g>
              );
            }
            return null;
          })}
        </svg>

        {hoveredPoint !== null && points[hoveredPoint] && (
          <div className="absolute top-2 right-4 bg-[#2D2A3E] text-white text-xs px-3 py-1.5 rounded-lg shadow-lg">
            Day {points[hoveredPoint].day}: <span className="font-bold text-[#A8BBA0]">{points[hoveredPoint].accuracy}% Accuracy</span>
          </div>
        )}
      </div>
    </div>
  );
};

// 2. Games by Category Donut Chart
export const CategoryDonutChart = ({ data }) => {
  const items = data || [];
  const total = items.reduce((acc, curr) => acc + curr.count, 0) || 1;

  let cumulativeAngle = 0;

  const slices = items.map((item) => {
    const angle = (item.count / total) * 360;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;
    return {
      ...item,
      startAngle,
      angle,
    };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
      {/* SVG Donut */}
      <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {slices.map((slice, idx) => {
            const strokeDasharray = `${(slice.count / total) * 251.2} 251.2`;
            const strokeDashoffset = -((slice.startAngle / 360) * 251.2);
            return (
              <circle
                key={idx}
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke={slice.color}
                strokeWidth="18"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all hover:opacity-85"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-[#2D2A3E] font-display">{total}</span>
          <span className="text-[10px] text-[#6E6A82] uppercase tracking-wider font-semibold">Total Sessions</span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2.5 flex-1 w-full">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md shrink-0" style={{ backgroundColor: item.color }} />
              <span className="font-semibold text-[#2D2A3E]">{item.category}</span>
            </div>
            <div className="text-[#6E6A82] font-medium">
              {item.count} <span className="text-[11px] opacity-70">({Math.round((item.count / total) * 100)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 3. Daily Activity Bar Chart
export const DailyActivityBarChart = ({ data }) => {
  const items = data || [];
  const maxVal = Math.max(...items.map(i => i.games), 10);

  return (
    <div className="w-full">
      <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2">
        {items.map((item, idx) => {
          const heightPercent = (item.games / maxVal) * 100;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="text-[11px] font-bold text-[#4F6A45] opacity-0 group-hover:opacity-100 transition-opacity">
                {item.games}
              </div>
              <div className="w-full bg-[#A8BBA0]/20 rounded-t-xl overflow-hidden flex items-end h-36">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full bg-[#A8BBA0] rounded-t-xl group-hover:bg-[#8B7EC8] transition-all duration-300"
                />
              </div>
              <span className="text-xs font-semibold text-[#6E6A82]">{item.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
