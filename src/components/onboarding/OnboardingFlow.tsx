import React, { useState } from "react";
import FinishAccountModal from "../modals/FinishAccountModal";
import ParentsInfoStep from "./ParentsInfoStep";
import MaternalGrandparentsStep from "./MaternalGrandparentsStep";
import PaternalGrandparentsStep from "./PaternalGrandparentsStep";
import BuildingTreeLoading from "../loading/BuildingTreeLoading";
import FamilyTreeView from "../family-tree/FamilyTreeView";
import { useFamilyTreeStore, FamilyMember } from "../../store";

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
  const { setCurrentPerson, addParents, addGrandparents, clearFamilyTree } = useFamilyTreeStore();

  const handleFinishAccount = (data: { yearOfBirth: string; gender: string; firstName?: string; lastName?: string }) => {
    setUserData({ ...userData, ...data });
    // Xóa dữ liệu cây cũ trước khi tạo node chính mới
    clearFamilyTree();
    // Create current person from user data
    const currentPerson: FamilyMember = {
      id: 'self',
      name: 'Xuân phúc Võ', // Sử dụng tên mặc định
      birthYear: data.yearOfBirth,
      gender: data.gender as 'male' | 'female',
      isAlive: true,
      relationship: 'self',
    };
    setCurrentPerson(currentPerson);
    setCurrentStep("parents-info");
  };

  const handleParentsInfo = (data: any) => {
    setUserData({ ...userData, parents: data });
    
    // Create parent members if data is provided
    if (data.father && data.father.firstName) {
      const father: FamilyMember = {
        id: 'father',
        name: `${data.father.firstName} ${data.father.lastName || ''}`.trim(),
        birthYear: data.father.yearOfBirth || '',
        gender: 'male',
        isAlive: data.father.isAlive,
        countryOfBirth: data.father.countryOfBirth,
        maidenName: data.father.maidenName,
        lastName: data.father.lastName,
        relationship: 'father',
      };
      
      const mother: FamilyMember = {
        id: 'mother',
        name: `${data.mother.firstName} ${data.mother.lastName || ''}`.trim(),
        birthYear: data.mother.yearOfBirth || '',
        gender: 'female',
        isAlive: data.mother.isAlive,
        countryOfBirth: data.mother.countryOfBirth,
        maidenName: data.mother.maidenName,
        lastName: data.mother.lastName,
        relationship: 'mother',
      };
      
      addParents({ father, mother });
    }
    
    setCurrentStep("maternal-grandparents");
  };

  const handleSkipParents = () => {
    setCurrentStep("maternal-grandparents");
  };

  const handleMaternalGrandparents = (data: any) => {
    setUserData({ ...userData, maternalGrandparents: data });
    
    // Create maternal grandparents if data is provided
    const grandparents: any = {};
    
    if (data.maternalGrandmother && data.maternalGrandmother.firstName) {
      grandparents.maternalGrandmother = {
        id: 'maternalGrandmother',
        name: data.maternalGrandmother.firstName,
        birthYear: data.maternalGrandmother.yearOfBirth || '',
        gender: 'female',
        isAlive: data.maternalGrandmother.isAlive,
        countryOfBirth: data.maternalGrandmother.countryOfBirth,
        maidenName: data.maternalGrandmother.maidenName,
        lastName: data.maternalGrandmother.lastName, // bổ sung nếu có
        relationship: 'maternalGrandmother',
      };
    }
    
    if (data.maternalGrandfather && data.maternalGrandfather.firstName) {
      grandparents.maternalGrandfather = {
        id: 'maternalGrandfather',
        name: data.maternalGrandfather.firstName,
        birthYear: data.maternalGrandfather.yearOfBirth || '',
        gender: 'male',
        isAlive: data.maternalGrandfather.isAlive,
        countryOfBirth: data.maternalGrandfather.countryOfBirth,
        maidenName: data.maternalGrandfather.maidenName, // nếu có
        lastName: data.maternalGrandfather.lastName,
        relationship: 'maternalGrandfather',
      };
    }
    
    if (Object.keys(grandparents).length > 0) {
      addGrandparents(grandparents);
    }
    
    setCurrentStep("paternal-grandparents");
  };

  const handleSkipMaternal = () => {
    setCurrentStep("paternal-grandparents");
  };

  const handlePaternalGrandparents = (data: any) => {
    setUserData({ ...userData, paternalGrandparents: data });
    
    // Create paternal grandparents if data is provided
    const grandparents: any = {};
    
    if (data.paternalGrandmother && data.paternalGrandmother.firstName) {
      grandparents.paternalGrandmother = {
        id: 'paternalGrandmother',
        name: data.paternalGrandmother.firstName,
        birthYear: data.paternalGrandmother.yearOfBirth || '',
        gender: 'female',
        isAlive: data.paternalGrandmother.isAlive,
        countryOfBirth: data.paternalGrandmother.countryOfBirth,
        maidenName: data.paternalGrandmother.maidenName,
        lastName: data.paternalGrandmother.lastName, // bổ sung nếu có
        relationship: 'paternalGrandmother',
      };
    }
    
    if (data.paternalGrandfather && data.paternalGrandfather.firstName) {
      grandparents.paternalGrandfather = {
        id: 'paternalGrandfather',
        name: data.paternalGrandfather.firstName,
        birthYear: data.paternalGrandfather.yearOfBirth || '',
        gender: 'male',
        isAlive: data.paternalGrandfather.isAlive,
        countryOfBirth: data.paternalGrandfather.countryOfBirth,
        maidenName: data.paternalGrandfather.maidenName, // nếu có
        lastName: data.paternalGrandfather.lastName,
        relationship: 'paternalGrandfather',
      };
    }
    
    if (Object.keys(grandparents).length > 0) {
      addGrandparents(grandparents);
    }
    
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