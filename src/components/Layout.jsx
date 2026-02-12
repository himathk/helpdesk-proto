import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import Grainient from './Grainient';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const Layout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden font-sans selection:bg-ice-200 selection:text-navy-900">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 -z-10 bg-white">
        <Grainient
            color1="#cde6f6ff"
            color2="#c1d7feff" // #005eb8 at ~15% opacity
            color3="#abafecff" // #005eb8 at ~30% opacity
            timeSpeed={0.25}
            colorBalance={-0.22}
            warpStrength={1.95} 
            warpFrequency={2.3}
            warpSpeed={1.6}
            warpAmplitude={50}
            blendAngle={0}
            blendSoftness={0.62}
            rotationAmount={500}
            noiseScale={4}
            grainAmount={0}
            grainScale={0.2}
            grainAnimated={false}
            contrast={1.5}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={0.9}
        />
      </div>

      <Navbar isHome={isHome} />

      {/* Main Content Area */}
      <div className={`flex flex-col min-h-screen ${!isHome ? 'pt-16' : ''}`}> {/* pt-16 for navbar height on app mode */}
        
        {/* Sidebar - Only on App Mode */}
        <AnimatePresence>
            {!isHome && (
                <Sidebar 
                    isCollapsed={isSidebarCollapsed} 
                    toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                />
            )}
        </AnimatePresence>

        <main 
            className={`flex-grow flex flex-col transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${!isHome ? (isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72') : 'lg:pl-0'}`}
        >
           <AnimatePresence>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex-grow w-full"
            >
              <div className={`w-full mx-auto transition-all duration-500 ${isHome ? 'max-w-7xl px-4 sm:px-6 lg:px-8 py-24' : 'max-w-[1600px] px-8 py-8'}`}>
                  <Outlet />
              </div>
            </motion.div>
          </AnimatePresence>
          
          <Footer />
        </main>

      </div>
    </div>
  );
};

export default Layout;
