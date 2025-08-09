import React, { useState } from "react";
import FinishAccountModal from "../modals/FinishAccountModal";
import ParentsInfoStep from "./ParentsInfoStep";
import MaternalGrandparentsStep from "./MaternalGrandparentsStep";
import PaternalGrandparentsStep from "./PaternalGrandparentsStep";
import BuildingTreeLoading from "../loading/BuildingTreeLoading";
import FamilyTreeView from "../family-tree/FamilyTreeView";
import { useFamilyTreeStore } from "../../store";
import { FamilyMember } from "../../types/family";

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
  const { 
    setCurrentPerson, 
    addParents, 
    addGrandparents, 
    clearFamilyTree,
    createTreeRoot,
    addParent: addParentAPI,
    addSpouse: addSpouseAPI
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
      
      setCurrentStep("maternal-grandparents");
    } catch (error) {
      console.error("Lỗi thêm thông tin cha mẹ:", error);
      // Có thể hiển thị thông báo lỗi cho user
    }
  };

  const handleSkipParents = () => {
    setCurrentStep("maternal-grandparents");
  };

  const handleMaternalGrandparents = async (data: any) => {
    try {
      setUserData({ ...userData, maternalGrandparents: data });
      
      // Tạo maternal grandparents thông qua API nếu có dữ liệu
      const grandparents: any = {};
      
      if (data.maternalGrandmother && data.maternalGrandmother.firstName) {
        const grandmotherData = {
          childId: userData.currentPersonId || 'temp-child-id',
          newParent: {
            name: `${data.maternalGrandmother.firstName} ${data.maternalGrandmother.lastName || ''}`.trim(),
            gender: 'F',
            birthday: data.maternalGrandmother.yearOfBirth ? `${data.maternalGrandmother.yearOfBirth}-01-01` : null,
            birthPlace: data.maternalGrandmother.countryOfBirth || null
          }
        };

        const grandmotherResponse = await addParentAPI(treeId, grandmotherData);
        
        grandparents.maternalGrandmother = {
          id: grandmotherResponse.parent1.id,
          treeId: grandmotherResponse.parent1.treeId,
          name: grandmotherResponse.parent1.name,
          birthYear: data.maternalGrandmother.yearOfBirth || '',
          gender: 'F',
          isAlive: data.maternalGrandmother.isAlive,
          countryOfBirth: data.maternalGrandmother.countryOfBirth,
          lastName: data.maternalGrandmother.lastName,
          relationship: 'maternalGrandmother',
          firstName: data.maternalGrandmother.firstName,
          birthday: grandmotherResponse.parent1.birthday,
          generation: grandmotherResponse.parent1.generation,
          createdAt: grandmotherResponse.parent1.createdAt,
          birthPlace: grandmotherResponse.parent1.birthPlace,
          birthDate: {
            precision: 'exact',
            month: '01',
            day: '01',
            year: data.maternalGrandmother.yearOfBirth || ''
          }
        };
      }
      
      if (data.maternalGrandfather && data.maternalGrandfather.firstName) {
        const grandfatherData = {
          childId: userData.currentPersonId || 'temp-child-id',
          newParent: {
            name: `${data.maternalGrandfather.firstName} ${data.maternalGrandfather.lastName || ''}`.trim(),
            gender: 'M',
            birthday: data.maternalGrandfather.yearOfBirth ? `${data.maternalGrandfather.yearOfBirth}-01-01` : null,
            birthPlace: data.maternalGrandfather.countryOfBirth || null
          }
        };

        const grandfatherResponse = await addParentAPI(treeId, grandfatherData);
        
        grandparents.maternalGrandfather = {
          id: grandfatherResponse.parent1.id,
          treeId: grandfatherResponse.parent1.treeId,
          name: grandfatherResponse.parent1.name,
          birthYear: data.maternalGrandfather.yearOfBirth || '',
          gender: 'M',
          isAlive: data.maternalGrandfather.isAlive,
          countryOfBirth: data.maternalGrandfather.countryOfBirth,
          lastName: data.maternalGrandfather.lastName,
          relationship: 'maternalGrandfather',
          firstName: data.maternalGrandfather.firstName,
          birthday: grandfatherResponse.parent1.birthday,
          generation: grandfatherResponse.parent1.generation,
          createdAt: grandfatherResponse.parent1.createdAt,
          birthPlace: grandfatherResponse.parent1.birthPlace,
          birthDate: {
            precision: 'exact',
            month: '01',
            day: '01',
            year: data.maternalGrandfather.yearOfBirth || ''
          }
        };
      }
      
      if (Object.keys(grandparents).length > 0) {
        addGrandparents(grandparents);
      }
      
      setCurrentStep("paternal-grandparents");
    } catch (error) {
      console.error("Lỗi thêm thông tin ông bà ngoại:", error);
      // Có thể hiển thị thông báo lỗi cho user
    }
  };

  const handleSkipMaternal = () => {
    setCurrentStep("paternal-grandparents");
  };

  const handlePaternalGrandparents = async (data: any) => {
    try {
      setUserData({ ...userData, paternalGrandparents: data });
      
      // Tạo paternal grandparents thông qua API nếu có dữ liệu
      const grandparents: any = {};
      
      if (data.paternalGrandmother && data.paternalGrandmother.firstName) {
        const grandmotherData = {
          childId: userData.currentPersonId || 'temp-child-id',
          newParent: {
            name: `${data.paternalGrandmother.firstName} ${data.paternalGrandmother.lastName || ''}`.trim(),
            gender: 'F',
            birthday: data.paternalGrandmother.yearOfBirth ? `${data.paternalGrandmother.yearOfBirth}-01-01` : null,
            birthPlace: data.paternalGrandmother.countryOfBirth || null
          }
        };

        const grandmotherResponse = await addParentAPI(treeId, grandmotherData);
        
        grandparents.paternalGrandmother = {
          id: grandmotherResponse.parent1.id,
          treeId: grandmotherResponse.parent1.treeId,
          name: grandmotherResponse.parent1.name,
          birthYear: data.paternalGrandmother.yearOfBirth || '',
          gender: 'F',
          isAlive: data.paternalGrandmother.isAlive,
          countryOfBirth: data.paternalGrandmother.countryOfBirth,
          lastName: data.paternalGrandmother.lastName,
          relationship: 'paternalGrandmother',
          firstName: data.paternalGrandmother.firstName,
          birthday: grandmotherResponse.parent1.birthday,
          generation: grandmotherResponse.parent1.generation,
          createdAt: grandmotherResponse.parent1.createdAt,
          birthPlace: grandmotherResponse.parent1.birthPlace,
          birthDate: {
            precision: 'exact',
            month: '01',
            day: '01',
            year: data.paternalGrandmother.yearOfBirth || ''
          }
        };
      }
      
      if (data.paternalGrandfather && data.paternalGrandfather.firstName) {
        const grandfatherData = {
          childId: userData.currentPersonId || 'temp-child-id',
          newParent: {
            name: `${data.paternalGrandfather.firstName} ${data.paternalGrandfather.lastName || ''}`.trim(),
            gender: 'M',
            birthday: data.paternalGrandfather.yearOfBirth ? `${data.paternalGrandfather.yearOfBirth}-01-01` : null,
            birthPlace: data.paternalGrandfather.countryOfBirth || null
          }
        };

        const grandfatherResponse = await addParentAPI(treeId, grandfatherData);
        
        grandparents.paternalGrandfather = {
          id: grandfatherResponse.parent1.id,
          treeId: grandfatherResponse.parent1.treeId,
          name: grandfatherResponse.parent1.name,
          birthYear: data.paternalGrandfather.yearOfBirth || '',
          gender: 'M',
          isAlive: data.paternalGrandfather.isAlive,
          countryOfBirth: data.paternalGrandfather.countryOfBirth,
          lastName: data.paternalGrandfather.lastName,
          relationship: 'paternalGrandfather',
          firstName: data.paternalGrandfather.firstName,
          birthday: grandfatherResponse.parent1.birthday,
          generation: grandfatherResponse.parent1.generation,
          createdAt: grandfatherResponse.parent1.createdAt,
          birthPlace: grandfatherResponse.parent1.birthPlace,
          birthDate: {
            precision: 'exact',
            month: '01',
            day: '01',
            year: data.paternalGrandfather.yearOfBirth || ''
          }
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
    } catch (error) {
      console.error("Lỗi thêm thông tin ông bà nội:", error);
      // Có thể hiển thị thông báo lỗi cho user
    }
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