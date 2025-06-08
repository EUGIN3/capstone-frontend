import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const admin = sessionStorage.getItem('IsAdmin') === 'true';

  return admin ? <Outlet /> : <Navigate to="/user" />;
};

export default AdminRoute;