import { relationshipService, RelationshipTitleResponse } from '@/services/relationshipTitleServer';
import React, { useEffect, useState } from 'react';


interface RelationshipModalProps {
    isOpen: boolean;
    onClose: () => void;
    person1Id: string;
    person2Id: string;
    person1Name: string;
    person2Name: string;
}

const RelationshipModal: React.FC<RelationshipModalProps> = ({
    isOpen,
    onClose,
    person1Id,
    person2Id,
    person1Name,
    person2Name,
}) => {
    const [relationship, setRelationship] = useState<RelationshipTitleResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && person1Id && person2Id) {
            // Reset state và fetch mới
            setRelationship(null);
            setError(null);
            fetchRelationship();
        }
        console.log('RelationshipModal opened with IDs:', person1Id, person2Id);
    }, [isOpen, person1Id, person2Id]); // Dependencies để re-fetch khi ID thay đổi

    const fetchRelationship = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await relationshipService.getRelationshipTitle(person1Id, person2Id);
            setRelationship(data);
        } catch (err) {
            setError('Không thể xác định quan hệ. Vui lòng thử lại.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Cách xưng hô</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {/* Person Cards */}
                    <div className="flex items-center justify-around">
                        {/* Person 1 */}
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                                <span className="text-3xl font-bold text-blue-600">{person1Name.charAt(0)}</span>
                            </div>
                            <h3 className="font-semibold text-lg text-gray-800">{person1Name}</h3>
                        </div>

                        <div className="text-3xl text-gray-300">⟷</div>

                        {/* Person 2 */}
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                                <span className="text-3xl font-bold text-indigo-600">{person2Name.charAt(0)}</span>
                            </div>
                            <h3 className="font-semibold text-lg text-gray-800">{person2Name}</h3>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-8">
                            <svg className="animate-spin h-10 w-10 text-blue-600 mb-3" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span className="text-gray-600 font-medium">Đang xác định quan hệ...</span>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="text-red-800">{error}</span>
                            </div>
                        </div>
                    )}

                    {/* Relationship Result */}
                    {!loading && !error && relationship && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 space-y-4">
                            {/* Person 1 calls Person 2 */}
                            <div className="flex items-center justify-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                                <span className="font-semibold text-gray-700">{person1Name}</span>
                                <span className="text-gray-500">gọi</span>
                                <span className="font-semibold text-gray-700">{person2Name}</span>
                                <span className="text-gray-500">là</span>
                                <span className="font-bold text-xl text-blue-600 bg-blue-100 px-4 py-2 rounded-lg">
                                    {relationship.person1CallsPerson2}
                                </span>
                            </div>

                            {/* Person 2 calls Person 1 */}
                            <div className="flex items-center justify-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                                <span className="font-semibold text-gray-700">{person2Name}</span>
                                <span className="text-gray-500">gọi</span>
                                <span className="font-semibold text-gray-700">{person1Name}</span>
                                <span className="text-gray-500">là</span>
                                <span className="font-bold text-xl text-indigo-600 bg-indigo-100 px-4 py-2 rounded-lg">
                                    {relationship.person2CallsPerson1}
                                </span>
                            </div>

                            {/* Relationship Path */}
                            <div className="border-t border-blue-200 pt-4 mt-4">
                                <div className="flex items-start space-x-2">
                                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-700 mb-1">Đường quan hệ:</p>
                                        <p className="text-sm text-gray-600">{relationship.relationshipPath}</p>
                                    </div>
                                </div>

                                {relationship.generationDifference !== undefined && (
                                    <div className="flex items-center space-x-2 mt-3">
                                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                                            <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                                            <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                                        </svg>
                                        <p className="text-sm text-gray-600">
                                            Chênh lệch: <span className="font-semibold">{Math.abs(relationship.generationDifference)}</span> thế hệ
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RelationshipModal;