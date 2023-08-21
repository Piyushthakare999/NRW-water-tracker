import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import mapboxgl from 'mapbox-gl';

// Components
import Auth from './Auth/Auth';
import Dashboard from './Dashboard/Dashboard';

import 'react-toastify/dist/ReactToastify.css';
import MonthlyLimit from './MonthlyLimit/MonthlyLimit';

mapboxgl.workerClass =
	// eslint-disable-next-line import/no-webpack-loader-syntax
	require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const App = () => {
	return (
		<div className='App'>
			<Routes>
				<Route path='/' element={<Auth />} />
				<Route path='/dashboard' element={<Dashboard />} />
				<Route path='/dashboard/:unitId' element={<Dashboard />} />
				<Route path='/monthly-analysis' element={<MonthlyLimit />} />
			</Routes>
			<ToastContainer />
		</div>
	);
};

export default App;
