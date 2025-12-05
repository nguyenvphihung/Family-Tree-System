// import { RelationshipTitleResponse, relationshipTitleService } from '@/services/relationshipTitleServer';
// import React, { useEffect, useState } from 'react';
// import { SourceTextModule } from 'vm';


// interface RelationshipBadgeProps {
//     person1Id: string;
//     person2Id: string;
//     person1Name: string;
//     person2Name: string;
// }

// const RelationshipBadge: React.FC<RelationshipBadgeProps> = ({
//     person1Id,
//     person2Id,
//     person1Name,
//     person2Name,
// }) => {
//     const [relationship, setRelationship] = useState<RelationshipTitleResponse | null>(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchRelationship = async () => {
//             if (!person1Id || !person2Id || person1Id === person2Id) {
//                 return;
//             }

//             setLoading(true);
//             setError(null);

//             try {
//                 const data = await relationshipTitleService.getRelationshipTitle(person1Id, person2Id);
//                 setRelationship(data);
//             } catch (err) {
//                 setError('Không thể xác định quan hệ');
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchRelationship();
//     }, [person1Id, person2Id]);

//     if (loading) {
//         return (
//             <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">
//                 <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                 </svg>
//                 Đang xác định...
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm">
//                 <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//                 {error}
//             </div>
//         );
//     }

//     if (!relationship) {
//         return null;
//     }

//     return (
//         <div className="space-y-2">
//             <div className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-50 border border-blue-200">
//                 <div className="flex flex-col">
//                     <div className="flex items-center space-x-2 text-sm">
//                         <span className="font-semibold text-blue-900">{person1Name}</span>
//                         <span className="text-blue-600">gọi</span>
//                         <span className="font-semibold text-blue-900">{person2Name}</span>
//                         <span className="text-blue-600">là</span>
//                         <span className="font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded">
//                             {relationship.person1CallsPerson2}
//                         </span>
//                     </div>
//                     <div className="flex items-center space-x-2 text-sm mt-1">
//                         <span className="font-semibold text-blue-900">{person2Name}</span>
//                         <span className="text-blue-600">gọi</span>
//                         <span className="font-semibold text-blue-900">{person1Name}</span>
//                         <span className="text-blue-600">là</span>
//                         <span className="font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded">
//                             {relationship.person2CallsPerson1}
//                         </span>
//                     </div>
//                 </div>
//             </div>

//             <div className="text-xs text-gray-600 italic">
//                 <span className="mr-2">📊 {relationship.relationshipPath}</span>
//                 {relationship.generationDifference !== undefined && (
//                     <span>| Chênh lệch: {Math.abs(relationship.generationDifference)} thế hệ</span>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default RelationshipBadge;