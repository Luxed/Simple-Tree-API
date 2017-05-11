var SimpleTree;
(function (SimpleTree) {
    var Tree = (function () {
        function Tree(strTree) {
            this._DOMElement = null;
            this._clickFunction = null;
            this._renderer = null;
            this._autoDraw = false;
            console.log('Creating a Tree');
            if (typeof strTree !== 'undefined') {
                this._rootNode = SimpleTree.Tree.createNode('root', '/', true, SimpleTree.Tree.toTab(strTree));
            }
            else {
                this._rootNode = SimpleTree.Tree.createNode('root', '/', true, null);
            }
        }
        Tree.createNode = function (strName, strPath, bDir, tabSub) {
            return {
                name: strName,
                path: strPath,
                isDir: bDir,
                isOpen: false,
                child: tabSub
            };
        };
        Tree.toTab = function (strTree) {
            var tab;
            try {
                tab = SimpleTree.Tree.JSONToTab(JSON.parse(strTree));
            }
            catch (error) {
                console.log('No JSON was given, assuming string');
                tab = SimpleTree.Tree.strToTab(strTree);
            }
            return tab;
        };
        Tree.strToTab = function (strTree) {
            var tab = [];
            var tabFiles = [];
            var tabTreeSplit = strTree.split(':');
            var i;
            var l = tabTreeSplit.length;
            var strPath, tabName;
            for (i = 0; i < l; i++) {
                strPath = tabTreeSplit[i].substr(2);
                tabName = strPath.split('/');
                if (tabTreeSplit[i].substr(0, 1) === 'd') {
                    tab.push(SimpleTree.Tree.createNode(tabName[tabName.length - 2] + '/', strPath, true, null));
                }
                else {
                    tabFiles.push(SimpleTree.Tree.createNode(tabName[tabName.length - 1], strPath, false, null));
                }
            }
            var x;
            l = tabFiles.length;
            for (x = 0; x < l; x++) {
                tab.push(tabFiles[x]);
            }
            return tab;
        };
        Tree.JSONToTab = function (objJSON) {
            var tab = [];
            var tabName;
            if (typeof objJSON.dir !== 'undefined') {
                for (var _i = 0, _a = objJSON.dir; _i < _a.length; _i++) {
                    var str = _a[_i];
                    tabName = str.split('/');
                    tab.push(SimpleTree.Tree.createNode(tabName[tabName.length - 2] + '/', str, true, null));
                }
            }
            if (typeof objJSON.file !== 'undefined') {
                for (var _b = 0, _c = objJSON.file; _b < _c.length; _b++) {
                    var str = _c[_b];
                    tabName = str.split('/');
                    tab.push(SimpleTree.Tree.createNode(tabName[tabName.length - 1], str, false, null));
                }
            }
            return tab;
        };
        Tree.prototype.findNode = function (strPath, tabFind) {
            var objTree = null;
            if (strPath !== this._rootNode.path) {
                if (typeof tabFind === 'undefined') {
                    tabFind = this._rootNode.child;
                }
                var i = void 0;
                var l = tabFind.length;
                for (i = 0; i < l; i++) {
                    if (strPath === tabFind[i].path) {
                        objTree = tabFind[i];
                        break;
                    }
                    else if (strPath.indexOf(tabFind[i].path) > -1) {
                        objTree = this.findNode(strPath, tabFind[i].child);
                    }
                }
            }
            else {
                objTree = this._rootNode;
            }
            return objTree;
        };
        Tree.prototype.addNode = function (strPath, strTree, open) {
            if (typeof open === 'undefined') {
                open = false;
            }
            var node = this.findNode(strPath);
            node.child = SimpleTree.Tree.toTab(strTree);
            node.isOpen = open;
        };
        Tree.prototype.resetChildNode = function (strPath) {
            var node = this.findNode(strPath);
            node.child = null;
        };
        Tree.prototype.openDir = function (strPath) {
            var node = this.findNode(strPath);
            node.isOpen = true;
            this.redraw();
        };
        Tree.prototype.closeDir = function (strPath) {
            var node = this.findNode(strPath);
            node.isOpen = false;
            this.redraw();
        };
        Tree.prototype.ocDir = function (strPath) {
            var node = this.findNode(strPath);
            node.isOpen = !node.isOpen;
            this.redraw();
        };
        Object.defineProperty(Tree.prototype, "rootNode", {
            get: function () {
                return this._rootNode;
            },
            enumerable: true,
            configurable: true
        });
        Tree.prototype.click = function (func, tabClick) {
            if (typeof func === 'function') {
                if (typeof tabClick === 'undefined') {
                    var str_1 = this._rootNode.path;
                    document.getElementById(str_1).onclick = function () { func(str_1); };
                    tabClick = this._rootNode.child;
                }
                if ((typeof tabClick !== 'undefined') && (typeof tabClick !== null) && this._rootNode.isOpen) {
                    var i = void 0;
                    var l = tabClick.length;
                    var _loop_1 = function () {
                        var str = tabClick[i].path;
                        if (tabClick[i].child !== null && tabClick[i].isOpen) {
                            this_1.click(func, tabClick[i].child);
                        }
                        document.getElementById(str).onclick = function () {
                            func(str);
                        };
                    };
                    var this_1 = this;
                    for (i = 0; i < l; i++) {
                        _loop_1();
                    }
                }
            }
        };
        Tree.prototype.autoDraw = function (DOMElement, renderer, func) {
            this._DOMElement = DOMElement;
            this._clickFunction = func;
            this._renderer = renderer;
            this._autoDraw = true;
            this.redraw();
        };
        Tree.prototype.redraw = function () {
            if (this._autoDraw) {
                if (this._DOMElement !== null && this._clickFunction !== null) {
                    document.getElementById(this._DOMElement).innerHTML = this._renderer.render(this._rootNode);
                    this.click(this._clickFunction);
                }
            }
        };
        Object.defineProperty(Tree, "css", {
            set: function (objCSS) {
                SimpleTree.Tree._css = objCSS;
            },
            enumerable: true,
            configurable: true
        });
        Tree.fakeBtnHovered = function (objBtn, inside) {
            if (inside) {
                if (objBtn.className === SimpleTree.Tree._css.classNH) {
                    objBtn.className = SimpleTree.Tree._css.classH;
                }
                else {
                    objBtn.className = SimpleTree.Tree._css.classHDir;
                }
            }
            else {
                if (objBtn.className === SimpleTree.Tree._css.classH) {
                    objBtn.className = SimpleTree.Tree._css.classNH;
                }
                else {
                    objBtn.className = SimpleTree.Tree._css.classNHDir;
                }
            }
        };
        return Tree;
    }());
    Tree._css = {
        classNH: 'fakeButtonNH',
        classNHDir: 'fakeButtonNHDir',
        classH: 'fakeButtonH',
        classHDir: 'fakeButtonHDir'
    };
    SimpleTree.Tree = Tree;
})(SimpleTree || (SimpleTree = {}));
var SimpleTree;
(function (SimpleTree) {
    var Rendering;
    (function (Rendering) {
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
                    if (tree.child === null) {
                        html += '|';
                    }
                    else {
                        html += '/';
                    }
                    html += '-<span id="' + tree.path + '" class="' + SimpleTree.Tree._css.classNHDir + '" onmouseover="SimpleTree.Tree.fakeBtnHovered(this, true)" onmouseout="SimpleTree.Tree.fakeBtnHovered(this, false)">' + tree.name + '</span><br />';
                    if (null !== tree.child && tree.child.length > 0) {
                        for (var i = 0; i < tree.child.length; ++i) {
                            if (tree.child !== null) {
                                var childsToDraw = tree.child[i];
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
                for (var i = 0; i < tree.child.length; ++i) {
                    var subNode = tree.child[i];
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
        Rendering.DefaultRenderer = DefaultRenderer;
    })(Rendering = SimpleTree.Rendering || (SimpleTree.Rendering = {}));
})(SimpleTree || (SimpleTree = {}));
//# sourceMappingURL=Tree.js.map