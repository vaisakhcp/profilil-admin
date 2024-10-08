'use client';
import React, { Dispatch, SetStateAction, useState } from 'react';

import CardBox from '@/app/components/shared/CardBox';
import TicketFilter from '@/app/components/apps/courses/TicketFilter';
import TicketListing from '@/app/components/apps/courses/TicketListing';
import Details from '@/app/components/apps/courses/details';
import { TicketProvider } from '@/app/context/TicketContext/index';

// Define the type for Profile
interface Profile {
  uniqueName: string;
  // Add any other properties you expect for the profile
}

interface TicketListingProps {
  setSelectedProfile: Dispatch<SetStateAction<Profile | null>>;
}

const TicketsApp: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null); // Explicitly type selectedProfile

  return (
    <TicketProvider>
      <CardBox>
        <TicketFilter />
        {!selectedProfile && (
          <TicketListing setSelectedProfile={setSelectedProfile} />
        )}
        {selectedProfile && (
          <Details
            uniqueName={selectedProfile.uniqueName} // Now TypeScript knows uniqueName exists
            setSelectedProfile={setSelectedProfile} // To allow navigating back
          />
        )}
      </CardBox>
    </TicketProvider>
  );
};

export default TicketsApp;
