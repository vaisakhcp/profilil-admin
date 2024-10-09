import axiosServices from '../../../utils/axios';

export const getAuthenticated = async (requestBody: any) => {
  try {
    const response = await axiosServices.post(
      '/authentication/authenticate',
      JSON.stringify(requestBody), // Send requestBody as a JSON string
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    // Log the response status and data for debugging
    console.log('API Response Status:', response.status);
    console.log('API Response Data:', response.data);
    // Check if the request was successful
    if (response.status !== 201) {
      throw new Error('Failed to authenticate');
    }

    return response.data; // Return the fetched data
  } catch (error) {
    console.error('Error fetching profiles:', error);
    throw error; // Throw the error so it can be caught in the calling function
  }
};
