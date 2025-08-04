import React, { useState } from "react";
import FinishAccountModal from "../modals/FinishAccountModal";
import ParentsInfoStep from "./ParentsInfoStep";
import MaternalGrandparentsStep from "./MaternalGrandparentsStep";
import PaternalGrandparentsStep from "./PaternalGrandparentsStep";
import BuildingTreeLoading from "../loading/BuildingTreeLoading";
import FamilyTreeView from "../family-tree/FamilyTreeView";

type OnboardingStep = 
  | "finish-account"
  | "parents-info"
  | "maternal-grandparents"
  | "paternal-grandparents"
  | "loading"
  | "family-tree";

const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("finish-account");
  const [userData, setUserData] = useState<any>({});

  const handleFinishAccount = (data: { yearOfBirth: string; gender: string }) => {
    setUserData({ ...userData, ...data });
    setCurrentStep("parents-info");
  };

  const handleParentsInfo = (data: any) => {
    setUserData({ ...userData, parents: data });
    setCurrentStep("maternal-grandparents");
  };

  const handleSkipParents = () => {
    setCurrentStep("maternal-grandparents");
  };

  const handleMaternalGrandparents = (data: any) => {
    setUserData({ ...userData, maternalGrandparents: data });
    setCurrentStep("paternal-grandparents");
  };

  const handleSkipMaternal = () => {
    setCurrentStep("paternal-grandparents");
  };

  const handlePaternalGrandparents = (data: any) => {
    setUserData({ ...userData, paternalGrandparents: data });
    setCurrentStep("loading");
    
    // Simulate loading time
    setTimeout(() => {
      setCurrentStep("family-tree");
    }, 3000);
  };

  const handleSkipPaternal = () => {
    setCurrentStep("loading");
    
    // Simulate loading time
    setTimeout(() => {
      setCurrentStep("family-tree");
    }, 3000);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "finish-account":
        return (
          <FinishAccountModal
            isOpen={true}
            onClose={() => {}}
            onContinue={handleFinishAccount}
          />
        );
      case "parents-info":
        return (
          <ParentsInfoStep
            onNext={handleParentsInfo}
            onSkip={handleSkipParents}
          />
        );
      case "maternal-grandparents":
        return (
          <MaternalGrandparentsStep
            onNext={handleMaternalGrandparents}
            onSkip={handleSkipMaternal}
          />
        );
      case "paternal-grandparents":
        return (
          <PaternalGrandparentsStep
            onDone={handlePaternalGrandparents}
            onSkip={handleSkipPaternal}
          />
        );
      case "loading":
        return <BuildingTreeLoading />;
      case "family-tree":
        return <FamilyTreeView />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentStep()}
    </div>
  );
};

export default OnboardingFlow; 