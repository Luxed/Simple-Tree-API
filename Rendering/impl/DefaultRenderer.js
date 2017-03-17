/// <reference path="../../TreeNode.ts" />
/// <reference path="../../tree.ts" />
/// <reference path="../TreeRender.ts" />
var SimpleTree;
(function (SimpleTree) {
    var Rendering;
    (function (Rendering) {
        var impl;
        (function (impl) {
            var DefaultRenderer = (function () {
                function DefaultRenderer() {
                }
                DefaultRenderer.prototype.render = function (tree) {
                    if (null === tree)
                        throw new RangeError("Tree cannot be null");
                    var html = this.renderNode(0, tree);
                    return html;
                };
                DefaultRenderer.prototype.renderNode = function (depth, tree) {
                    var html = '';
                    for (var i = 0; i < (depth * 3); ++i) {
                        html += "&nbsp";
                    }
                    if (tree.isDir && tree.isOpen) {
                        if (tree.childs === null) {
                            html += '|';
                        }
                        else {
                            html += '/';
                        }
                        html += '-<span id="' + tree.path + '" class="' + SimpleTree.Tree._css.classNHDir + '" onmouseover="SimpleTree.Tree.fakeBtnHovered(this, true)" onmouseout="SimpleTree.Tree.fakeBtnHovered(this, false)">' + tree.name + '</span><br />';
                        if (null !== tree.childs && tree.childs.length > 0) {
                            for (var i = 0; i < tree.childs.length; ++i) {
                                if (tree.childs !== null) {
                                    var childsToDraw = tree.childs[i];
                                    html = html.concat(this.renderNode(depth + 1, childsToDraw));
                                }
                            }
                        }
                    }
                    else {
                        html += '|-<span id="' + tree.path + '" class="' + SimpleTree.Tree._css.classNH + '" onmouseover="SimpleTree.Tree.fakeBtnHovered(this, true)" onmouseout="SimpleTree.Tree.fakeBtnHovered(this, false)">' + tree.name + '</span><br />';
                    }
                    return html;
                };
                DefaultRenderer.prototype.getDepth = function (tree) {
                    var depths = Array();
                    for (var i = 0; i < tree.childs.length; ++i) {
                        var subNode = tree.childs[i];
                        depths.push(this.getDepth(subNode));
                    }
                    return this.max(depths);
                };
                DefaultRenderer.prototype.max = function (nums) {
                    if (nums.length < 1)
                        throw new RangeError("No length");
                    var min = nums[0];
                    for (var i = 1; i < nums.length; ++i) {
                        var candidate = nums[i];
                        if (candidate > min) {
                            min = candidate;
                        }
                    }
                    return min;
                };
                return DefaultRenderer;
            }());
            impl.DefaultRenderer = DefaultRenderer;
        })(impl = Rendering.impl || (Rendering.impl = {}));
    })(Rendering = SimpleTree.Rendering || (SimpleTree.Rendering = {}));
})(SimpleTree || (SimpleTree = {}));
