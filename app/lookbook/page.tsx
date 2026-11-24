import Footer from '../_c/Footer';
import Personal from '../_c/Personal';

export const metadata = { title: 'Lookbook' };

export default function Lookbook() {
  return (
    <div className="white">
      <Personal />
      <Footer />
    </div>
  );
}
