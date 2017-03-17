namespace SimpleTree.Rendering {
    export interface TreeRenderer {
        render(tree : TreeNode) : String;
    }
}