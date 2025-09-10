import { useEffect } from 'react';

import { MainContent } from '@/components/layout/MainContent';
import { SideBar } from '@/components/layout/SideBar';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { NavigationProvider } from '@/contexts/NavigationContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import './App.css';

// Initialize some demo data
import { useCasesStore } from '@/stores/casesStore';
import { useCompaniesStore } from '@/stores/companiesStore';
import { useConversationsStore } from '@/stores/conversationsStore';
import { useDriversStore } from '@/stores/driversStore';
import { useLoadsStore } from '@/stores/loadsStore';
import { useNotificationsStore } from '@/stores/notificationsStore';
import { useProcessesStore } from '@/stores/processesStore';
import { useTrucksStore } from '@/stores/trucksStore';

import { TitleBar } from './components/layout/TitleBar';
import LoginPage from './components/LoginPage';
import {
  DRIVER_1,
  DRIVER_ROBERT,
  LOAD_ROBERT,
  TRUCK_1,
  TRUCK_ROBERT,
} from './constants';
import { NotificationDefinitions } from './notifications/notificationDefinitions';
import RegisterPage from './components/pages/register/RegisterPage';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotificationsStore();
  const { createCase } = useCasesStore();
  const { getProcessById, setProcessCurrentStep } = useProcessesStore();
  const { addLoad } = useLoadsStore();
  const { addDriver, updateDriver } = useDriversStore();
  const { addCompany } = useCompaniesStore();
  const { addTruck } = useTrucksStore();
  const { addConversation } = useConversationsStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    addCompany({
      id: 'B-001',
      name: 'ABC Logistics',
      email: 'contact@abclogistics.com',
      phone: '(555) 111-2222',
      status: 'active',
      companyType: 'broker',
    });

    addCompany({
      id: 'C-001',
      name: 'ABC Carriers',
      email: 'contact@abclogistics.com',
      phone: '(555) 111-2222',
      status: 'active',
      companyType: 'carrier',
    });

    const truck1 = addTruck(TRUCK_1);
    const driver1 = addDriver(DRIVER_1);

    // Create Robert García and his truck + load for demo realistic preloaded case
    const truckRobert = addTruck(TRUCK_ROBERT);
    const driverRobert = addDriver(DRIVER_ROBERT);
    const loadRobert = addLoad(LOAD_ROBERT);

    updateDriver(driver1.id, { currentLoadId: null });
    updateDriver(driverRobert.id, { currentLoadId: loadRobert.id });

    const preloadedCase = createCase({
      step: 2,
      notificationId: '2',
      userId: '1',
      type: 'load_process',
      title: 'New Load for Driver Robert Garcia',
      description: 'Case for booking load for Driver Robert Garcia (D-200) with Truck (T-072)',
      relatedEntityId: driverRobert.id,
    });

    const preloadedProcess = preloadedCase.processId
      ? getProcessById(preloadedCase.processId)
      : undefined;
    const loadBookedStepId = preloadedProcess?.steps.find(
      s => s.name === 'load_booked'
    )?.id;
    if (preloadedProcess && loadBookedStepId) {
      setProcessCurrentStep(preloadedProcess.id, loadBookedStepId);
    }

    // 2) Usual notification to create a case for a full Load Process
    const loadProcessNotification =
      NotificationDefinitions.createNewLoadProcess({
        driver: driver1,
        truck: truck1,
        load: loadRobert, // keep demo consistent: new flow can propose another load later
      });

    const loadNotifTimeout = setTimeout(() => {
      addNotification({
        userId: '1',
        step: loadProcessNotification.step,
        type: loadProcessNotification.type,
        title: loadProcessNotification.title,
        message: loadProcessNotification.message,
        relatedEntityType: loadProcessNotification.relatedEntityType,
        relatedEntityId: driver1.id,
      });
    }, 6000);

    // 3) Oil Change notification after 5 minutes from page load
    const oilChangeDefinition = NotificationDefinitions.creatOilChangeNotification({
      driver: driverRobert,
      truck: truckRobert,
    });
    const oilNotifTimeout = setTimeout(() => {
      addNotification({
        userId: '1',
        step: oilChangeDefinition.step,
        type: oilChangeDefinition.type,
        title: oilChangeDefinition.title,
        message: oilChangeDefinition.message,
        relatedEntityType: oilChangeDefinition.relatedEntityType,
        relatedEntityId: driver1.id,
      });
    }, 5000);

    // Ensure chats exist for both drivers (John and Robert)
    addConversation('D-158', [{ timestamp: new Date() }] as any);
    addConversation('D-200', [{ timestamp: new Date() }] as any);
    return () => {
      clearTimeout(loadNotifTimeout);
      clearTimeout(oilNotifTimeout);
    };
  }, [isAuthenticated, addCompany, addTruck, addDriver, addLoad, updateDriver, addNotification, createCase, getProcessById, setProcessCurrentStep, addConversation]);

  if (!isAuthenticated) {
    const path = window.location.pathname;

    return (path === "/register") 
    ? <RegisterPage />
    : <LoginPage />;
  }

  return (
    <NavigationProvider>
      <TooltipProvider>
        <div className='h-screen p-3 rounded-sm overflow-hidden bg-custom-background grid grid-cols-1 lg:grid-rows-[auto_1fr] lg:grid-cols-[auto_1fr]'>
          <SideBar />
          <TitleBar />
          <MainContent />
          <Toaster />
        </div>
      </TooltipProvider>
    </NavigationProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
