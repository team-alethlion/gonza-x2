import React from "react";
import { Button, Card, Label, TextInput } from "flowbite-react";

const OnboardingHome = () => {
  return (
    <Card>
      <form className="flex flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="agencyName" value="Agency Name" />
          </div>
          <TextInput id="agencyName" type="text" placeholder="Your Agency" required />
        </div>
        <Button type="submit">Complete Onboarding</Button>
      </form>
    </Card>
  );
};

export default OnboardingHome;
