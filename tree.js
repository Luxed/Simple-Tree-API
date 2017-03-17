/// <reference path="TreeNode.ts" />
var SimpleTree;
(function (SimpleTree) {
    var Tree = (function () {
        function Tree(strDOMElement, strTree) {
            console.log('Creating a Tree');
            this._strDOMElement = strDOMElement;
            this._tabTree = SimpleTree.Tree.toTab(strTree);
        }
        Tree.createNode = function (strName, strPath, bDir, tabSub) {
            return {
                name: strName,
                path: strPath,
                isDir: bDir,
                childs: tabSub
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
                strPath = tabTreeSplit[i].substr(2); // Removing the d; or f; information from the path
                tabName = strPath.split('/');
                if (tabTreeSplit[i].substr(0, 1) === 'd') {
                    //console.log(tabName[tabName.length-2]+'/');
                    tab.push(SimpleTree.Tree.createNode(tabName[tabName.length - 2] + '/', strPath, true, null));
                }
                else {
                    tabFiles.push(SimpleTree.Tree.createNode(tabName[tabName.length - 1], strPath, false, null));
                }
            }
            var x;
            l = tabFiles.length;
            for (x = 0; x < l; x++) {
                //console.log(tabFiles[x].name);
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
            if (typeof tabFind === 'undefined') {
                tabFind = this._tabTree;
            }
            var objTree = null;
            var i;
            var l = tabFind.length;
            for (i = 0; i < l; i++) {
                if (strPath === tabFind[i].path) {
                    objTree = tabFind[i];
                    break;
                }
                else if (strPath.indexOf(tabFind[i].path) > -1) {
                    objTree = this.findNode(strPath, tabFind[i].childs);
                }
            }
            return objTree;
        };
        Tree.prototype.addNode = function (strPath, strTree) {
            var node = this.findNode(strPath);
            node.childs = SimpleTree.Tree.toTab(strTree);
        };
        Tree.prototype.resetChildNode = function (strPath) {
            var node = this.findNode(strPath);
            node.childs = null;
        };
        Object.defineProperty(Tree.prototype, "tabTree", {
            get: function () {
                return this._tabTree;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tree, "css", {
            set: function (objCSS) {
                SimpleTree.Tree._css = objCSS;
            },
            enumerable: true,
            configurable: true
        });
        Tree.prototype.guiString = function (intDeep, tabDrawTree) {
            if (typeof intDeep === 'undefined') {
                intDeep = 0;
            }
            if (typeof tabDrawTree === 'undefined') {
                tabDrawTree = this._tabTree;
            }
            var strTree = '';
            var i, x;
            var l = tabDrawTree.length;
            for (i = 0; i < l; i++) {
                for (x = 0; x < intDeep; x++) {
                    strTree += '&nbsp&nbsp&nbsp';
                }
                if (tabDrawTree[i].isDir) {
                    if (tabDrawTree[i].childs === null) {
                        strTree += '|';
                    }
                    else {
                        strTree += '/';
                    }
                    strTree += '-<span id="' + tabDrawTree[i].path + '" class="' + SimpleTree.Tree._css.classNHDir + '" onmouseover="SimpleTree.Tree.fakeBtnHovered(this, true)" onmouseout="SimpleTree.Tree.fakeBtnHovered(this, false)">' + tabDrawTree[i].name + '</span><br />';
                    if (tabDrawTree[i].childs !== null) {
                        strTree += this.guiString(intDeep + 1, tabDrawTree[i].childs);
                    }
                }
                else {
                    strTree += '|-<span id="' + tabDrawTree[i].path + '" class="' + SimpleTree.Tree._css.classNH + '" onmouseover="SimpleTree.Tree.fakeBtnHovered(this, true)" onmouseout="SimpleTree.Tree.fakeBtnHovered(this, false)">' + tabDrawTree[i].name + '</span><br />';
                }
            }
            return strTree;
        };
        Tree.prototype.draw = function () {
            document.getElementById(this._strDOMElement).innerHTML = this.guiString();
        };
        Tree.prototype.click = function (func, tabClick) {
            if (typeof func === 'function') {
                console.log('click');
                if (typeof tabClick === 'undefined') {
                    tabClick = this._tabTree;
                }
                var i = void 0;
                var l = tabClick.length;
                var _loop_1 = function() {
                    var str = tabClick[i].path;
                    if (tabClick[i].childs !== null) {
                        this_1.click(func, tabClick[i].childs);
                    }
                    document.getElementById(tabClick[i].path).onclick = function () { func(str); };
                };
                var this_1 = this;
                for (i = 0; i < l; i++) {
                    _loop_1();
                }
            }
        };
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
        Tree.prototype.test = function (str) {
            console.log('what you did works ' + str);
        };
        Tree._css = {
            classNH: 'fakeButtonNH',
            classNHDir: 'fakeButtonNHDir',
            classH: 'fakeButtonH',
            classHDir: 'fakeButtonHDir'
        };
        return Tree;
    }());
    SimpleTree.Tree = Tree;
})(SimpleTree || (SimpleTree = {}));
