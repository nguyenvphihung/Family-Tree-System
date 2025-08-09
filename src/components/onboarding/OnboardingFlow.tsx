import React, { useState } from "react";
import FinishAccountModal from "../modals/FinishAccountModal";
import ParentsInfoStep from "./ParentsInfoStep";
import BuildingTreeLoading from "../loading/BuildingTreeLoading";
import FamilyTreeView from "../family-tree/FamilyTreeView";
import { useFamilyTreeStore } from "../../store";
import { FamilyMember } from "../../types/family";

type OnboardingStep = 
  | "finish-account"
  | "parents-info"
  | "loading"
  | "family-tree";

const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("finish-account");
  const [userData, setUserData] = useState<any>({});
  const { 
    setCurrentPerson, 
    addParents, 
    clearFamilyTree,
    createTreeRoot,
    addParent: addParentAPI
  } = useFamilyTreeStore();

  // Tree ID mặc định - trong thực tế sẽ lấy từ user hoặc context
  const [treeId] = useState("11111111-2222-3333-4444-555555555555");

  const handleFinishAccount = async (data: { yearOfBirth: string; gender: string; firstName?: string; lastName?: string }) => {
    try {
      setUserData({ ...userData, ...data });
      
      // Xóa dữ liệu cây cũ trước khi tạo node chính mới
      clearFamilyTree();
      
      // Tạo root node trong cây thông qua API
      const fullName = `${data.firstName || 'Xuân phúc'} ${data.lastName || 'Võ'}`.trim();
      const rootData = {
        name: fullName,
        gender: data.gender === 'male' ? 'M' : 'F',
        birthday: data.yearOfBirth ? `${data.yearOfBirth}-01-01` : null,
        birthPlace: null
      };

      const rootPerson = await createTreeRoot(treeId, rootData);
      
      // Create current person from API response
      const currentPerson: FamilyMember = {
        id: rootPerson.id,
        treeId: rootPerson.treeId,
        name: rootPerson.name,
        birthYear: data.yearOfBirth,
        gender: data.gender === 'male' ? 'M' : 'F',
        isAlive: true,
        relationship: 'self',
        firstName: data.firstName || 'Xuân phúc',
        lastName: data.lastName || 'Võ',
        birthday: rootPerson.birthday,
        birthPlace: rootPerson.birthPlace,
        generation: rootPerson.generation,
        createdAt: rootPerson.createdAt,
        countryOfBirth: '',
        birthDate: {
          precision: 'exact',
          month: '01',
          day: '01',
          year: data.yearOfBirth
        }
      };
      
      setCurrentPerson(currentPerson);
      setCurrentStep("parents-info");
    } catch (error) {
      console.error("Lỗi tạo root node:", error);
      // Có thể hiển thị thông báo lỗi cho user
    }
  };

  const handleParentsInfo = async (data: any) => {
    try {
      setUserData({ ...userData, parents: data });
      
      // Tạo parent members thông qua API nếu có dữ liệu
      if (data.father && data.father.firstName) {
        const fatherData = {
          childId: userData.currentPersonId || 'temp-child-id',
          newParent: {
            name: `${data.father.firstName} ${data.father.lastName || ''}`.trim(),
            gender: 'M',
            birthday: data.father.yearOfBirth ? `${data.father.yearOfBirth}-01-01` : null,
            birthPlace: data.father.countryOfBirth || null
          }
        };

        const fatherResponse = await addParentAPI(treeId, fatherData);
        
        const father: FamilyMember = {
          id: fatherResponse.parent1.id,
          treeId: fatherResponse.parent1.treeId,
          name: fatherResponse.parent1.name,
          birthYear: data.father.yearOfBirth || '',
          gender: 'M',
          isAlive: data.father.isAlive,
          countryOfBirth: data.father.countryOfBirth,
          lastName: data.father.lastName,
          relationship: 'father',
          firstName: data.father.firstName,
          birthday: fatherResponse.parent1.birthday,
          generation: fatherResponse.parent1.generation,
          createdAt: fatherResponse.parent1.createdAt,
          birthPlace: fatherResponse.parent1.birthPlace,
          birthDate: {
            precision: 'exact',
            month: '01',
            day: '01',
            year: data.father.yearOfBirth || ''
          }
        };
        
        addParents({ father, mother: null });
      }
      
      if (data.mother && data.mother.firstName) {
        const motherData = {
          childId: userData.currentPersonId || 'temp-child-id',
          newParent: {
            name: `${data.mother.firstName} ${data.mother.lastName || ''}`.trim(),
            gender: 'F',
            birthday: data.mother.yearOfBirth ? `${data.mother.yearOfBirth}-01-01` : null,
            birthPlace: data.mother.countryOfBirth || null
          }
        };

        const motherResponse = await addParentAPI(treeId, motherData);
        
        const mother: FamilyMember = {
          id: motherResponse.parent1.id,
          treeId: motherResponse.parent1.treeId,
          name: motherResponse.parent1.name,
          birthYear: data.mother.yearOfBirth || '',
          gender: 'F',
          isAlive: data.mother.isAlive,
          countryOfBirth: data.mother.countryOfBirth,
          lastName: data.mother.lastName,
          relationship: 'mother',
          firstName: data.mother.firstName,
          birthday: motherResponse.parent1.birthday,
          generation: motherResponse.parent1.generation,
          createdAt: motherResponse.parent1.createdAt,
          birthPlace: motherResponse.parent1.birthPlace,
          birthDate: {
            precision: 'exact',
            month: '01',
            day: '01',
            year: data.mother.yearOfBirth || ''
          }
        };
        
        // Nếu đã có father, cập nhật cả hai
        if (data.father && data.father.firstName) {
          addParents({ father: null, mother });
        } else {
          addParents({ father: null, mother });
        }
      }
      
      // Chuyển thẳng đến loading sau khi hoàn thành thêm cha mẹ
      setCurrentStep("loading");
      
      // Simulate loading time
      setTimeout(() => {
        setCurrentStep("family-tree");
      }, 3000);
    } catch (error) {
      console.error("Lỗi thêm thông tin cha mẹ:", error);
      // Có thể hiển thị thông báo lỗi cho user
    }
  };

  const handleSkipParents = () => {
    // Nếu skip thêm cha mẹ, chuyển thẳng đến loading
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