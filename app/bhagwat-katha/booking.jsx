import PackageBookingScreen from '../../components/booking/PackageBookingScreen';
import { bhagwatFees, bhagwatServiceName } from '../../constants/bhagwat';

export default function BhagwatBooking() {
  return (
    <PackageBookingScreen
      serviceName={bhagwatServiceName}
      defaultPackageTitle={bhagwatServiceName}
      defaultPackagePrice={bhagwatFees.total}
      confirmationPath="/bhagwat-katha/confirmation"
      cardGradient={['rgba(69,119,170,0.85)', 'rgba(69,119,170,0.4)']}
      cardImage={require('../../assets/service/card-4.png')}
    />
  );
}
