import { createBrowserRouter } from 'react-router-dom';
import Root from '../layout/Root';
import ApartmentList from '../components/ApartmentList';
import ApartmentDetailsPage from '../components/ApartmentDetails';
import ApartmentForm from '../components/ApartmentForm'; // Import the new form component

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '/', element: <ApartmentList /> },
      { path: '/apartments/:id', element: <ApartmentDetailsPage /> },
      { path: '/apartments/new', element: <ApartmentForm /> }, // Add the new route
    ],
  },
]);

export default router;