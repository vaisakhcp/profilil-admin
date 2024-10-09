import CreateTicketForm from '@/app/components/apps/reported-content/CreateTicketForm';
import type { Metadata } from 'next';
import BreadcrumbComp from '@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp';
import { TicketProvider } from '@/app/context/TicketContext/index';

export const metadata: Metadata = {
  title: 'Ticket App',
};

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Tickets',
  },
];
const CreateTickets = () => {
  return (
    <>
      <BreadcrumbComp title='Tickets App' items={BCrumb} />
      <TicketProvider>
        <CreateTicketForm />
      </TicketProvider>
    </>
  );
};

export default CreateTickets;
