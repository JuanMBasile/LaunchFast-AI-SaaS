import { Helmet } from 'react-helmet-async';

interface PageTitleProps {
  title: string;
  description?: string;
}

const APP_NAME = 'LaunchFast AI';

export default function PageTitle({ title, description }: PageTitleProps) {
  const fullTitle = title ? `${title} | ${APP_NAME}` : APP_NAME;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
}
