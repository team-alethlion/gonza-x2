import React from "react";
import { Card } from "flowbite-react";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { CONFIG } from "../../config";

const ContactSection = () => {
  return (
    <section className="bg-[#F1F0FB] dark:bg-[#0B1326] py-16 lg:py-24 transition-colors duration-300">
      <div className="max-w-screen-xl px-4 mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-[#252861] dark:text-white">
            We're here to help
          </h2>
          <p className="text-gray-500 dark:text-[#dadbf1]/80 sm:text-xl max-w-2xl mx-auto">
            Have a question, need a demo, or want to discuss pricing? Reach out
            — our team responds fast.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
          {/* Phone Card */}
          <Card className="hover:shadow-2xl transition-all duration-300 dark:bg-white/5 dark:border-white/10 group">
            <div className="flex flex-col items-center text-center">
              <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-lg bg-[#F1F0FB] dark:bg-white/10 text-[#252861] dark:text-[#9b87f5] group-hover:bg-[#f05a2b] group-hover:text-white dark:group-hover:bg-[#9b87f5] dark:group-hover:text-[#0B1326] transition-colors duration-300">
                <HiOutlinePhone className="w-6 h-6" />
              </div>
              <h3 className="mb-2 text-2xl font-bold tracking-tight text-[#0B1326] dark:text-white">
                Call us
              </h3>
              <p className="mb-4 font-light text-gray-500 dark:text-[#dadbf1]/60">
                Speak directly with our support team for urgent inquiries.
              </p>
              <a
                href={`tel:${CONFIG.APP.SUPPORT_PHONE}`}
                className="inline-flex items-center text-[#f05a2b] dark:text-[#9b87f5] hover:underline font-bold text-xl transition-colors">
                {CONFIG.APP.SUPPORT_PHONE.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')}
              </a>
            </div>
          </Card>

          {/* Email Card */}
          <Card className="hover:shadow-2xl transition-all duration-300 dark:bg-white/5 dark:border-white/10 group">
            <div className="flex flex-col items-center text-center">
              <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-lg bg-[#F1F0FB] dark:bg-white/10 text-[#252861] dark:text-[#9b87f5] group-hover:bg-[#f05a2b] group-hover:text-white dark:group-hover:bg-[#9b87f5] dark:group-hover:text-[#0B1326] transition-colors duration-300">
                <HiOutlineMail className="w-6 h-6" />
              </div>
              <h3 className="mb-2 text-2xl font-bold tracking-tight text-[#0B1326] dark:text-white">
                Email us
              </h3>
              <p className="mb-4 font-light text-gray-500 dark:text-[#dadbf1]/60">
                Drop us an email and we'll get back to you within 24 hours.
              </p>
              <a
                href={`mailto:${CONFIG.APP.SUPPORT_EMAIL}`}
                className="inline-flex items-center text-[#f05a2b] dark:text-[#9b87f5] hover:underline font-bold transition-colors">
                {CONFIG.APP.SUPPORT_EMAIL}
              </a>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
