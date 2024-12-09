import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Check, ArrowRight, Activity, ExternalLink } from 'lucide-react';
import { PaintBucket, Palette } from 'lucide-react';

const ProductLanding = () => {
  const [showNotLaunched, setShowNotLaunched] = useState(false);
  const [email, setEmail] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [sessionStartTime] = useState(Date.now());

  // Track session duration
  useEffect(() => {
    const trackSessionDuration = () => {
      const duration = (Date.now() - sessionStartTime) / 1000; // Convert to seconds
      // @ts-ignore
      window.gtag('event', 'session_ended', { 
        duration_seconds: duration 
      });
    };

    window.addEventListener('beforeunload', trackSessionDuration);
    return () => window.removeEventListener('beforeunload', trackSessionDuration);
  }, [sessionStartTime]);

  // Handle scroll effects and tracking
  useEffect(() => {
    let lastTrackTime = 0;
    const scrollThreshold = 100;
    let lastScrollY = 0;

    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Track significant scroll events (throttled)
      const now = Date.now();
      if (now - lastTrackTime > 1000) {
        const scrollDifference = Math.abs(window.scrollY - lastScrollY);
        if (scrollDifference > scrollThreshold) {
          // @ts-ignore
          window.gtag('event', 'scroll', {
            scroll_depth: Math.round(window.scrollY),
            scroll_percentage: Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100)
          });
          lastTrackTime = now;
          lastScrollY = window.scrollY;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Utility function for scroll animations
  const getScrollAnimation = (startPos) => {
    const offset = Math.max(0, Math.min(1, (scrollY - startPos) / 500));
    return {
      opacity: offset,
      transform: `translateY(${20 - (offset * 20)}px)`
    };
  };

  const trackEvent = (eventName, params = {}) => {
    // @ts-ignore
    window.gtag('event', eventName, params);
  };

  const CheckoutPage = () => {
    const handleCardInput = (field) => {
      trackEvent('payment_input_attempt', { field });
      setShowNotLaunched(true);
    };

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Complete Your Purchase</h2>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="flex justify-between mb-2">
              <span>Adaptive Pulse Oximeter</span>
              <span>$19.99</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>$19.99</span>
            </div>
          </div>
    
          <div className="space-y-4">
            <div>
              <Label htmlFor="card">Card Number</Label>
              <Input
                id="card"
                type="text"
                placeholder="4242 4242 4242 4242"
                onFocus={() => handleCardInput('card_number')}
                className="cursor-not-allowed"
              />
            </div>
    
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry</Label>
                <Input
                  id="expiry"
                  type="text"
                  placeholder="MM/YY"
                  onFocus={() => handleCardInput('expiry')}
                  className="cursor-not-allowed"
                />
              </div>
              <div>
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  type="text"
                  placeholder="123"
                  onFocus={() => handleCardInput('cvc')}
                  className="cursor-not-allowed"
                />
              </div>
            </div>
    
            <Button 
              className="w-full"
              onClick={() => {
                trackEvent('purchase_attempt');
                setShowNotLaunched(true);
              }}
            >
              Complete Purchase
            </Button>
          </div>
    
          {showNotLaunched && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">Coming Soon!</h3>
                <p className="text-gray-600 mb-4">
                  We're still in development and perfecting our technology. Join our waitlist to be first in line when we launch!
                </p>
                <Button 
                  className="w-full"
                  onClick={() => {
                    trackEvent('return_to_homepage');
                    setShowNotLaunched(false);
                    setCheckoutStep(0);
                  }}
                >
                  Return to Homepage
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const MainContent = () => (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />
        <div className="relative z-10 text-white text-center px-4">
          <h1 className="text-5xl sm:text-6xl font-bold mb-8 animate-fade-in">
            Redefining Pulse Oximetry
          </h1>
          <p className="text-xl sm:text-2xl max-w-3xl mx-auto text-gray-200">
            Accurate readings for every skin tone
          </p>
        </div>
      </section>

      {/* Statistics Section with Fade-in */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 mb-16">
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                stat: "3x",
                desc: "Black patients are three times more likely to have dangerously low oxygen levels missed by current pulse oximeters"
              },
              {
                stat: "11.7%",
                desc: "Nearly 1 in 8 Black patients with normal-looking readings actually have concerning low oxygen levels"
              },
              {
                stat: "3.56%",
                desc: "Current devices can overestimate oxygen levels in dark skin tones, potentially delaying critical care"
              }
            ].map((item, i) => (
              <div 
                key={i}
                className="bg-gray-50 p-6 rounded-xl shadow-lg transform transition-all duration-500 hover:scale-105"
                style={getScrollAnimation(400 + i * 100)}
                onClick={() => trackEvent('stat_card_click', { stat: item.stat })}
              >
                <div className="text-4xl font-bold text-blue-600 mb-4">{item.stat}</div>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Explanation with Sliding Animations */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16" style={getScrollAnimation(800)}>
            Our Innovation
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div 
              className="space-y-8"
              style={getScrollAnimation(900)}
            >
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Dual-Spectral Analysis</h3>
                  <p className="text-gray-600">Traditional red and infrared light measurement combined with our advanced calibration system for superior accuracy and reliability in all skin tones</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Optical Skin Tone Recognition</h3>
                  <p className="text-gray-600">Dedicated optical sensor utilizing the Munsell value scale to deliver precise and consistent skin tone classification across diverse populations</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <PaintBucket className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Advanced Color Perception</h3>
                  <p className="text-gray-600">Harnessing Munsell's perceptually uniform color space to achieve consistent and accurate color measurements across the full spectrum of skin tones</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Custom Calibration</h3>
                  <p className="text-gray-600">Proprietary algorithms dynamically adapt measurements based on real-time skin tone detection, ensuring optimal accuracy for every individual</p>
                </div>
              </div>
            </div>
            <div 
              className="grid grid-cols-3 gap-2 p-8 bg-white rounded-xl shadow-lg"
              style={getScrollAnimation(1000)}
            >
              {['bg-[#FFDECB]', 'bg-[#E3B38C]', 'bg-[#C69776]', 'bg-[#A67852]', 'bg-[#865C3E]', 'bg-[#513127]'].map((color, i) => (
                <div 
                  key={i} 
                  className={`h-24 rounded-lg transform transition-all duration-500 hover:scale-105 ${color}`}
                  style={{
                    transition: 'all 0.3s ease',
                    transform: `translateY(${Math.sin((scrollY + i * 100) / 200) * 10}px)`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pre-order Section with Float Animation */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card 
            className="max-w-md mx-auto transform hover:scale-105 transition-all duration-300"
            style={{
              animation: 'float 6s ease-in-out infinite',
            }}
          >
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">Be Part of the Change</h2>
              <div className="text-3xl font-bold text-blue-600">$19.99</div>
              <ul className="text-left space-y-2">
                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> Triple-sensor technology</li>
                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> Custom skin tone calibration</li>
                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> Medical-grade accuracy</li>
              </ul>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  trackEvent('pre_order_click');
                  setCheckoutStep(1);
                }}
              >
                Pre-order Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );

  return (
    <>
      {checkoutStep === 0 ? <MainContent /> : <CheckoutPage />}
    </>
  );
};

export default ProductLanding;