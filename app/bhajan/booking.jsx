import PackageBookingScreen from '../../components/booking/PackageBookingScreen';
import { bhajanFees, bhajanServiceName } from '../../constants/bhajan';

export default function BhajanBooking() {
  return (
    <PackageBookingScreen
      serviceName={bhajanServiceName}
      defaultPackageTitle={bhajanServiceName}
      defaultPackagePrice={bhajanFees.total}
      confirmationPath="/bhajan/confirmation"
      cardGradient={['rgba(51,153,117,0.85)', 'rgba(51,153,117,0.4)']}
      cardImage={require('../../assets/service/card-3.png')}
    />
  );
}
