import PackageBookingScreen from '../../components/booking/PackageBookingScreen';
import { rudraFees, rudraServiceName } from '../../constants/rudra';

export default function RudraBooking() {
  return (
    <PackageBookingScreen
      serviceName={rudraServiceName}
      defaultPackageTitle={rudraServiceName}
      defaultPackagePrice={rudraFees.total}
      confirmationPath="/rudra/confirmation"
      cardGradient={['rgba(0,126,137,0.85)', 'rgba(0,126,137,0.4)']}
      cardImage={require('../../assets/service/card-5.png')}
    />
  );
}
