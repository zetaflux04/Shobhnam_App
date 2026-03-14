import PackageBookingScreen from '../../components/booking/PackageBookingScreen';
import { ramleelaFees, ramleelaServiceName } from '../../constants/ramleela';

export default function RamleelaBooking() {
  return (
    <PackageBookingScreen
      serviceName={ramleelaServiceName}
      defaultPackageTitle={ramleelaServiceName}
      defaultPackagePrice={ramleelaFees.total}
      confirmationPath="/ramleela/confirmation"
      cardGradient={['rgba(255,167,38,0.85)', 'rgba(255,167,38,0.4)']}
      cardImage={require('../../assets/service/card-1.png')}
    />
  );
}
