import sanityClient from '@sanity/client';

export const client = sanityClient({
  projectId: '66qsptfk',
  dataset: 'production',
  apiVersion: '2024-02-27',
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});
