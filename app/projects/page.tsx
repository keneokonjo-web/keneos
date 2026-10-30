import Footer from '../_c/Footer';
import ProjectsBoard from '../_c/ProjectsBoard';

export const metadata = { title: 'Projects' };

export default function Projects() {
  return (
    <div className="pjwrap">
      <ProjectsBoard />
      <Footer dark />
    </div>
  );
}
