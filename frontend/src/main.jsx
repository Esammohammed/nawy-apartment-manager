import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './routes/router';
 import './index.css'; // Assuming you have some global styles
ReactDOM.createRoot(document.getElementById('root')).render(
 
    <RouterProvider router={router} />
 
);
