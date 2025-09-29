import { Chat } from '@/components/pages/Chat';
import { Dashboard } from '@/components/pages/Dashboard';
import { Email } from '@/components/pages/Email';
import { ITruckr } from '@/components/pages/ITruckr';
import { Loads } from '@/components/pages/Loads';
import { Payments } from '@/components/pages/Payments';
import { Registration } from '@/components/pages/Registration';
import { CallForm } from '@/components/pages/CallForm';
import { useNavigation } from '@/contexts/NavigationContext';

import { Loadboard } from '../pages/Loadboard';
import Whatsapp from '../pages/watsapp';

export function MainContent() {
  const { activePage } = useNavigation();

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'iTruckr':
        return <ITruckr />;
      case 'loadboard':
        return <Loadboard />;
      case 'loads':
        return <Loads />;
      case 'payments':
        return <Payments />;
      case 'registration':
        return <Registration />;
      case 'chat':
        return <Chat />;
      case 'email':
        return <Email />;
      case 'call-form':
        return <CallForm />;
      case 'whatsapp':
        return <Whatsapp />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <main className='flex-1 overflow-y-auto rounded-tl-xl pl-4 pt-4 lg:pl-6 lg:pt-6 transition-all duration-300'>
      {renderPage()}
    </main>
  );
}
