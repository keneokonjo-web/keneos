import Footer from '../../_c/Footer';
import ProjectsBoard from '../../_c/ProjectsBoard';

export const metadata = { title: 'Archive: case file', robots: { index: false, follow: false } };

export default function CaseFile() {
  return (
    <div className="pjwrap">
      <ProjectsBoard />
      <Footer dark />
    </div>
  );
}
