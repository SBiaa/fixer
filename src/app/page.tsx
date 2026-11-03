import { AccountMenu } from '@/components/AccountMenu';
import { LocalWizard } from '@/components/wizard/LocalWizard';

export default function Home() {
  return <LocalWizard account={<AccountMenu showMyCharacters />} />;
}
