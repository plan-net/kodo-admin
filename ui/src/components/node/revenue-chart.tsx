import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js'
import { Card } from "@/components/ui/card"

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface NodeRevenueChartProps {
  data: {
    monthly: Array<{
      month: string
      value: number
      growth: number
    }>
  }
}

export function NodeRevenueChart({ data }: NodeRevenueChartProps) {
  if (!data?.monthly) return null

  const chartData = {
    labels: data.monthly.map(item => {
      const date = new Date(item.month)
      return date.toLocaleString('default', { month: 'short' })
    }),
    datasets: [
      {
        label: 'Revenue',
        data: data.monthly.map(item => item.value),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.4,
      }
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#9CA3AF',
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#9CA3AF',
        }
      }
    },
  }

  return (
    <Line options={options} data={chartData} />
  )
} 