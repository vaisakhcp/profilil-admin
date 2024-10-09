import { useState, useEffect } from 'react';
import {
  Table,
  TextInput,
  Tooltip,
  Button,
  Alert,
  Pagination,
} from 'flowbite-react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { getAllCollages } from '@/app/api/profiles';

const TicketListing = ({ setSelectedProfile }) => {
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

  const [tableHeaders] = useState([
    'Batch Start Year',
    'Batch End Year',
    'Education Institution ID',
    'Course ID',
    'Specialization ID',
    'Profile ID',
    'Created At',
    'Updated At',
  ]);

  // Fetch profiles from the API
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await getAllCollages(); // Fetch API data
        const data = response.map((item: any) => ({
          batchStartYear: item.batchStartYear,
          batchEndYear: item.batchEndYear || 'N/A',
          educationInstitutionId: item.educationInstitutionId,
          courseId: item.courseId,
          specializationId: item.specializationId,
          profileId: item.profileId,
          createdAt: new Date(item.createdAt).toLocaleDateString(),
          updatedAt: new Date(item.updatedAt).toLocaleDateString(),
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
    const filtered = profiles.filter((profile: any) =>
      profile.educationInstitutionId
        .toLowerCase()
        .includes(lowercasedSearchTerm)
    );
    setFilteredProfiles(filtered);
    setCurrentPage(1); // Reset to the first page when searching
  }, [searchTerm, profiles]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProfiles.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);

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
            placeholder='Search by Institution ID'
            icon={() => <Icon icon='solar:magnifer-line-duotone' height={18} />}
          />
        </div>
        <div>
          {currentItems.length === 0 ? (
            <Alert color='info' className='text-center'>
              No data to show
            </Alert>
          ) : (
            <>
              <div
                className='overflow-x-auto' // Add scrollable container with max height
              >
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
                  <Table.Body className='divide-y'>
                    {currentItems.map((profile: any, index) => (
                      <Table.Row
                        key={index}
                        className='cursor-pointer'
                        onClick={() => handleRowClick(profile)}
                      >
                        <Table.Cell>{profile.batchStartYear}</Table.Cell>
                        <Table.Cell>{profile.batchEndYear}</Table.Cell>
                        <Table.Cell>
                          {profile.educationInstitutionId}
                        </Table.Cell>
                        <Table.Cell>{profile.courseId}</Table.Cell>
                        <Table.Cell>{profile.specializationId}</Table.Cell>
                        <Table.Cell>{profile.profileId}</Table.Cell>
                        <Table.Cell>{profile.createdAt}</Table.Cell>
                        <Table.Cell>{profile.updatedAt}</Table.Cell>
                        <Table.Cell>
                          <Tooltip content='Delete Profile' placement='bottom'>
                            <Button
                              className='btn-circle'
                              color={'transparent'}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click
                                console.log(
                                  `Delete profile with ID: ${profile.profileId}`
                                );
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

              {/* Pagination Controls */}
              <div className='flex justify-between items-center mt-4'>
                <span>
                  Showing {indexOfFirstItem + 1} to{' '}
                  {indexOfLastItem > filteredProfiles.length
                    ? filteredProfiles.length
                    : indexOfLastItem}{' '}
                  of {filteredProfiles.length} entries
                </span>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TicketListing;
