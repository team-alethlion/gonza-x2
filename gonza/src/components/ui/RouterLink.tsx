import { Link, type LinksProps } from "react-router-dom";
import React from "react";

/**
 * A wrapper for react-router-dom's Link component that accepts 'href'
 * instead of 'to' to maintain compatibility with Flowbite components
 * and avoid TypeScript errors.
 */
export const RouterLink = React.forwardRef<
  HTMLAnchorElement,
  Omit<LinksProps, "to"> & { href: string }
>(({ href, ...props }, ref) => {
  return <Link ref={ref} to={href} {...props} />;
});

RouterLink.displayName = "RouterLink";
