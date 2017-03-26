/// <reference path="../TreeNode.ts" />
/// <reference path="../Tree.ts" />
/// <reference path="./TreeRender.ts" />
namespace SimpleTree.Rendering {
    export class DefaultRenderer implements TreeRenderer {

        public render(tree: TreeNode): string {

            if (null === tree) throw new RangeError("Tree cannot be null");

            let html: string = this.renderNode(0, tree);

            return html;
        }

        private renderNode(depth: number, tree: TreeNode): string {

            let html: string = '';

            for (let i: number = 0; i < (depth * 3); ++i) {
                html += "&nbsp";
            }

            if (tree.isDir && tree.isOpen) {
                if (tree.childs === null) {
                    html += '|';
                } else {
                    html += '/';
                }
                html += '-<span id="' + tree.path + '" class="' + SimpleTree.Tree._css.classNHDir + '" onmouseover="SimpleTree.Tree.fakeBtnHovered(this, true)" onmouseout="SimpleTree.Tree.fakeBtnHovered(this, false)">' + tree.name + '</span><br />';

                if (null !== tree.childs && tree.childs.length > 0) {
                    for (let i: number = 0; i < tree.childs.length; ++i) {
                        if (tree.childs !== null) {
                            let childsToDraw : TreeNode = tree.childs[i];
                            html = html.concat(this.renderNode(depth + 1, childsToDraw));
                        }
                    }
                }

            } else {
                html += '|-<span id="' + tree.path + '" class="' + SimpleTree.Tree._css.classNH + '" onmouseover="SimpleTree.Tree.fakeBtnHovered(this, true)" onmouseout="SimpleTree.Tree.fakeBtnHovered(this, false)">' + tree.name + '</span><br />';
            }

            return html;
        }

        private getDepth(tree: TreeNode): number {

            let depths = Array<number>();
            for (let i = 0; i < tree.childs.length; ++i) {
                let subNode: TreeNode = tree.childs[i];
                depths.push(
                    this.getDepth(subNode)
                );
            }

            return this.max(depths);
        }

        private max(nums: Array<number>): number {

            if (nums.length < 1) throw new RangeError("No length")

            let min = nums[0];

            for (let i = 1; i < nums.length; ++i) {
                let candidate = nums[i]
                if (candidate > min) {
                    min = candidate;
                }
            }

            return min;
        }
    }
}