// src/components/common/Stepper.jsx
//
// Horizontal step indicator for multi-step forms/flows. Steps before
// `activeStep` show a checkmark (completed); the active step is
// highlighted; steps after it are dimmed and disabled unless `clickable`
// allows jumping back to a completed step.
//
// Usage:
//   <Stepper
//     steps={["Personal Details", "Business Details"]}
//     activeStep={1}          // 1-based
//     completedSteps={[1]}    // 1-based step numbers already done
//     onStepClick={(step) => ...}  // optional — omit to make steps non-clickable
//   />

import { FaCheck } from "react-icons/fa";
import "./Common.css";

export default function Stepper({ steps, activeStep, completedSteps = [], onStepClick }) {
  return (
    <div className="hb-stepper">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isCompleted = completedSteps.includes(stepNumber);
        const isActive = stepNumber === activeStep;
        const isClickable = typeof onStepClick === "function" && (isCompleted || isActive);

        return (
          <div key={label} className="hb-stepper__item">
            <button
              type="button"
              className={`hb-stepper__circle ${isActive ? "hb-stepper__circle--active" : ""} ${
                isCompleted ? "hb-stepper__circle--completed" : ""
              }`}
              onClick={isClickable ? () => onStepClick(stepNumber) : undefined}
              disabled={!isClickable}
            >
              {isCompleted ? <FaCheck /> : stepNumber}
            </button>
            <span className={`hb-stepper__label ${isActive ? "hb-stepper__label--active" : ""}`}>
              {label}
            </span>
            {index < steps.length - 1 && (
              <span className={`hb-stepper__connector ${isCompleted ? "hb-stepper__connector--done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
