'use client';
import React, { useState } from 'react';

import CardBox from '@/app/components/shared/CardBox';
import TicketFilter from '@/app/components/apps/specialization/TicketFilter';
import TicketListing from '@/app/components/apps/specialization/TicketListing';
import Details from '@/app/components/apps/specialization/details';
import { TicketProvider } from '@/app/context/TicketContext/index';

const TicketsApp = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);

  return (
    <TicketProvider>
      <CardBox>
        <TicketFilter />
        {!selectedProfile && (
          <TicketListing setSelectedProfile={setSelectedProfile} />
        )}
        {selectedProfile && (
          <Details
            uniqueName={selectedProfile.uniqueName}
            setSelectedProfile={setSelectedProfile} // To allow navigating back
          />
        )}
      </CardBox>
    </TicketProvider>
  );
};

export default TicketsApp;
