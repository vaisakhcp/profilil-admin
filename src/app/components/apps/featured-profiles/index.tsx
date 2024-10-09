'use client';
import React, { useState } from 'react';

import CardBox from '@/app/components/shared/CardBox';
import TicketFilter from '@/app/components/apps/featured-profiles/TicketFilter';
import TicketListing from '@/app/components/apps/featured-profiles/TicketListing';
import Details from '@/app/components/apps/featured-profiles/details';
import { TicketProvider } from '@/app/context/TicketContext/index';

// Define the profile type
interface Profile {
  uniqueName: string;
  // Add other profile properties here if needed
}

const TicketsApp = () => {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

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
