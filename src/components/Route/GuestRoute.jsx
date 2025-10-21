import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContextObject';

const GuestRoute = ({ children }) => {
  const { token } = useContext(AppContext);

  return !token ? children : <Navigate to="/" replace />;
};

export default GuestRoute;
