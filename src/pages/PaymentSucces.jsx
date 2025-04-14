import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = "Yulita Cakes - Pembayaran";
  }, []);

  useEffect(() => {
    if (!location.state || !location.state.paymentSuccess) {
      navigate('/', { replace: true });
    }
  }, [location, navigate]);

  const handleGoToOrders = () => {
    navigate('/dashboard/orders');
  };

  const handleContinueShopping = () => {
    navigate('/collection');
  };

  return (
    <div className="flex flex-col sm:gap-10 pt-10 mt-16 border-t">
      <h1 className="text-3xl font-bold mb-6 text-center">Pembayaran Berhasil!</h1>
      <p className="text-lg mb-8 text-center">
        Terima kasih telah melakukan pembelian. Pesanan kamu sedang diproses.
      </p>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={handleGoToOrders}
          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Lihat Pesanan
        </button>
        <button
          onClick={handleContinueShopping}
          className="border border-blue-600 text-blue-600 py-2 px-6 rounded-md hover:bg-blue-600 hover:text-white transition duration-300"
        >
          Belanja Lagi
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
