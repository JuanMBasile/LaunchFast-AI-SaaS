import { useTranslation } from 'react-i18next';

export default function SkipToContent() {
  const { t } = useTranslation();
  return (
    <a
      href="#main-content"
      className="absolute top-4 left-4 -translate-y-[200%] focus:translate-y-0 z-100 bg-primary-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 transition-transform"
    >
      {t('a11y.skipToContent')}
    </a>
  );
}
