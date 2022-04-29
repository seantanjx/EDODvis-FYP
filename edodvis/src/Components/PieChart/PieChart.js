import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

export default function PieChart(props) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 20 },
      },
      maintainAspectRatio: true,
    },
  };
  return (
    <Card sx={{ border: 0, boxShadow: 0 }}>
      <CardContent>
        <Pie
          options={options}
          width={230}
          height={230}
          data={{
            labels: props.labels,
            datasets: [
              {
                label: "Dataset 1",
                data: props.data,
                borderColor: "#FFFFFF",
                backgroundColor: ["#1F9E8A", "#FBA018", "#ED5B5B", "#B6B6B6"],
              },
            ],
          }}
        />
      </CardContent>
    </Card>
  );
}
