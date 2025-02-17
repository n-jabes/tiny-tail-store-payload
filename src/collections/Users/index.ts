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
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
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
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
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
};