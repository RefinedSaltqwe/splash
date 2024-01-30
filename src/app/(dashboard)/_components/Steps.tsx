import { CheckIcon } from "lucide-react";
import React, { memo } from "react";

type StepsProps = {
  steps: {
    id: string;
    name: string;
    status: string;
  }[];
};

const Steps: React.FC<StepsProps> = ({ steps }) => {
  return (
    <nav aria-label="Progress">
      <ol
        role="list"
        className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-card md:flex md:divide-y-0 dark:divide-slate-700 dark:border-slate-700"
      >
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className="relative cursor-pointer md:flex md:flex-1"
          >
            {step.status === "complete" ? (
              <div className="group flex w-full items-center">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary group-hover:bg-primary/80">
                    <CheckIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="ml-4 text-sm font-medium text-foreground">
                    {step.name}
                  </span>
                </span>
              </div>
            ) : step.status === "current" ? (
              <div
                className="flex items-center px-6 py-4 text-sm font-medium"
                aria-current="step"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary">
                  <span className="text-primary">{step.id}</span>
                </span>
                <span className="ml-4 text-sm font-medium text-foreground">
                  {step.name}
                </span>
              </div>
            ) : (
              <div className="group flex items-center">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-muted-foreground group-hover:border-foreground">
                    <span className="text-muted-foreground group-hover:text-foreground">
                      {step.id}
                    </span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-muted-foreground group-hover:text-foreground">
                    {step.name}
                  </span>
                </span>
              </div>
            )}

            {stepIdx !== steps.length - 1 ? (
              <>
                {/* Arrow separator for lg screens and up */}
                <div
                  className="absolute right-0 top-0 hidden h-full w-5 md:block"
                  aria-hidden="true"
                >
                  <svg
                    className="h-full w-full text-slate-200 dark:text-slate-700"
                    viewBox="0 0 22 80"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 -2L20 40L0 82"
                      vectorEffect="non-scaling-stroke"
                      stroke="currentcolor"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
};
export default memo(Steps);
