import CharacterSelect from '../_c/CharacterSelect';
import DHero from '../_c/DHero';
import Footer from '../_c/Footer';
import YouthArchive from '../_c/YouthArchive';

export const metadata = { title: 'DesignedByKJO' };

export default function DesignedByKJO() {
  return (
    <div className="white">
      <DHero />
      <CharacterSelect />
      <YouthArchive />
      <Footer />
    </div>
  );
}
