import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';

export const withStaticTranslations = (namespaces: string[] = ['common']): GetStaticProps =>
    async ({ locale }) => {
        return {
            props: {
                ...(await serverSideTranslations(locale || 'en', namespaces)),
            },
        };
    };


// @ts-ignore
export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    };
}