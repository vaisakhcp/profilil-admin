import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  Button,
  TextInput,
  Label,
  FileInput,
  Modal,
} from 'flowbite-react';
import { useRouter } from 'next/navigation';

interface DetailsProps {
  uniqueName: string;
  setSelectedProfile: (profile: null) => void;
}

const Details: React.FC<DetailsProps> = ({
  uniqueName,
  setSelectedProfile,
}) => {
  const [profileDetails, setProfileDetails] = useState<any>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const router = useRouter();

  useEffect(() => {
    axios
      .get(
        `http://157.245.105.48/api/app/profile/id-by-unique-name?username=${uniqueName}`
      )
      .then((response) => {
        const { id, token } = response.data;
        localStorage.setItem('token', token);
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
                setProfilePicture(reader.result as string | null);
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
    setIsEditing(true);
    setShowModal(true); // Show modal when editing is enabled
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    field: string
  ) => {
    if (field.includes('bioInfo')) {
      const fieldName = field.split('.')[1];
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

    const saveProfileDetails = axios.put(
      `http://157.245.105.48/api/app/profile/${id}`,
      profileDetails
    );

    let uploadImage = Promise.resolve();

    if (selectedImageFile) {
      const formData = new FormData();
      formData.append('media', selectedImageFile);

      uploadImage = axios.post(
        `http://157.245.105.48/api/app/media/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    }

    Promise.all([saveProfileDetails, uploadImage])
      .then(() => {
        setIsEditing(false);
        setShowModal(false); // Close modal after saving
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
      <div className='flex justify-between items-center mb-4'>
        <Button color='light' onClick={() => setSelectedProfile(null)}>
          Back
        </Button>
        <Button color='primary' onClick={handleEditClick}>
          Edit Profile
        </Button>
      </div>

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
      </div>

      <div className='bg-white shadow rounded-lg p-6'>
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Field</Table.HeadCell>
            <Table.HeadCell>Value</Table.HeadCell>
          </Table.Head>
          <Table.Body className='divide-y'>
            {profileDetails.bioInfo && (
              <>
                <Table.Row>
                  <Table.Cell colSpan={2} className='bg-gray-100 font-semibold'>
                    Bio Information
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className='font-medium'>Name</Table.Cell>
                  <Table.Cell>{profileDetails.bioInfo.name}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className='font-medium'>Nickname</Table.Cell>
                  <Table.Cell>{profileDetails.bioInfo.nickname}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className='font-medium'>Gender</Table.Cell>
                  <Table.Cell>{profileDetails.bioInfo.gender}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className='font-medium'>Date of Birth</Table.Cell>
                  <Table.Cell>
                    {new Date(
                      profileDetails.bioInfo.dateOfBirth
                    ).toLocaleDateString()}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className='font-medium'>Bio</Table.Cell>
                  <Table.Cell>{profileDetails.bioInfo.bio}</Table.Cell>
                </Table.Row>
              </>
            )}
            <Table.Row>
              <Table.Cell className='font-medium'>Unique Name</Table.Cell>
              <Table.Cell>{profileDetails.uniqueName}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className='font-medium'>Phone Number</Table.Cell>
              <Table.Cell>{profileDetails.phoneNumber || 'N/A'}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className='font-medium'>Email ID</Table.Cell>
              <Table.Cell>{profileDetails.emailId || 'N/A'}</Table.Cell>
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
          </Table.Body>
        </Table>
      </div>

      <Modal show={showModal} size='md' onClose={() => setShowModal(false)}>
        <Modal.Header>Edit Profile</Modal.Header>
        <Modal.Body>
          <div className='space-y-6'>
            <div className='text-center mb-6'>
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
              <Label htmlFor='file'>Change Profile Picture</Label>
              <FileInput id='file' onChange={handleProfilePictureChange} />
            </div>

            <TextInput
              type='text'
              label='Unique Name'
              value={profileDetails.uniqueName}
              onChange={(e) => handleInputChange(e, 'uniqueName')}
              placeholder='Enter unique name'
            />
            <TextInput
              type='text'
              label='Phone Number'
              value={profileDetails.phoneNumber || ''}
              onChange={(e) => handleInputChange(e, 'phoneNumber')}
              placeholder='Enter phone number'
            />
            <TextInput
              type='email'
              label='Email ID'
              value={profileDetails.emailId || ''}
              onChange={(e) => handleInputChange(e, 'emailId')}
              placeholder='Enter email address'
            />

            {/* Bio Information */}
            {profileDetails.bioInfo && (
              <>
                <TextInput
                  type='text'
                  label='Name'
                  value={profileDetails.bioInfo.name || ''}
                  onChange={(e) => handleInputChange(e, 'bioInfo.name')}
                  placeholder='Enter full name'
                />
                <TextInput
                  type='text'
                  label='Nickname'
                  value={profileDetails.bioInfo.nickname || ''}
                  onChange={(e) => handleInputChange(e, 'bioInfo.nickname')}
                  placeholder='Enter nickname'
                />
                <TextInput
                  type='text'
                  label='Gender'
                  value={profileDetails.bioInfo.gender || ''}
                  onChange={(e) => handleInputChange(e, 'bioInfo.gender')}
                  placeholder='Enter gender'
                />
                <TextInput
                  type='date'
                  label='Date of Birth'
                  value={
                    new Date(profileDetails.bioInfo.dateOfBirth)
                      .toISOString()
                      .split('T')[0]
                  }
                  onChange={(e) => handleInputChange(e, 'bioInfo.dateOfBirth')}
                  placeholder='Select date of birth'
                />
                <textarea
                  className='form-textarea'
                  value={profileDetails.bioInfo.bio || ''}
                  onChange={(e) => handleInputChange(e, 'bioInfo.bio')}
                  placeholder='Write a short bio'
                />
              </>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color='success' onClick={handleSaveClick}>
            Save Changes
          </Button>
          <Button color='light' onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Details;
