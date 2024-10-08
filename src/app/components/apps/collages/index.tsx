'use client';
import React, { useState } from 'react';

import CardBox from '@/app/components/shared/CardBox';
import TicketFilter from '@/app/components/apps/courses/TicketFilter';
import TicketListingComponent from '@/app/components/apps/courses/TicketListing';

import Details from '@/app/components/apps/courses/details';
import { TicketProvider } from '@/app/context/TicketContext/index';
import TicketsApp from '../courses';
interface Profile {
  uniqueName: string;
  // Add other properties of Profile if necessary
}
interface TicketListingProps {
  setSelectedProfile: (profile: Profile) => void; // modify according to your needs
  // other props can be added here
}
const TicketListing: React.FC<TicketListingProps> = ({
  setSelectedProfile: setProfileFromProps, // Rename prop for clarity
}) => {
  const [selectedProfile, setSelectedProfileState] = useState<Profile | null>(
    null
  ); // Rename state setter

  return (
    <TicketProvider>
      <CardBox>
        <TicketFilter />
        {!selectedProfile && (
          <TicketListing setSelectedProfile={setProfileFromProps} />
        )}
      </CardBox>
    </TicketProvider>
  );
};

export default TicketsApp;
