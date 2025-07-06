import Head from 'next/head';

type Props = {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string;
};

const MetaTag = ({
  title = 'CoinAT',
  description = '',
  image = '',
  keywords = '',
}: Props) => (
  <Head>
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <meta name="title" content={title} />
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    <meta name="author" content="danyj" />

    {/* Open Graph / Facebook */}
    <meta property="og:type" content="website" />
    <meta property="og:url" content="" />
    <meta property="og:title" content={title} />
    <meta property="og:image" content={image} />
    <meta property="og:description" content={description} />
    <meta property="og:site_name" content={title} />

    {/* Twitter */}
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="" />
    <meta name="twitter:title" content={title} />
    <meta property="twitter:description" content={description} />
    <meta property="twitter:image" content={image} />
    <title>{title}</title>
  </Head>
);
export default MetaTag;
