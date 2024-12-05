import FearGreed from '@/components/FearGreed';
import Page from './components/Page';

export default async function MainPage() {
  return (
    <div className="font-bold">
      <FearGreed />
      <Page />;
    </div>
  );
}
