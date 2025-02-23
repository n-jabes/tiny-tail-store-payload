'use client';

import Image from 'next/image';
import { Trash2, Upload, Eye, EyeOff, Edit } from 'lucide-react';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';

export default function ProfilePage({ user }: { user: any }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    firstname: user.firstname || '',
    lastname: user.lastname || '',
    email: user.email || '',
    address: user.address || '',
    currentPassword: '',
    newPassword: '',
    image: user.image || '/profile.png',
  });

  const hasChanges =
    formData.name !== user.name ||
    formData.firstname !== user.firstname ||
    formData.lastname !== user.lastname ||
    formData.email !== user.email ||
    formData.address !== user.address ||
    formData.image !== (user.image || '/profile.png') ||
    formData.currentPassword ||
    formData.newPassword;

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const payload: any = {
        name: formData.name,
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        address: formData.address,
      };

      if (formData.currentPassword && formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.password = formData.newPassword;
      }

      if (formData.image && formData.image !== (user.image || '/profile.png')) {
        payload.image = formData.image;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      console.log('Updated User Data:', updatedUser);

      setFormData((prev) => ({
        ...prev,
        name: updatedUser.name || prev.name,
        firstname: updatedUser.firstname || prev.firstname,
        lastname: updatedUser.lastname || prev.lastname,
        email: updatedUser.email || prev.email,
        address: updatedUser.address || prev.address,
        image: updatedUser.image || prev.image,
        currentPassword: '',
        newPassword: '',
      }));

      toast.success('Profile updated successfully!');
      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt', 'Profile image');

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/media`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const imageData = await response.json();
      setFormData((prev) => ({
        ...prev,
        image: imageData.url,
      }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleDiscardChanges = () => {
    setFormData({
      name: user.name || '',
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      email: user.email || '',
      address: user.address || '',
      currentPassword: '',
      newPassword: '',
      image: user.image || '/profile.png',
    });
    setIsEditMode(false);
    toast.success('Changes discarded!');
  };

  return (
    <div className="p-6 mx-auto bg-contentBg mb-4 rounded-lg shadow-sm h-max w-full">
      <h1 className="text-xl font-semibold text-text mb-6">My Profile</h1>

      {isEditMode ? (
        <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded-md">
          You are in edit mode. Make your changes and click &quot;Update&quot; to save.
        </div>
      ) : (
        <div className="mb-4 p-2 bg-gray-100 text-gray-800 rounded-md">
          You are not in edit mode. Click the edit button to make changes.
        </div>
      )}

      <form onSubmit={handleFormSubmit}>
        <div className="flex items-start gap-2 mb-6 border-b border-gray-300 pb-6">
          <div className="relative mr-6">
            <Image
              alt="Profile Image"
              src={formData.image}
              width={80}
              height={80}
              className="rounded-full"
            />
            {isEditMode && (
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                onClick={() => setFormData((prev) => ({ ...prev, image: '/profile.png' }))}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div>
            <h2 className="text-md font-semibold text-text">{formData.name}</h2>
            {isEditMode && (
              <div className="relative">
                <label
                  htmlFor="upload"
                  className="w-max px-2 flex items-center gap-2 text-sm bg-input text-blue-600 cursor-pointer hover:bg-blue-600 hover:text-white border border-blue-600 p-2 rounded-md"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </label>
                <input
                  id="upload"
                  type="file"
                  className="hidden"
                  accept=".png, .jpeg, .jpg"
                  onChange={handleImageUpload}
                />
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              At least 256x256 PNG or JPG file
            </p>
          </div>

          <button
            type="button"
            onClick={toggleEditMode}
            className={`text-gray-600 p-2 rounded-full hover:bg-gray-200 ml-auto ${isEditMode ? 'bg-gray-200' : ''}`}
          >
            <Edit className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-8 border-b border-gray-300 pb-6">
          <h3 className="text-mb font-semibold text-text">Personal Information</h3>
          <div className="w-5/6 grid grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="firstname"
                className="block text-sm font-medium text-gray-700"
              >
                First name
              </label>
              <input
                id="firstname"
                type="text"
                className="text-sm mt-1 outline-none block w-full p-2 border border-gray-300 bg-input rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.firstname}
                onChange={handleInputChange}
                disabled={!isEditMode}
              />
            </div>
            <div>
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-gray-700"
              >
                Last name
              </label>
              <input
                id="lastname"
                type="text"
                className="text-sm mt-1 outline-none block w-full p-2 border border-gray-300 bg-input rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.lastname}
                onChange={handleInputChange}
                disabled={!isEditMode}
              />
            </div>
          </div>

          <div className="w-5/6 grid grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="text-sm mt-1 outline-none block w-full p-2 border border-gray-300 rounded-md bg-input shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditMode}
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                id="address"
                type="text"
                className="text-sm mt-1 outline-none block w-full p-2 border border-gray-300 rounded-md bg-input shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditMode}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="text-md font-semibold text-text">Password Change</h3>
          <div className="w-5/6 grid grid-cols-2 gap-6">
            <div className="relative">
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Current password
              </label>
              <input
                id="currentPassword"
                type={passwordVisible ? 'text' : 'password'}
                className="text-sm mt-1 outline-none block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-input focus:ring-blue-500 focus:border-blue-500"
                placeholder="**********"
                value={formData.currentPassword}
                onChange={handleInputChange}
                disabled={!isEditMode}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-8"
              >
                {passwordVisible ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="relative">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New password
              </label>
              <input
                id="newPassword"
                type={passwordVisible ? 'text' : 'password'}
                className="text-sm mt-1 outline-none block w-full p-2 border border-gray-300 rounded-md bg-input shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="**********"
                value={formData.newPassword}
                onChange={handleInputChange}
                disabled={!isEditMode}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-8"
              >
                {passwordVisible ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 mt-8">
          <button
            type="button"
            className="text-sm px-16 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            onClick={handleDiscardChanges}
          >
            Discard
          </button>
          <button
            type="submit"
            className="text-sm px-16 py-2 bg-button-bg text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={!hasChanges || isUpdating || !isEditMode}
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
}