import React from "react";
import {
  Card,
  Button,
  Spinner,
  Select,
  TabItem,
  Tabs,
  TextInput,
  Hr,
} from "flowbite-react";

const SalesGoalTracker = () => {
  const [period, setPeriod] = React.useState("daily");
  const gaols = {
    daily: {
      goal: 1000,
    },
    weekly: {
      goal: 7000,
    },
    monthly: {
      goal: 30000,
    },
  };
  return (
    <div>
      {/* sales, costs, expenses and profits (excluding quotes) */}
      <div>
        <h2 className="text-lg font-bold mb-4">Sales Goal Tracker</h2>
        <p className="text-sm text-gray-500">Business: Business Name</p>
      </div>

      <div className="overflow-x-auto">
        <Tabs aria-label="Full width tabs" variant="fullWidth">
          <TabItem active title="daily">
            {/**/}
          </TabItem>
          <TabItem title="weekly">{/**/}</TabItem>
          <TabItem title="monthly">{/**/}</TabItem>
        </Tabs>
      </div>

      <div className="flex gap-2 mb-4">
        <Button onClick={() => setPeriod("daily")}>Daily</Button>
        <Button onClick={() => setPeriod("weekly")}>Weeekly</Button>
        <Button onClick={() => setPeriod("monthly")}>Monthly</Button>
      </div>
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between mb-4">
          <p> {/* monthly|daily|weekly */} Goal</p>
          <p>ugx {}</p>
        </div>
        <div className="flex justify-between mb-4">
          <p>Current Sales</p>
          <p>ugx {}</p>
        </div>
        <div className="flex justify-between mb-4">
          <p>Progress</p>
          <p>{}%</p>
        </div>
      </div>
      <div>
        <TextInput />
        <Button>Set Goal</Button>
      </div>
      <Hr />
      <div>Business Goal Tip. ....</div>
    </div>
  );
};

export default SalesGoalTracker;
