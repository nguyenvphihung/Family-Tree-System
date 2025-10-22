// Relation Controller Types

export interface PersonBasic {
    id: string;
    treeId: string;
    name: string;
    gender: string;
    birthday: string;
    birthPlace: string;
    generation: number | string;
    createdAt: string;
}

export interface SpouseInfo extends PersonBasic {
    marriageDate: string;
    divorceDate?: string | null;
}

// ==================== GET TREE RELATIONS ====================
export interface GetTreeRelationsResponse {
    code: number;
    status: string;
    message: string;
    data: {
        id: string;
        treeId: string;
        name: string;
        gender: string;
        birthday: string;
        birthPlace: string;
        generation: number;
        createdAt: string;
        spouses: SpouseInfo[];
        children: string[];
    };
}

// ==================== GET PERSON TREE RELATIONS ====================
export interface GetPersonTreeRelationsResponse {
    code: number;
    status: string;
    message: string;
    data: {
        id: string;
        treeId: string;
        name: string;
        gender: string;
        birthday: string;
        birthPlace: string;
        generation: number;
        createdAt: string;
        spouses: SpouseInfo[];
        children: string[];
    };
}

// ==================== ADD CHILD ====================
export interface AddChildRequest {
    parent1Id: string;
    parent2Id: string;
    child: {
        name: string;
        gender: string;
        birthday: string;
        birthPlace: string;
    };
    childrenType: "BIOLOGICAL";
    adoptionDate: string;
    notes: string;
}

export interface AddChildResponse {
    code: number;
    status: string;
    message: string;
    data: {
        child: PersonBasic;
        parent1: PersonBasic;
        parent2: PersonBasic;
        childrenType: "BIOLOGICAL";
        adoptionDate: string;
        notes: string;
        createdAt: string;
    };
}

// ==================== ADD PARENT ====================
export interface AddParentRequest {
    childId: string;
    newParent: {
        name: string;
        gender: string;
        birthday: string;
        birthPlace: string;
    };
}

export interface AddParentResponse {
    code: number;
    status: string;
    message: string;
    data: {
        child: PersonBasic;
        parent1: PersonBasic;
        parent2: PersonBasic;
        childrenType: "BIOLOGICAL";
        adoptionDate: string;
        notes: string;
        createdAt: string;
    };
}

// ==================== CREATE ROOT PERSON ====================
export interface CreateRootPersonRequest {
    name: string;
    gender: string;
    birthday: string;
    birthPlace: string;
}

export interface CreateRootPersonResponse {
    code: number;
    status: string;
    message: string;
    data: PersonBasic;
}

// ==================== ADD SPOUSE ====================
export interface AddSpouseRequest {
    newSpouse: {
        name: string;
        gender: string;
        birthday: string;
        birthPlace: string;
    };
    marriageDate: string;
    divorceDate: string;
}

export interface AddSpouseResponse {
    code: number;
    status: string;
    message: string;
    data: {
        person1: PersonBasic;
        person2: PersonBasic;
        marriageDate: string;
        divorceDate: string;
    };
}
