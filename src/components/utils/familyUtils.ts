// Family tree utility functions
import { FamilyMember } from '../../types/family';

/**
 * Calculate age from birthday string
 */
export const calculateAge = (birthday: string | null | undefined): number => {
    if (!birthday) return 30; // Default age if no birthday

    try {
        const birthDate = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return Math.max(0, age); // Ensure non-negative age
    } catch {
        return 30; // Default age if invalid date
    }
};

/**
 * Determine age category based on age
 */
export const getAgeCategory = (age: number): 'child' | 'adult' | 'senior' => {
    if (age < 18) return 'child';
    if (age < 60) return 'adult';
    return 'senior';
};

/**
 * Calculate generation level relative to root person
 * Positive = descendants, 0 = same generation, Negative = ancestors
 */
export const calculateGeneration = (
    person: FamilyMember,
    rootPerson: FamilyMember,
    familyTree: FamilyMember[]
): number => {
    // If generation is already calculated, use it
    if (person.generation !== undefined) {
        return person.generation;
    }

    // Simple fallback based on age difference
    const personAge = calculateAge(person.birthday);
    const rootAge = calculateAge(rootPerson.birthday);
    const ageDiff = rootAge - personAge;

    // Rough estimation: 25 years per generation
    return Math.round(ageDiff / 25);
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'Không rõ';

    try {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch {
        return dateString;
    }
};

/**
 * Format date for compact display (dd/mm/yyyy)
 */
export const formatDateCompact = (dateString: string | null | undefined): string => {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    } catch {
        return '';
    }
};/**
 * Get gender display text
 */
export const getGenderText = (gender: 'M' | 'F'): string => {
    return gender === 'M' ? 'Nam' : 'Nữ';
};

/**
 * Calculate relationship between two family members
 */
export const getRelationshipText = (
    person1: FamilyMember,
    person2: FamilyMember
): string => {
    // This is a simplified version - in a real app you'd have more complex logic
    const age1 = calculateAge(person1.birthday);
    const age2 = calculateAge(person2.birthday);

    const ageDiff = Math.abs(age1 - age2);

    if (ageDiff < 10) return 'Cùng thế hệ';
    if (age1 > age2 + 15) return 'Thế hệ trên';
    if (age2 > age1 + 15) return 'Thế hệ dưới';

    return 'Họ hàng';
};
