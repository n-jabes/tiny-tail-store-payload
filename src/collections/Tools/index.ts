import { CollectionConfig, FieldAccess, PayloadRequest } from 'payload';
import { User } from '@/payload-types';

const isAdmin: FieldAccess<User, PayloadRequest> = ({ req }) => {
  return req.user?.role === 'admin';
};

export const Tools: CollectionConfig = {
  slug: 'tools',
  timestamps: true,

  access: {
    create: isAdmin, // Only admins can create tools
    read: () => true, // All users can read tools
    update: isAdmin, // Only admins can update tools
    delete: isAdmin, // Only admins can delete tools
  },

  admin: {
    defaultColumns: ['title', 'description', 'image'],
    useAsTitle: 'title',
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'likes',
      type: 'array',
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
        },
      ],
    },
    {
      name: 'enrolled',
      type: 'array',
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
        },
      ],
    },
  ],
};