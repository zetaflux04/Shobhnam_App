import PackageBookingScreen from '../../components/booking/PackageBookingScreen';
import { sunderFees, sunderServiceName } from '../../constants/sunderkand';

export default function SunderkandBooking() {
  return (
    <PackageBookingScreen
      serviceName={sunderServiceName}
      defaultPackageTitle={sunderServiceName}
      defaultPackagePrice={sunderFees.total}
      confirmationPath="/sunderkand/confirmation"
      cardGradient={['rgba(237,122,39,0.82)', 'rgba(237,122,39,0.4)']}
      cardImage={require('../../assets/service/card-2.png')}
    />
  );
}
