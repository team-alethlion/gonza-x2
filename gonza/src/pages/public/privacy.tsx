import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-[#252861] dark:text-white sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Last Updated: May 18, 2025
          </p>
        </div>

        <div className="prose prose-blue dark:prose-invert max-w-none space-y-12">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-[#252861] dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
              Introduction
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Gonza Systems ("we," "our," or "us") respects your privacy and is
              committed to protecting it through our compliance with this policy.
              This policy describes the types of information we may collect from
              you or that you may provide when you use our business management
              application (the "App") and our practices for collecting, using,
              maintaining, protecting, and disclosing that information.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-[#252861] dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
              Information We Collect
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Personal Information
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  We may collect several types of information from and about users
                  of our App, including:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                  <li>Your name, email address, and contact information</li>
                  <li>Business information such as business name, address, and tax information</li>
                  <li>Information about your customers that you input into the App</li>
                  <li>Information about your inventory, sales, and expenses</li>
                  <li>Authentication credentials</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Usage Information
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  We may also collect information about how you access and use our App, including:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                  <li>Usage details, such as features accessed and time spent on the App</li>
                  <li>Device information, such as your device type, operating system, and browser type</li>
                  <li>Location data</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-[#252861] dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
              How We Use Your Information
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We use information that we collect about you or that you provide to us:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>To provide, maintain, and improve our App</li>
              <li>To process transactions and send related information</li>
              <li>To provide customer support</li>
              <li>To send administrative notifications, such as updates or security alerts</li>
              <li>To personalize your experience</li>
              <li>To analyze usage patterns and trends</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-[#252861] dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
              Data Security
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We have implemented measures designed to secure your personal
              information from accidental loss and from unauthorized access, use,
              alteration, and disclosure. All information you provide to us is
              stored on secure servers behind firewalls.
              <br /><br />
              The safety and security of your information also depends on you. We
              urge you to be careful about sharing your login credentials and
              selecting strong passwords.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-[#252861] dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
              Data Retention
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We will retain your personal information for as long as necessary to
              fulfill the purposes for which it was collected, including to satisfy
              any legal, accounting, or reporting requirements.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-[#252861] dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
              Your Rights
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Depending on your location, you may have certain rights regarding
              your personal information, including:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>The right to access your personal information</li>
              <li>The right to correct inaccurate or incomplete information</li>
              <li>The right to deletion of your personal information</li>
              <li>The right to restrict processing of your personal information</li>
              <li>The right to data portability</li>
            </ul>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              To exercise any of these rights, please contact us at{" "}
              <a href="mailto:gonzabrands@gmail.com" className="text-[#f05a2b] hover:underline font-semibold">
                gonzabrands@gmail.com
              </a>.
            </p>
          </section>

          {/* Changes to Our Privacy Policy */}
          <section>
            <h2 className="text-2xl font-bold text-[#252861] dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
              Changes to Our Privacy Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We may update our privacy policy from time to time. If we make
              material changes, we will notify you through the App or by email.
              The date the privacy policy was last revised is identified at the
              top of this page.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-[#F1F0FB] dark:bg-white/5 p-8 rounded-2xl border border-gray-100 dark:border-white/10">
            <h2 className="text-2xl font-bold text-[#252861] dark:text-white mb-4">
              Contact Information
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              To ask questions or comment about this privacy policy and our
              privacy practices, contact us at:
            </p>
            <a
              href="mailto:gonzabrands@gmail.com"
              className="inline-flex items-center text-xl font-bold text-[#f05a2b] dark:text-[#9b87f5] hover:underline transition-colors">
              gonzabrands@gmail.com
            </a>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
