import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase-config";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toast } from "react-toastify";

const CustomLineChart = () => {
	const [lineChartData, setLineChartData] = useState([]);
	let val = 0;
	const [average, setAverage] = useState(0);
	const navigate = useNavigate();

  const calculateAverage = (data) => {
    data.forEach((item, index) => {
      if (data.length !== index + 1) {
        val += item.nrw;
        setAverage(val);
      }
    });
    setAverage(val / data.length);
  };

	useEffect(() => {
		const analysisCollection = collection(db, 'analysis');
		onSnapshot(analysisCollection, (snap) => {
			snap.docs.forEach((doc) => {
				const { data } = doc.data();
				calculateAverage(data);
				setLineChartData(data);
			});
		});

		//eslint-disable-next-line
	}, []);

	const handleClick = () => {
		navigate('/monthly-analysis');
	}

	if (
		lineChartData.length &&
		parseInt(lineChartData[lineChartData.length - 1].nrw) > average
	) {
		toast.error('NRW water usage has surpassed 20% threshold limit from the current average for the current month. Please click for more info.', {
			position: 'top-center',
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			onClick: handleClick
		});
	}

  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        {lineChartData && (
          <LineChart
            width={500}
            height={300}
            data={lineChartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(label) => `${label}%`} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="nrw"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </>
  );
};

export default CustomLineChart;
