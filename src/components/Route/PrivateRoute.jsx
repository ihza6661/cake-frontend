import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const PrivateRoute = ({ children }) => {
    const { token } = useContext(AppContext);

    return token ? children : <Navigate to="/masuk" />;
};

export default PrivateRoute;
