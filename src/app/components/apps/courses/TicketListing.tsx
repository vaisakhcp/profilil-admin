import { useState, useEffect } from 'react';
import { Table, TextInput, Tooltip, Button, Pagination } from 'flowbite-react';
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';
// Define the type for Profile
interface Profile {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  verified: string; // 'Yes' or 'No'
}

// Define the props for the component
interface TicketListingProps {
  setSelectedProfile: (profile: Profile | null) => void; // Explicitly type setSelectedProfile
}
const TicketListing: React.FC<TicketListingProps> = ({
  setSelectedProfile,
}) => {
  const [profiles, setProfiles] = useState([]); // All profiles from API
  const [filteredProfiles, setFilteredProfiles] = useState([]); // Filtered profiles
  const [searchTerm, setSearchTerm] = useState(''); // For searching
  const [tableHeaders] = useState([
    'ID',
    'Name',
    'Created At',
    'Updated At',
    'Verified',
  ]); // Table headers

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [profilesPerPage] = useState(10); // Profiles per page (change this to adjust how many profiles to show per page)

  // Fetch profiles from the API
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(
          'http://157.245.105.48/api/app/course',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data.map((item: any) => ({
          id: item.id || 'N/A',
          name: item.name || 'N/A',
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
          verified: item.verified ? 'Yes' : 'No',
        }));

        setProfiles(data); // Store profiles in state
        setFilteredProfiles(data); // Initially show all profiles
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, []);
  A;
  // Filter profiles based on the search term
  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = profiles?.filter((profile: any) =>
      profile.name.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredProfiles(filtered);
  }, [searchTerm, profiles]);

  // Get current profiles for the current page
  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = filteredProfiles.slice(
    indexOfFirstProfile,
    indexOfLastProfile
  );

  // Handle changing pages
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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

        {/* Profile Table */}
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
              {currentProfiles.map((profile: any, index) => (
                <Table.Row
                  key={index}
                  className='cursor-pointer'
                  onClick={() => handleRowClick(profile)}
                >
                  <Table.Cell className='max-w-md'>
                    <div className='flex items-center gap-3'>
                      <div>
                        <h6 className='text-base'>{profile.id}</h6>{' '}
                        {/* Display ID */}
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell className='whitespace-nowrap'>
                    {profile.name} {/* Display Name */}
                  </Table.Cell>
                  <Table.Cell className='whitespace-nowrap'>
                    <p className='text-sm text-darklink'>
                      {profile.createdAt.toLocaleDateString()}{' '}
                      {/* Display Created At */}
                    </p>
                  </Table.Cell>
                  <Table.Cell className='whitespace-nowrap'>
                    <p className='text-sm text-darklink'>
                      {profile.updatedAt.toLocaleDateString()}{' '}
                      {/* Display Updated At */}
                    </p>
                  </Table.Cell>
                  <Table.Cell className='whitespace-nowrap'>
                    {profile.verified} {/* Display Verified Status */}
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
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          console.log(`Delete profile with ID: ${profile.id}`);
                        }}
                      >
                        <Icon
                          icon='solar:trash-bin-minimalistic-outline'
                          height='18'
                        />
                      </Button>
                    </Tooltip>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* Pagination */}
        <div className='flex justify-center mt-4'>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredProfiles.length / profilesPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
};

export default TicketListing;
