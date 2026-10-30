import Footer from '../../_c/Footer';
import ProjectsBody from '../../_c/ProjectsBody';
import ProjectsHero from '../../_c/ProjectsHero';
import { heroProjects } from '@/content/site';

export const metadata = { title: 'Archive: projects', robots: { index: false, follow: false } };

export default function Projects() {
  return (
    <div className="white">
      <ProjectsHero images={heroProjects} />
      <ProjectsBody />
      <Footer />
    </div>
  );
}
