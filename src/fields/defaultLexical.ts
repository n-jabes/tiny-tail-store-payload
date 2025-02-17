import { Config } from 'payload';
import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  ParagraphFeature,
  lexicalEditor,
  UnderlineFeature,
} from '@payloadcms/richtext-lexical';

export const defaultLexical: Config['editor'] = lexicalEditor({
  features: () => {
    return [
      ParagraphFeature(),
      UnderlineFeature(),
      BoldFeature(),
      ItalicFeature(),
      LinkFeature({
        enabledCollections: ['pages', 'posts'],
        fields: ({ defaultFields }) => {
          // Filter out the default 'url' field
          const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
            if ('name' in field && field.name === 'url') return false;
            return true;
          });

          // Return the modified fields array
          return [
            ...defaultFieldsWithoutUrl,
            {
              name: 'url',
              type: 'text',
              admin: {
                condition: ({ linkType }: { linkType: string }) => linkType !== 'internal',
              },
              label: ({ t }: { t: (key: string) => string }) => t('fields:enterURL'),
              required: true,
              validate: (value: string, options: { siblingData?: { linkType?: string } }) => {
                if (options?.siblingData?.linkType === 'internal') {
                  return true; // No validation needed for internal links
                }
                return value ? true : 'URL is required';
              },
            },
          ];
        },
      }),
    ];
  },
});