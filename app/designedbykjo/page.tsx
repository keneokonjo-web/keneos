import CharacterSelect from '../_c/CharacterSelect';
import DHero from '../_c/DHero';
import Footer from '../_c/Footer';
import ProductView from '../_c/ProductView';
import YouthArchive from '../_c/YouthArchive';

export const metadata = { title: 'DesignedByKJO' };

export default function DesignedByKJO() {
  return (
    <div className="white">
      <DHero />
      <ProductView />
      <CharacterSelect />
      <YouthArchive />
      <Footer />
    </div>
  );
}
