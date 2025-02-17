import { CollectionConfig, FieldAccess, PayloadRequest } from 'payload';
import { User } from '@/payload-types';

const isAdmin: FieldAccess<User, PayloadRequest> = ({ req }) => {
  return req.user?.role === 'admin';
};

const isSelfOrAdmin: FieldAccess<User, PayloadRequest> = ({ req, id }) => {
  return req.user?.id === id?.toString() || req.user?.role === 'admin';
};

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  timestamps: true,

  access: {
    create: (): boolean => true,
    read: isAdmin,
    update: isSelfOrAdmin,
    delete: isAdmin,
  },

  admin: {
    defaultColumns: ['name', 'email', 'role'], // Include 'name' in the default columns
    useAsTitle: 'name', // Use 'name' as the title field
  },

  fields: [
    {
      name: 'firstname',
      type: 'text',
      required: true,
    },
    {
      name: 'lastname',
      type: 'text',
      required: true,
    },
    {
      name: 'name', // Add the 'name' field
      type: 'text',
      admin: {
        readOnly: true, // Make the field read-only in the admin UI
        hidden: false, // Show the field in the admin UI
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            // Check if data is defined
            if (data) {
              // Concatenate firstname and lastname to create the name
              return `${data.firstname} ${data.lastname}`;
            }
            // Return an empty string or handle the undefined case
            return '';
          },
        ],
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'User', value: 'user' },
        { label: 'Admin', value: 'admin' },
      ],
      defaultValue: 'user',
      required: true,
      access: {
        create: isAdmin,
        update: isAdmin,
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],

  hooks: {
    beforeChange: [
      ({ data }) => {
        // Ensure the name is updated whenever firstname or lastname changes
        if (data && data.firstname && data.lastname) {
          data.name = `${data.firstname} ${data.lastname}`;
        }
        return data;
      },
    ],
  },
};