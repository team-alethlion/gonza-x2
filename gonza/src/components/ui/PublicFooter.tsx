import React from "react";
import {
  Footer,
  FooterBrand,
  FooterCopyright,
  FooterDivider,
  FooterIcon,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
} from "flowbite-react";
import {
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsTwitter,
  BsWhatsapp,
} from "react-icons/bs";
import { RouterLink } from "./RouterLink";
import { CONFIG } from "../../config";
import { useAuthStore } from "../../store/useAuthStore";

export function PublicFooter() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Footer container className="rounded-none border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div className="mb-6 md:mb-0">
            <FooterBrand
              as={RouterLink}
              href="/"
              src="/icon.png"
              alt={`${CONFIG.APP.NAME} Logo`}
              name={CONFIG.APP.NAME}
              className="dark:text-white"
            />
            <p className="mt-4 max-w-xs text-gray-500 dark:text-gray-400 text-sm">
              Simplifying business management for the modern African entrepreneur. 
              Track, grow, and succeed with {CONFIG.APP.NAME.split(' ')[0]}.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <FooterTitle title="Platform" />
              <FooterLinkGroup col>
                <FooterLink as={RouterLink} href="/public">Home</FooterLink>
                <FooterLink as={RouterLink} href="/subscription">Pricing</FooterLink>
                {!isAuthenticated && (
                  <FooterLink as={RouterLink} href="/auth/signup">Get Started</FooterLink>
                )}
              </FooterLinkGroup>
            </div>
            <div>
              <FooterTitle title="Company" />
              <FooterLinkGroup col>
                <FooterLink as={RouterLink} href="/public/about">About Us</FooterLink>
                <FooterLink href={`mailto:${CONFIG.APP.SUPPORT_EMAIL}`}>Contact</FooterLink>
                <FooterLink href={`tel:${CONFIG.APP.SUPPORT_PHONE}`}>Support</FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterTitle title="Legal" />
              <FooterLinkGroup col>
                <FooterLink as={RouterLink} href="/public/privacy">Privacy Policy</FooterLink>
                <FooterLink href="#">Terms & Conditions</FooterLink>
              </FooterLinkGroup>
            </div>
          </div>
        </div>
        <FooterDivider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <FooterCopyright
            href="/"
            by={`${CONFIG.APP.NAME}™`}
            year={new Date().getFullYear()}
          />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <FooterIcon href="#" icon={BsFacebook} />
            <FooterIcon href="#" icon={BsInstagram} />
            <FooterIcon href="#" icon={BsTwitter} />
            <FooterIcon href={`https://wa.me/256${CONFIG.APP.SUPPORT_PHONE.slice(1)}`} icon={BsWhatsapp} />
            <FooterIcon href="https://github.com" icon={BsGithub} />
          </div>
        </div>
      </div>
    </Footer>
  );
}
