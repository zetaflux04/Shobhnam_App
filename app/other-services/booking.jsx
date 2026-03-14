import PackageBookingScreen from '../../components/booking/PackageBookingScreen';
import { otherServices } from '../../constants/otherServices';

const DEFAULT_SERVICE = otherServices[0];

export default function OtherServicesBooking() {
  return (
    <PackageBookingScreen
      serviceName="Other services"
      defaultPackageTitle={DEFAULT_SERVICE?.title ?? 'Other services'}
      defaultPackagePrice={DEFAULT_SERVICE?.price ?? 11000}
      confirmationPath="/other-services/confirmation"
      cardGradient={['rgba(165,52,102,0.85)', 'rgba(165,52,102,0.4)']}
      cardImage={require('../../assets/service/card-6.png')}
    />
  );
}
