import { makeRequest } from '@/components/utils';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

export interface RelationshipTitleResponse {
    person1CallsPerson2: string;
    person2CallsPerson1: string;
    relationshipPath: string;
    generationDifference: number;
}

export const relationshipService = {

    async getRelationshipTitle(
        person1Id: string,
        person2Id: string
    ): Promise<RelationshipTitleResponse> {
        try {
            const result = await makeRequest(
                `${API_BASE_URL}/relations/title`,
                'GET',
                null, // body không có
                null, // no special headers
                { person1Id, person2Id } // params
            );

            if (result.error) {
                throw new Error(result.error.message);
            }

            return result.data as RelationshipTitleResponse;
        } catch (error: any) {
            console.error('Error fetching relationship title:', error);
            throw error;
        }
    },
};