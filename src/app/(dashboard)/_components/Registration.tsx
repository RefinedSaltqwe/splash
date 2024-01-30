"use client";
import React, { useCallback, useState } from "react";
import Steps from "./Steps";
import Card from "./containers/Card";
import RegistrationFormComponents from "./RegistrationFormComponents";

const stepsObject = [
  { id: "01", name: "Email Verification", status: "current" },
  { id: "02", name: "Information", status: "upcoming" },
  { id: "03", name: "Confirmation Link", status: "upcoming" },
];

type Steps = {
  id: string;
  name: string;
  status: string;
};

const Registration: React.FC = () => {
  const [current, setCurrent] = useState("01");
  const [steps, setSteps] = useState<Steps[]>(stepsObject);

  const setCurrentTab = useCallback(
    (number: string) => {
      setCurrent(number);
    },
    [current],
  );

  const setStepsStatus = useCallback(
    (id: string, status: string) => {
      setSteps((prev) => [
        ...prev.map((step) =>
          step.id === id
            ? { id: step.id, name: step.name, status: status }
            : step,
        ),
      ]);
    },
    [steps],
  );

  return (
    <div className="flex w-full flex-col gap-5">
      <div>
        <Steps steps={steps} />
      </div>
      <Card>
        <RegistrationFormComponents
          current={current}
          setCurrentTab={setCurrentTab}
          setStepsStatus={setStepsStatus}
        />
      </Card>
    </div>
  );
};
export default Registration;
