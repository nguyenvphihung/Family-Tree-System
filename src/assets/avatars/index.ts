// Import avatar images
import childMaleAvatar from './avt1.png';
import childFemaleAvatar from './avt2.png';
import parentMaleAvatar from './av3.png';
import parentFemaleAvatar from './avt4.png';
import grandparentMaleAvatar from './avt5.png';
import grandparentFemaleAvatar from './avt6.png';
import homePageImage from './HomePage.png';
import introduceImage from './Introduce.png';
import mapImage from './map.png';
import { calculateAge } from '../../components/utils/familyUtils';

// Age groups enum
export enum AgeGroup {
    CHILD = 'child',        // 0-17 tuổi
    PARENT = 'parent',      // 18-59 tuổi
    GRANDPARENT = 'grandparent' // 60+ tuổi
}

// Avatar mapping based on gender and age group
const AVATAR_MAP = {
    [AgeGroup.CHILD]: {
        M: childMaleAvatar,
        F: childFemaleAvatar
    },
    [AgeGroup.PARENT]: {
        M: parentMaleAvatar,
        F: parentFemaleAvatar
    },
    [AgeGroup.GRANDPARENT]: {
        M: grandparentMaleAvatar,
        F: grandparentFemaleAvatar
    }
};

// Determine age group based on age
const getAgeGroup = (age: number): AgeGroup => {
    if (age < 18) return AgeGroup.CHILD;
    if (age < 60) return AgeGroup.PARENT;
    return AgeGroup.GRANDPARENT;
};

// Get appropriate avatar based on gender, age, and generation
export const getPersonAvatar = (person: {
    gender: 'M' | 'F';
    avatarUrl?: string;
    birthday?: string | null;
    generation?: number;
}): string => {
    // If custom avatar is provided, use it
    if (person.avatarUrl) {
        return person.avatarUrl;
    }

    // Calculate age from birthday
    const age = calculateAge(person.birthday);
    let ageGroup = getAgeGroup(age);

    // If generation is provided, use it as additional context
    // Generation 0 = root, negative = ancestors, positive = descendants
    if (person.generation !== undefined) {
        if (person.generation > 0) {
            // Descendants (children, grandchildren)
            ageGroup = AgeGroup.CHILD;
        } else if (person.generation < -1) {
            // Great grandparents and above
            ageGroup = AgeGroup.GRANDPARENT;
        } else if (person.generation === -1) {
            // Parents
            ageGroup = AgeGroup.PARENT;
        }

    }

    return AVATAR_MAP[ageGroup][person.gender];
};

// Fallback function for simple gender-based avatars (backward compatibility)
export const getDefaultAvatar = (gender: 'M' | 'F'): string => {
    // Use parent age group as default
    return AVATAR_MAP[AgeGroup.PARENT][gender];
};

// Export homepage, introduce, and map images
export {

    introduceImage,
    mapImage
};
