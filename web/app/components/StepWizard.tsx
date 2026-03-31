"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import StepIndicator from "./StepIndicator";
import HeroStep from "./HeroStep";
import NameStep from "./NameStep";
import TemplateStep from "./TemplateStep";
import DescribeStep from "./DescribeStep";
import AddonsStep from "./AddonsStep";
import ReadyStep from "./ReadyStep";

const TOTAL_STEPS = 6;

export default function StepWizard() {
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [template, setTemplate] = useState("");
  const [description, setDescription] = useState("");
  const [addons, setAddons] = useState<string[]>([]);

  function goNext() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Step indicator - shown on steps 2+ */}
      {step > 1 && (
        <div className="pt-6 pb-2 px-4">
          <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />
          {/* Gold gradient separator */}
          <div className="mt-3 max-w-md mx-auto step-progress-line" />
        </div>
      )}

      {/* Step content */}
      <div className="flex-1 flex items-center justify-center py-8 sm:py-12">
        <AnimatePresence mode="wait">
          {step === 1 && <HeroStep key="hero" onNext={goNext} />}

          {step === 2 && (
            <NameStep
              key="name"
              value={projectName}
              onChange={setProjectName}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === 3 && (
            <TemplateStep
              key="template"
              value={template}
              onChange={setTemplate}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === 4 && (
            <DescribeStep
              key="describe"
              value={description}
              onChange={setDescription}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === 5 && (
            <AddonsStep
              key="addons"
              selected={addons}
              onChange={setAddons}
              description={description}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === 6 && (
            <ReadyStep
              key="ready"
              projectName={projectName}
              template={template}
              description={description}
              addons={addons}
              onBack={goBack}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="py-4 flex justify-center">
        <Image
          src="/gvc-logotype.svg"
          alt="Good Vibes Club"
          width={130}
          height={8}
          className="opacity-20 hover:opacity-40 transition-opacity duration-300"
        />
      </div>
    </div>
  );
}
