import FeaturedProfiles from '@/app/components/apps/featured-profiles';
import BreadcrumbComp from '../../layout/shared/breadcrumb/BreadcrumbComp';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Ticket App',
};

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Featured Profiles',
  },
];
const Tickets = () => {
  return (
    <>
      <BreadcrumbComp title='Featured Profiles' items={BCrumb} />
      <FeaturedProfiles />
    </>
  );
};

export default Tickets;
