import React, { useState, useCallback, useEffect } from 'react';
import { TOTAL_PAGES as DEFAULT_TOTAL_PAGES } from './constants';
import Navigation from './components/Navigation';
import Header from './components/Header';
import Page1Hero from './components/Page1Hero';
import Page2Churrascos from './components/Page2Churrascos';
import Page3Fajitas from './components/Page3Fajitas';
import Page4DrinksSocials from './components/Page4DrinksSocials';
import Page5Custom from './components/Page5Custom'; // Renders any custom page
import PrintableView from './components/PrintableView';
import MysteryAssistantButton from './components/MysteryAssistantButton';
import MysteryAssistant from './components/MysteryAssistant';
import { FinalizedOrder, PartialOrder, MenuData } from './types';
import OrderConfirmation from './components/OrderConfirmation';
import PastOrders from './components/PastOrders';
import { menuService } from './services/menuService';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isPrintView, setIsPrintView] = useState<boolean>(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [finalizedOrder, setFinalizedOrder] = useState<FinalizedOrder | null>(null);
  const [isPastOrdersOpen, setIsPastOrdersOpen] = useState<boolean>(false);
  const [partialOrder, setPartialOrder] = useState<PartialOrder | null>(null);
  const [menuData, setMenuData] = useState<MenuData | null>(null);

  useEffect(() => {
    // Load menu data on component mount
    const data = menuService.getMenu();
    setMenuData(data);
  }, []);
  
  useEffect(() => {
    // Smooth scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const enabledCustomPages = menuData?.customPages?.filter(p => p.enabled) || [];
  const totalPages = DEFAULT_TOTAL_PAGES + enabledCustomPages.length;


  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const goToPrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const togglePrintView = useCallback(() => {
    setIsPrintView(prev => !prev);
  }, []);

  const toggleAssistant = useCallback(() => {
    if (isAssistantOpen) {
      setPartialOrder(null);
    }
    setIsAssistantOpen(prev => !prev);
  }, [isAssistantOpen]);
  
  const togglePastOrders = useCallback(() => {
    setIsPastOrdersOpen(prev => !prev);
  }, []);

  const handleFinalizeOrder = useCallback((order: FinalizedOrder) => {
    const pastOrders = JSON.parse(localStorage.getItem('scoobySabrosoOrders') || '[]') as FinalizedOrder[];
    pastOrders.unshift(order);
    localStorage.setItem('scoobySabrosoOrders', JSON.stringify(pastOrders));

    setFinalizedOrder(order);
    setIsAssistantOpen(false);
    setPartialOrder(null);
  }, []);

  const handleNewOrder = useCallback(() => {
    setFinalizedOrder(null);
    setCurrentPage(1);
  }, []);

  const handleStartUpsell = useCallback((order: PartialOrder) => {
    setPartialOrder(order);
    setIsAssistantOpen(true);
  }, []);

  const renderPage = () => {
    if (!menuData) {
      return <div>Cargando menú...</div>;
    }
    
    if (currentPage === 1) return <Page1Hero />;
    if (currentPage === 2) return <Page2Churrascos />;
    if (currentPage === 3) return <Page3Fajitas onConfirmFajita={handleStartUpsell} />;
    if (currentPage === 4) return <Page4DrinksSocials onConfirmDrinks={handleStartUpsell} />;
    
    const enabledCustomPages = menuData.customPages?.filter(p => p.enabled) || [];
    const customPageIndex = currentPage - DEFAULT_TOTAL_PAGES - 1;

    if (customPageIndex >= 0 && customPageIndex < enabledCustomPages.length) {
        const pageData = enabledCustomPages[customPageIndex];
        return <Page5Custom customPageData={pageData} />;
    }

    return <Page1Hero />; // Fallback
  };

  if (finalizedOrder) {
    return (
      <main className="text-white min-h-screen antialiased font-roboto printable-container">
        <div className="relative mx-auto max-w-2xl w-full bg-black/70 backdrop-blur-sm shadow-lg min-h-screen flex items-center justify-center p-4 print-wrapper">
          <OrderConfirmation order={finalizedOrder} onNewOrder={handleNewOrder} />
        </div>
      </main>
    );
  }
  
  if (!menuData) {
      return (
        <main className="text-white min-h-screen antialiased font-roboto flex items-center justify-center">
            <div className="font-lilita text-2xl text-scooby-yellow">Cargando el misterio del sabor...</div>
        </main>
      );
  }

  return (
    <main className="text-white min-h-screen antialiased font-roboto printable-container">
      <div className="relative mx-auto max-w-2xl w-full bg-black/70 backdrop-blur-sm shadow-lg min-h-screen flex flex-col">
        {isPrintView ? (
          <PrintableView onExitPrintView={togglePrintView} />
        ) : (
          <>
            <Header onShowHistory={togglePastOrders} onTogglePrintView={togglePrintView} />
            <div className="flex-grow">
              <div className="p-4 md:p-6">
                {renderPage()}
              </div>
            </div>
            <Navigation
              currentPage={currentPage}
              totalPages={totalPages}
              onNext={goToNextPage}
              onPrev={goToPrevPage}
            />
            <MysteryAssistantButton onClick={toggleAssistant} />
            {isAssistantOpen && <MysteryAssistant onClose={toggleAssistant} onFinalizeOrder={handleFinalizeOrder} partialOrder={partialOrder} />}
            {isPastOrdersOpen && <PastOrders onClose={togglePastOrders} />}
          </>
        )}
      </div>
    </main>
  );
};

export default App;