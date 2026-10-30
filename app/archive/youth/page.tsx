import Footer from '../../_c/Footer';
import YouthArchive from '../../_c/YouthArchive';

export const metadata = { title: 'Archive: youth archive', robots: { index: false, follow: false } };

export default function Youth() {
  return (
    <div className="white">
      <YouthArchive />
      <Footer />
    </div>
  );
}
