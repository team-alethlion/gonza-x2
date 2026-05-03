import React from "react";

const MacbookMockup = () => {
  return (
    <section className="bg-white dark:bg-gray-900 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Laptop Screen Frame */}
        <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] md:border-[12px] rounded-t-xl h-[200px] max-w-[340px] md:h-[450px] md:max-w-[760px] lg:max-w-[900px] lg:h-[500px] shadow-2xl">
          <div className="rounded-lg overflow-hidden h-full bg-white dark:bg-gray-900 flex flex-col">
            
            {/* Browser Mockup Header */}
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 md:px-4 md:py-3 border-b border-gray-200 dark:border-gray-700">
              {/* Browser Dots */}
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              </div>
              {/* Browser Address Bar */}
              <div className="flex-1 max-w-md mx-auto">
                <div className="bg-white dark:bg-gray-700 rounded-md px-3 py-1 text-[10px] md:text-sm text-gray-500 dark:text-gray-300 flex items-center justify-center space-x-2 border border-gray-200 dark:border-gray-600 shadow-sm">
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-3.04l.592-.813a4.874 4.874 0 00-.745-6.517M6.75 10.45a4.501 4.501 0 018.25 0m7.5 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="truncate font-medium">gonzasystems.com</span>
                </div>
              </div>
              <div className="w-12 hidden md:block"></div> {/* Spacer for symmetry */}
            </div>

            {/* Browser Content Area (Image) */}
            <div className="flex-1 bg-gray-50 dark:bg-gray-800 relative group overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
                alt="Gonza Systems Dashboard Preview"
                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay highlight */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#252861]/10 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Laptop Base */}
        <div className="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl rounded-t-sm h-[12px] max-w-[380px] md:h-[24px] md:max-w-[850px] lg:max-w-[1000px] shadow-xl">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[60px] h-[4px] md:w-[120px] md:h-[10px] bg-gray-800"></div>
        </div>
      </div>
    </section>
  );
};

export default MacbookMockup;
