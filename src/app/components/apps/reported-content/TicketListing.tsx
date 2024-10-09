import { useState, useEffect } from 'react';
import { Table, TextInput, Tooltip, Button, Alert } from 'flowbite-react';
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';
import { getReportedContent } from '@/app/api/profiles';

const TicketListing = ({ setSelectedProfile }) => {
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [tableHeaders] = useState([
    'Unique Name',
    'Phone Number',
    'Email ID',
    'Created At',
    'Updated At',
  ]);

  // Fetch profiles from the API
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await getReportedContent(); // Call the function correctly
        const data = response?.data.map((item: any) => ({
          uniqueName: item.profile.uniqueName || 'N/A',
          phoneNumber: item.profile.phoneNumber || 'N/A',
          emailId: item.profile.emailId || 'N/A',
          createdAt: new Date(item.profile.createdAt),
          updatedAt: new Date(item.profile.updatedAt),
        }));
        setProfiles(data);
        setFilteredProfiles(data);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, []);

  // Filter profiles based on the search term
  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = profiles?.filter((profile: any) =>
      profile.uniqueName.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredProfiles(filtered);
  }, [searchTerm, profiles]);

  const handleRowClick = (profile: any) => {
    setSelectedProfile(profile); // Set the selected profile when the row is clicked
  };

  return (
    <>
      <div className='my-6'>
        <div className='flex justify-between items-center mb-4'>
          <TextInput
            type='text'
            sizing='md'
            className='form-control sm:max-w-60 max-w-full w-full'
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search Profiles'
            icon={() => <Icon icon='solar:magnifer-line-duotone' height={18} />}
          />
        </div>
        <div className='overflow-x-auto'>
          {filteredProfiles.length === 0 ? (
            <Alert color='info' className='text-center'>
              No data to show
            </Alert>
          ) : (
            <Table>
              <Table.Head>
                {tableHeaders.map((header) => (
                  <Table.HeadCell
                    key={header}
                    className='text-base font-semibold py-3 whitespace-nowrap'
                  >
                    {header}
                  </Table.HeadCell>
                ))}
                <Table.HeadCell className='text-base font-semibold py-3 text-end'>
                  Action
                </Table.HeadCell>
              </Table.Head>
            </Table>
          )}
        </div>
      </div>
    </>
  );
};

export default TicketListing;
