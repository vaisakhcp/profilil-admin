import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, TextInput, Label, FileInput } from 'flowbite-react';
import { useRouter } from 'next/navigation';

// Define the type for the props
interface DetailsProps {
  uniqueName: string; // Explicitly typing uniqueName as a string
  setSelectedProfile: (profile: null) => void; // setSelectedProfile will be a function that accepts null
}

const Details: React.FC<DetailsProps> = ({
  uniqueName,
  setSelectedProfile,
}) => {
  const [profileDetails, setProfileDetails] = useState<any>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null); // Profile picture as base64 or null
  const [isEditing, setIsEditing] = useState(false); // Toggle between edit and read-only mode
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null); // To handle profile picture upload
  const router = useRouter();

  useEffect(() => {
    // Fetch the profile details using the uniqueName
    axios
      .get(
        `http://157.245.105.48/api/app/profile/id-by-unique-name?username=${uniqueName}`
      )
      .then((response) => {
        const { id, token } = response.data;
        localStorage.setItem('token', token); // Save the token in local storage for subsequent requests
        return axios.get(`http://157.245.105.48/api/app/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((profileResponse) => {
        setProfileDetails(profileResponse.data);

        if (profileResponse.data.bioInfo?.mediaId) {
          return axios
            .get(
              `http://157.245.105.48/api/app/media?mediaId=${profileResponse.data.bioInfo.mediaId}`,
              { responseType: 'blob' }
            )
            .then((mediaResponse) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                setProfilePicture(reader.result as string | null); // Ensure profilePicture can be string or null
              };
              reader.readAsDataURL(mediaResponse.data);
            });
        }
      })
      .catch((error) => {
        console.error('Error fetching profile details or media:', error);
      });
  }, [uniqueName]);

  const handleEditClick = () => {
    setIsEditing(!isEditing); // Toggle edit mode
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    field: string
  ) => {
    // Update the profile details state when input fields change
    if (field.includes('bioInfo')) {
      const fieldName = field.split('.')[1]; // Get the nested field name
      setProfileDetails({
        ...profileDetails,
        bioInfo: {
          ...profileDetails.bioInfo,
          [fieldName]: e.target.value,
        },
      });
    } else {
      setProfileDetails({
        ...profileDetails,
        [field]: e.target.value,
      });
    }
  };

  const handleProfilePictureChange = (e: { target: { files: any[] } }) => {
    const file = e.target.files[0];
    setSelectedImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result as string | null);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveClick = () => {
    const { id } = profileDetails;

    // Save the updated profile details via API
    const saveProfileDetails = axios.put(
      `http://157.245.105.48/api/app/profile/${id}`,
      profileDetails
    );

    let uploadImage = Promise.resolve();

    // If a new profile picture is uploaded, send it to the server
    if (selectedImageFile) {
      const formData = new FormData();
      formData.append('media', selectedImageFile);

      uploadImage = axios.post(
        `http://157.245.105.48/api/app/media/upload`, // Placeholder URL
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    }

    // Wait for both profile details and image to be uploaded
    Promise.all([saveProfileDetails, uploadImage])
      .then(() => {
        setIsEditing(false); // Exit edit mode after saving
      })
      .catch((error) => {
        console.error(
          'Error saving profile details or uploading image:',
          error
        );
      });
  };

  if (!profileDetails) {
    return <p className='text-center mt-4'>Loading profile details...</p>;
  }

  return (
    <div className='max-w-8xl mx-auto p-12'>
      {/* Header Section with Back and Edit/Save Buttons */}
      <div className='flex justify-between items-center mb-4'>
        <Button color='light' onClick={() => setSelectedProfile(null)}>
          Back
        </Button>
        {isEditing ? (
          <Button color='success' onClick={handleSaveClick}>
            Save Profile
          </Button>
        ) : (
          <Button color='primary' onClick={handleEditClick}>
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile Picture */}
      <div className='text-center mb-9'>
        {profilePicture ? (
          <img
            src={profilePicture}
            alt='Profile Picture'
            className='mx-auto rounded-full shadow-lg w-40 h-40 object-cover mb-4'
          />
        ) : (
          <div className='w-40 h-40 rounded-full mx-auto bg-gray-200 flex items-center justify-center mb-4'>
            <span className='text-gray-500'>No Image</span>
          </div>
        )}
        {isEditing && (
          <div className='flex justify-center'>
            <div style={{ margin: 20 }}>
              <Label htmlFor='file'>Change Profile Picture</Label>
              <FileInput id='file' />
            </div>
          </div>
        )}
      </div>

      {/* Profile Details Table */}
      <div className='bg-white shadow rounded-lg p-6'>
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Field</Table.HeadCell>
            <Table.HeadCell>Value</Table.HeadCell>
          </Table.Head>
          <Table.Body className='divide-y'>
            {/* Basic Information */}
            <Table.Row>
              <Table.Cell className='font-medium'>Unique Name</Table.Cell>
              <Table.Cell>
                {isEditing ? (
                  <TextInput
                    type='text'
                    value={profileDetails.uniqueName}
                    onChange={(e) => handleInputChange(e, 'uniqueName')}
                  />
                ) : (
                  profileDetails.uniqueName
                )}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className='font-medium'>Phone Number</Table.Cell>
              <Table.Cell>
                {isEditing ? (
                  <TextInput
                    type='text'
                    value={profileDetails.phoneNumber || ''}
                    onChange={(e) => handleInputChange(e, 'phoneNumber')}
                  />
                ) : (
                  profileDetails.phoneNumber || 'N/A'
                )}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className='font-medium'>Email ID</Table.Cell>
              <Table.Cell>
                {isEditing ? (
                  <TextInput
                    type='email'
                    value={profileDetails.emailId || ''}
                    onChange={(e) => handleInputChange(e, 'emailId')}
                  />
                ) : (
                  profileDetails.emailId || 'N/A'
                )}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className='font-medium'>Created At</Table.Cell>
              <Table.Cell>
                {new Date(profileDetails.createdAt).toLocaleString()}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className='font-medium'>Updated At</Table.Cell>
              <Table.Cell>
                {new Date(profileDetails.updatedAt).toLocaleString()}
              </Table.Cell>
            </Table.Row>

            {/* Bio Information */}
            {profileDetails.bioInfo && (
              <>
                <Table.Row>
                  <Table.Cell colSpan={2} className='bg-gray-100 font-semibold'>
                    Bio Information
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className='font-medium'>Name</Table.Cell>
                  <Table.Cell>
                    {isEditing ? (
                      <TextInput
                        type='text'
                        value={profileDetails.bioInfo.name || ''}
                        onChange={(e) => handleInputChange(e, 'bioInfo.name')}
                      />
                    ) : (
                      profileDetails.bioInfo.name
                    )}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className='font-medium'>Nickname</Table.Cell>
                  <Table.Cell>
                    {isEditing ? (
                      <TextInput
                        type='text'
                        value={profileDetails.bioInfo.nickname || ''}
                        onChange={(e) =>
                          handleInputChange(e, 'bioInfo.nickname')
                        }
                      />
                    ) : (
                      profileDetails.bioInfo.nickname
                    )}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className='font-medium'>Gender</Table.Cell>
                  <Table.Cell>
                    {isEditing ? (
                      <TextInput
                        type='text'
                        value={profileDetails.bioInfo.gender || ''}
                        onChange={(e) => handleInputChange(e, 'bioInfo.gender')}
                      />
                    ) : (
                      profileDetails.bioInfo.gender
                    )}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className='font-medium'>Date of Birth</Table.Cell>
                  <Table.Cell>
                    {isEditing ? (
                      <TextInput
                        type='date'
                        value={
                          new Date(profileDetails.bioInfo.dateOfBirth)
                            .toISOString()
                            .split('T')[0]
                        }
                        onChange={(e) =>
                          handleInputChange(e, 'bioInfo.dateOfBirth')
                        }
                      />
                    ) : (
                      new Date(
                        profileDetails.bioInfo.dateOfBirth
                      ).toLocaleDateString()
                    )}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className='font-medium'>Bio</Table.Cell>
                  <Table.Cell>
                    {isEditing ? (
                      <textarea
                        className='form-textarea'
                        value={profileDetails.bioInfo.bio || ''}
                        onChange={(e) => handleInputChange(e, 'bioInfo.bio')}
                      />
                    ) : (
                      profileDetails.bioInfo.bio
                    )}
                  </Table.Cell>
                </Table.Row>
              </>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default Details;
