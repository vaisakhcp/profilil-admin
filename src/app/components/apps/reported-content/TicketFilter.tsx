import React, { useEffect, useState } from 'react';
import { getReportedProfiles } from '../../../api/profiles';
const TicketFilter = () => {
  const [profiles, setProfiles] = useState<any[]>([]); // State to store the profiles
  const [totalProfiles, setTotalProfiles] = useState(0);
  const [featuredProfiles, setFeaturedProfiles] = useState(0);
  const [suspendedProfiles, setSuspendedProfiles] = useState(0);
  const [deletedProfiles, setDeletedProfiles] = useState(0);

  useEffect(() => {
    // Fetch the profiles from the API
    const fetchProfiles = async () => {
      try {
        const response = await getReportedProfiles;
        const data = response.data;

        // Set the profiles and calculate counts
        setProfiles(data);
        setTotalProfiles(data.length);
        setFeaturedProfiles(
          data.filter((profile: any) => profile.type === 1).length
        );
        setSuspendedProfiles(
          data.filter((profile: any) => profile.profile.suspended).length
        );
        setDeletedProfiles(
          data.filter((profile: any) => profile.profile.deleted).length
        );
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <>
      <div className='grid grid-cols-12 gap-6'>
        {/* Total Profiles */}
        <div className='lg:col-span-3 md:col-span-6  col-span-12'>
          <div
            className='p-[30px] bg-lightprimary dark:bg-lightprimary text-center rounded-md cursor-pointer'
            onClick={() => console.log('Total Profiles clicked')}
          >
            <h3 className='text-primary text-2xl'>{totalProfiles}</h3>
            <h6 className='text-base text-primary'>Total Profiles</h6>
          </div>
        </div>

        {/* Featured Profiles */}
        <div className='lg:col-span-3 md:col-span-6  col-span-12'>
          <div
            className='p-[30px] bg-lightwarning dark:bg-lightwarning text-center rounded-md cursor-pointer'
            onClick={() => console.log('Featured Profiles clicked')}
          >
            <h3 className='text-warning text-2xl'>{featuredProfiles}</h3>
            <h6 className='text-base text-warning'>Total Featured Profiles</h6>
          </div>
        </div>

        {/* Suspended Profiles */}
        <div className='lg:col-span-3 md:col-span-6  col-span-12'>
          <div
            className='p-[30px] bg-lightsuccess dark:bg-lightsuccess text-center rounded-md cursor-pointer'
            onClick={() => console.log('Suspended Profiles clicked')}
          >
            <h3 className='text-success text-2xl'>{suspendedProfiles}</h3>
            <h6 className='text-base text-success'>Suspended Profiles</h6>
          </div>
        </div>

        {/* Deleted Profiles */}
        <div className='lg:col-span-3 md:col-span-6  col-span-12'>
          <div
            className='p-[30px] bg-lighterror dark:bg-lighterror text-center rounded-md cursor-pointer'
            onClick={() => console.log('Deleted Profiles clicked')}
          >
            <h3 className='text-error text-2xl'>{deletedProfiles}</h3>
            <h6 className='text-base text-error'>Deleted Profiles</h6>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketFilter;
