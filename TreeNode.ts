namespace SimpleTree {
    export interface TreeNode {
        name: string;
        path: string;
        isDir: boolean;
        childs: TreeNode[];
    }
}