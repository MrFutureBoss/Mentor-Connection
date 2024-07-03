import { Line } from "react-chartjs-2";
import MKBox from "components/MKBox";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useSelector } from "react-redux";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartLineUser = () => {
  const { usersByMonth } = useSelector((state) => state.user.pmtUser);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Thống kê số lượng người dùng trong 1 năm",
      },
    },
    animations: {
      tension: {
        duration: 1000,
        easing: "linear",
        from: 1,
        to: 0.5,
        loop: true,
      },
    },
    scales: {
      y: {
        min: 0,
        max:
          usersByMonth &&
          Math.ceil((Math.max(...usersByMonth.map((obj) => obj.userCount)) * 1.5) / 10) * 10,
      },
    },
  };

  const labels = usersByMonth?.map((p) => p.month);

  const data = {
    labels,
    datasets: [
      {
        label: "Người dùng",
        data: usersByMonth?.map((p) => p.userCount),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
      },
    ],
  };
  return (
    <MKBox>
      <Line options={options} data={data} />
    </MKBox>
  );
};

export default ChartLineUser;
