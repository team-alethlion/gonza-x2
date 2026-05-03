import React from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { Button } from "flowbite-react";
import { HiHome, HiChevronLeft } from "react-icons/hi";
import { RouterLink } from "./RouterLink";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  let errorMessage = "An unexpected error has occurred.";
  let errorStatus = "Error";

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status.toString();
    errorMessage = error.statusText || error.data?.message || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center dark:bg-[#0a2e36]">
      <div className="max-w-md">
        <h1 className="mb-4 text-9xl font-extrabold tracking-tight text-[#252861] dark:text-[#80ced7]">
          {errorStatus === "404" ? "404" : "Oops!"}
        </h1>
        <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
          {errorStatus === "404" ? "Something's missing." : "Something went wrong."}
        </p>
        <p className="mb-8 text-lg font-light text-gray-500 dark:text-gray-400">
          {errorStatus === "404" 
            ? "Sorry, we can't find that page. You'll find lots to explore on the home page." 
            : `Sorry, we encountered an unexpected error: ${errorMessage}`}
        </p>
        
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button 
            as={RouterLink} 
            href="/public" 
            color="primary"
          >
            <HiHome className="mr-2 h-5 w-5" />
            Back to Homepage
          </Button>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-500"
          >
            <HiChevronLeft className="mr-1 h-5 w-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
