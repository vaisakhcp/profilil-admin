import { useState, useEffect } from 'react';
import { Table, TextInput, Tooltip, Button, Spinner } from 'flowbite-react'; // Import Spinner
import { Icon } from '@iconify/react/dist/iconify.js';
import { fetchProfiles } from '../../../api/profiles';

const TicketListing = ({ setSelectedProfile }) => {
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading
  const [tableHeaders] = useState([
    'Unique Name',
    'Phone Number',
    'Email ID',
    'Created At',
    'Updated At',
  ]);

  useEffect(() => {
    const getFeaturedProfiles = async () => {
      try {
        const response = await fetchProfiles();

        // Ensure that response and response.data are valid and are arrays
        if (response && Array.isArray(response)) {
          const data = response.map((item: any) => ({
            uniqueName: item.profile?.uniqueName || 'N/A',
            phoneNumber: item.profile?.phoneNumber || 'N/A',
            emailId: item.profile?.emailId || 'N/A',
            createdAt: new Date(item.profile?.createdAt),
            updatedAt: new Date(item.profile?.updatedAt),
          }));

          setProfiles(data);
          setFilteredProfiles(data);
        } else {
          console.error('Error: Data is not an array');
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    getFeaturedProfiles();
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

  // Show spinner if loading is true, otherwise show the table
  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' aria-label='Loading profiles...' />
      </div>
    );
  }

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
            <Table.Body className='divide-y divide-border dark:divide-darkborder'>
              {filteredProfiles.map((profile: any, index) => (
                <Table.Row
                  key={index}
                  className='cursor-pointer'
                  onClick={() => handleRowClick(profile)}
                >
                  <Table.Cell className='max-w-md'>
                    <div className='flex items-center gap-3'>
                      <div>
                        <h6 className='text-base'>{profile.uniqueName}</h6>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell className='whitespace-nowrap'>
                    {profile.phoneNumber}
                  </Table.Cell>
                  <Table.Cell className='whitespace-nowrap'>
                    {profile.emailId}
                  </Table.Cell>
                  <Table.Cell className='whitespace-nowrap'>
                    <p className='text-sm text-darklink'>
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </p>
                  </Table.Cell>
                  <Table.Cell className='whitespace-nowrap'>
                    <p className='text-sm text-darklink'>
                      {new Date(profile.updatedAt).toLocaleDateString()}
                    </p>
                  </Table.Cell>
                  <Table.Cell>
                    <Tooltip
                      content='Delete Profile'
                      placement='bottom'
                      arrow={false}
                    >
                      <Button
                        className='btn-circle ms-auto'
                        color={'transparent'}
                      >
                        <Icon
                          icon='solar:trash-bin-minimalistic-outline'
                          height='18'
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                            console.log(
                              `Delete profile with unique name: ${profile.uniqueName}`
                            );
                          }}
                        />
                      </Button>
                    </Tooltip>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </>
  );
};

export default TicketListing;
