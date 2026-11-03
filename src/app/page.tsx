import { AccountMenu } from '@/components/AccountMenu';
import { Wizard } from '@/components/wizard/Wizard';

export default function Home() {
  return <Wizard account={<AccountMenu />} />;
}
