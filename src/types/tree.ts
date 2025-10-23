
// Tree Controller Types

export interface Tree {
    id: string;
    name: string;
    createdAt: string;
}

// ==================== CREATE TREE ====================
export interface CreateTreeRequest {
    name: string;
}

export interface CreateTreeResponse {
    code: number;
    status: string;
    message: string;
    data: Tree;
}

// ==================== GET USER TREES ====================
export interface GetUserTreesResponse {
    code: number;
    status: string;
    message: string;
    data: Tree[];
}

// ==================== UPDATE TREE ====================
export interface UpdateTreeRequest {
    treeId: string;
    name: string;
}

export interface UpdateTreeResponse {
    code: number;
    status: string;
    message: string;
    data: Tree;
}

// ==================== DELETE TREE ====================
export interface DeleteTreeResponse {
    code: number;
    status: string;
    message: string;
    data: string;
}
