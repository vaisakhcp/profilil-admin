'use client'; // Add this directive at the top

import { Button, TextInput, Spinner } from 'flowbite-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const AuthLogin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Hardcoded request body
    const requestBody = {
      verificationKey: '+1234567890',
      otp: '000000',
    };

    try {
      const response = await fetch(
        'http://157.245.105.48/api/app/authentication/authenticate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to authenticate');
      }

      const data = await response.json();

      // Save the token in localStorage
      localStorage.setItem('authToken', data.token);

      // Programmatically navigate to the next page after successful sign-in
      router.push('/apps/featured-profiles');
    } catch (error) {
      console.error(error);
      alert('Authentication failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='w-full max-w-md p-6 sm:p-10 space-y-6 bg-white rounded-xl shadow-md mx-4 sm:mx-auto'>
        {/* Logo Section */}
        <div className='flex justify-center mb-6'>
          <img
            src='/images/logos/vybe2.png'
            alt='Company Logo'
            className='w-28 h-28 sm:w-32 sm:h-32 object-contain'
          />
        </div>

        <p className='text-center text-gray-500'>
          Sign in to your account to continue
        </p>

        {/* Form Section */}
        <form className='space-y-6' onSubmit={handleSignIn}>
          {/* Username Field */}
          <div>
            <p className='text-gray-500'>Username</p>
            <TextInput
              id='username'
              type='text'
              required
              placeholder='Enter your username'
              className='mt-1 w-full border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500'
              style={{ borderRadius: '0 ' }}
              disabled={loading} // Disable input during loading
            />
          </div>

          {/* Password Field */}
          <div>
            <p className='text-gray-500'>Password</p>
            <TextInput
              id='userpwd'
              type='password'
              required
              placeholder='Enter your password'
              className='mt-1 w-full border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500'
              style={{ borderRadius: '0 ' }}
              disabled={loading} // Disable input during loading
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className='flex items-center justify-between'>
            <div className='text-sm'>
              <Link
                href='/auth/auth1/forgot-password'
                className='font-medium text-blue-600 hover:text-blue-500'
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Sign In Button */}
          <Button
            color='blue'
            type='submit'
            className='w-full py-2 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:bg-blue-600'
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <div className='flex items-center justify-center'>
                <Spinner aria-label='Loading' size='sm' className='mr-2' />
                <span>Signing In...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Sign Up Link */}
        <p className='mt-6 text-center text-sm text-gray-600'>
          Don't have an account?{' '}
          <Link
            href='/auth/auth1/register'
            className='font-medium text-blue-600 hover:text-blue-500'
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthLogin;
