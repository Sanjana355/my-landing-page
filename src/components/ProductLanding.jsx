import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sparkles, Wand2, Layers, Settings2, LucideSettings2, Component } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import { track } from '@vercel/analytics';

const MosaicBackground = () => {
  const cellSize = 120;
  const cols = Math.ceil(8000 / cellSize);
  const rows = Math.ceil(4800 / cellSize);
  
  const colors = [
    'rgb(255, 228, 215)',
    'rgb(255, 218, 185)',
    'rgb(255, 222, 173)',
    'rgb(222, 184, 135)',
    'rgb(205, 170, 125)',
    'rgb(193, 154, 107)',
    'rgb(160, 120, 90)',
    'rgb(139, 100, 69)',
    'rgb(111, 78, 55)'
  ];

  const cells = [];
  
  for (let row = -1; row < rows + 1; row++) {
    for (let col = -1; col < cols + 1; col++) {
      const centerX = col * cellSize * 0.8;
      const centerY = row * cellSize * 0.8;
      
      const progress = (col + row/2) / (cols + rows/2);
      const colorIndex = Math.min(Math.floor(progress * colors.length), colors.length - 1);
      
      const radius = (cellSize / 1.5) * (0.95 + Math.random() * 0.1);
      
      cells.push({
        cx: centerX,
        cy: centerY,
        r: radius,
        color: colors[colorIndex]
      });
    }
  }

  return (
    <svg 
      className="fixed top-0 left-0 w-[200vw] h-[200vh]"
      viewBox="0 0 8000 4800" 
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: 'translate(-25%, -25%)',
        minWidth: '200vw',
        minHeight: '200vh'
      }}
    >
      <rect width="8000" height="4800" fill="white" />
      {cells.map((cell, i) => (
        <circle
          key={i}
          cx={cell.cx}
          cy={cell.cy}
          r={cell.r}
          fill={cell.color}
          opacity="0.8"
        />
      ))}
    </svg>
  );
};

const PriorityDialog = ({ open, onOpenChange, onReturnHome }) => {
  useEffect(() => {
    if (open) {
      track('priority_list_shown');
    }
  }, [open]);

  const handleClose = () => {
    onOpenChange(false);
    onReturnHome();
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <div className="p-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Component className="h-8 w-8 text-black animate-spin-slow" />
          </div>
          <p className="text-black mb-6 text-center">
            We're currently finalizing the design of our system
          </p>
          <Button 
            className="w-full bg-black text-white hover:bg-gray-800"
            onClick={handleClose}
          >
            Return to Homepage
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ProductLanding = () => {
  const [showNotLaunched, setShowNotLaunched] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState([]);
  const [pageLoadTime, setPageLoadTime] = useState(Date.now());

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setAnimatedStats(prev => {
        if (prev.length < 3) {
          return [...prev, prev.length];
        }
        clearInterval(timer);
        return prev;
      });
    }, 200);

    // Track initial page load
    track('page_view', {
      page: currentPage === 0 ? 'home' : 'technology'
    });

    // Reset page load time when page changes
    setPageLoadTime(Date.now());

    return () => {
      // Track time spent on page when component unmounts or page changes
      const timeSpent = (Date.now() - pageLoadTime) / 1000; // Convert to seconds
      track('page_time', {
        page: currentPage === 0 ? 'home' : 'technology',
        timeSpent: timeSpent
      });
      clearInterval(timer);
    };
  }, [currentPage]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageTransition = () => {
    track('button_click', {
      button: 'learn_more'
    });
    setCurrentPage(1);
    scrollToTop();
  };

  const handleReturnHome = () => {
    setCurrentPage(0);
    setAnimatedStats([]);
    setTimeout(() => {
      const timer = setInterval(() => {
        setAnimatedStats(prev => {
          if (prev.length < 3) {
            return [...prev, prev.length];
          }
          clearInterval(timer);
          return prev;
        });
      }, 200);
    }, 100);
    scrollToTop();
  };

  const stats = [
    {
      stat: "3x",
      highlight: "Higher Risk",
      desc: "Black patients are three times more likely to have their low oxygen levels missed"
    },
    {
      stat: "11.7%",
      highlight: "Critical Oversight",
      desc: "Nearly 1 in 8 Black patients with normal-looking readings actually have concerning low oxygen levels"
    },
    {
      stat: "3.56%",
      highlight: "Measurement Gap",
      desc: "Current devices can overestimate oxygen levels in dark skin tones, potentially delaying critical care"
    }
  ];

  const HomePage = () => (
    <div className="min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 pt-20">
        <div className="text-center mb-16">
          <h1 
            className="text-5xl sm:text-7xl font-bold leading-tight text-black"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            Precision for
            <div className="text-black">
             Every Patient
            </div>
          </h1>
          <p 
            className="text-xl text-black max-w-2xl mx-auto mt-6"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s'
            }}
          >
            A pulse oximeter designed to provide consistent accuracy across all skin tones, ensuring every patient receives the precise care they deserve
          </p>
          <Button 
            className="mt-8 bg-black text-white hover:bg-gray-800 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handlePageTransition}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s'
            }}
          >
            Learn More
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-8 mb-8">
            {stats.slice(0, 2).map((item, i) => (
              <div
                key={i}
                className="transform transition-all duration-1000"
                style={{
                  opacity: animatedStats.includes(i) ? 1 : 0,
                  transform: `translateX(${animatedStats.includes(i) ? '0' : (i === 0 ? '-100vw' : '100vw')})`,
                  transition: 'all 1s ease-out'
                }}
              >
                <Card className="bg-white/80 backdrop-blur hover:shadow-lg transition-all duration-300 border-none">
                  <div className="p-6">
                    <div className="text-4xl font-bold text-black mb-2">
                      {item.stat}
                    </div>
                    <h3 className="text-xl font-semibold text-black mb-1">{item.highlight}</h3>
                    <p className="text-black">{item.desc}</p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
          <div className="max-w-md mx-auto">
            {stats.slice(2).map((item, i) => (
              <div
                key={i + 2}
                className="transform transition-all duration-1000"
                style={{
                  opacity: animatedStats.includes(i + 2) ? 1 : 0,
                  transform: `translateX(${animatedStats.includes(i + 2) ? '0' : '100vw'})`,
                  transition: 'all 1s ease-out'
                }}
              >
                <Card className="bg-white/80 backdrop-blur hover:shadow-lg transition-all duration-300 border-none">
                  <div className="p-6">
                    <div className="text-4xl font-bold text-black mb-2">
                      {item.stat}
                    </div>
                    <h3 className="text-xl font-semibold text-black mb-1">{item.highlight}</h3>
                    <p className="text-black">{item.desc}</p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const TechnologyPage = () => (
    <div className="min-h-screen relative bg-white">
      <div className="absolute inset-0 bg-white/90" />
      <div className="relative max-w-7xl mx-auto px-4 pt-20">
        <Button 
          className="mb-12 bg-black text-white hover:bg-gray-800"
          onClick={handleReturnHome}
        >
          ← Return to Homepage
        </Button>

        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-black mb-6">
            Revolutionary
            <span className="block text-black">
              Technology
            </span>
          </h2>
          <p className="text-xl text-black max-w-2xl mx-auto">
            Our custom calibration integrated platform ensures accurate readings for everyone, regardless of skin tone.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Wand2,
              title: "Dual-Spectral Analysis",
              desc: "Traditional red and infrared light measurement combined with our advanced calibration system for superior accuracy"
            },
            {
              icon: Layers,
              title: "Optical Skin Tone Recognition",
              desc: "Dedicated optical sensor utilizing the Munsell value scale to deliver precise and consistent skin tone classification"
            },
            {
              icon: Sparkles,
              title: "Custom Calibration",
              desc: "Proprietary algorithms dynamically adapt measurements based on real-time skin tone detection, ensuring optimal accuracy for every individual"
            }
          ].map((feature, i) => (
            <Card key={i} className="bg-white/80 backdrop-blur hover:shadow-lg transition-all duration-300 border-none">
              <div className="p-6">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">{feature.title}</h3>
                <p className="text-black">{feature.desc}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center">
        <Card className="bg-black text-white">
            <div className="p-8">
              <h3 className="text-3xl font-bold mb-4">Pre-order Now</h3>
              <p className="text-lg mb-6 opacity-90">
                Join the medical revolution and be among the first to provide equitable care with our breakthrough technology.
              </p>
              <Button 
                className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-6 rounded-full"
                onClick={() => {
                  track('button_click', {
                    button: 'reserve_yours'
                  });
                  setShowNotLaunched(true);
                }}
              >
                Reserve Yours Today
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const handleDialogClose = () => {
    setShowNotLaunched(false);
    setCurrentPage(0);
    scrollToTop();
  };

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      <div className="fixed inset-0 w-full h-full min-h-screen">
        <MosaicBackground />
      </div>
      
      <div className="relative">
        {currentPage === 0 ? <HomePage /> : <TechnologyPage />}
      </div>

      <PriorityDialog 
        open={showNotLaunched}
        onOpenChange={setShowNotLaunched}
        onReturnHome={handleReturnHome}
      />
      <Analytics />
    </div>
  );
};

export default ProductLanding;