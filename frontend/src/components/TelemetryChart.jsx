import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

const ChartContainer = styled.div`
  background: ${({ theme }) => theme.cardBg};
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`;

const ChartTitle = styled.h3`
  margin-top: 0;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 1rem;
`;

const TelemetryChart = ({ title, data, color, unit }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    if (chartRef.current && data.length > 0) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [{
            label: `${title} (${unit})`,
            data: data,
            borderColor: color,
            backgroundColor: `${color}40`, // More visible fill
            borderWidth: 2,
            pointRadius: 3, // Visible points
            pointBackgroundColor: color,
            tension: 0.1,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'minute',
                tooltipFormat: 'PPpp'
              },
              grid: {
                color: theme.chartGrid
              },
              ticks: {
                color: theme.text
              }
            },
            y: {
              grid: {
                color: theme.chartGrid
              },
              ticks: {
                color: theme.text
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: theme.text,
                font: {
                  weight: 'bold'
                },
                padding: 20,
                boxWidth: 40
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: theme.cardBg,
              titleColor: theme.primary,
              bodyColor: theme.text,
              borderColor: theme.primary,
              borderWidth: 1,
              padding: 12,
              callbacks: {
                label: (context) => {
                  return `${context.dataset.label}: ${context.parsed.y} ${unit}`;
                }
              }
            }
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, title, color, unit, theme]);

  return (
    <ChartContainer>
      <ChartTitle>{title}</ChartTitle>
      <div style={{ height: '300px' }}>
        <canvas ref={chartRef} />
      </div>
    </ChartContainer>
  );
};

export default TelemetryChart;