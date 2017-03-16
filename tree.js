/**
 * Simple Tree API
 * 0.1
 */
var Tree = (function () {
    function Tree(strTree) {
        console.log('Creating a Tree');
        this._tabTree = Tree.toTab(strTree);
    }
    Tree.createNode = function (strName, strPath, bDir, tabSub) {
        return {
            name: strName,
            path: strPath,
            isDir: bDir,
            subdir: tabSub
        };
    };
    Tree.toTab = function (strTree) {
        var tab;
        try {
            tab = Tree.JSONToTab(JSON.parse(strTree));
        }
        catch (error) {
            console.log('No JSON was given, assuming string');
            tab = Tree.strToTab(strTree);
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
                tab.push(Tree.createNode(tabName[tabName.length - 2] + '/', strPath, true, null));
            }
            else {
                tabFiles.push(Tree.createNode(tabName[tabName.length - 1], strPath, false, null));
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
                tab.push(Tree.createNode(tabName[tabName.length - 2] + '/', str, true, null));
            }
        }
        if (typeof objJSON.file !== 'undefined') {
            for (var _b = 0, _c = objJSON.file; _b < _c.length; _b++) {
                var str = _c[_b];
                tabName = str.split('/');
                tab.push(Tree.createNode(tabName[tabName.length - 1], str, false, null));
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
                objTree = this.findNode(strPath, tabFind[i].subdir);
            }
        }
        return objTree;
    };
    Tree.prototype.addNode = function (strPath, strTree) {
        var node = this.findNode(strPath);
        node.subdir = Tree.toTab(strTree);
    };
    Tree.prototype.resetSubdirNode = function (strPath) {
        var node = this.findNode(strPath);
        node.subdir = null;
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
            Tree._css = objCSS;
        },
        enumerable: true,
        configurable: true
    });
    Tree.draw = function (objTree, intDeep, tabDrawTree) {
        if (typeof intDeep === 'undefined') {
            intDeep = 0;
        }
        if (typeof tabDrawTree === 'undefined') {
            tabDrawTree = objTree.tabTree;
        }
        var strTree = '';
        var i, x;
        var l = tabDrawTree.length;
        for (i = 0; i < l; i++) {
            for (x = 0; x < intDeep; x++) {
                strTree += '&nbsp&nbsp&nbsp';
            }
            if (tabDrawTree[i].isDir) {
                if (tabDrawTree[i].subdir === null) {
                    strTree += '|';
                }
                else {
                    strTree += '/';
                }
                strTree += '-<span id="' + tabDrawTree[i].path + '" class="' + Tree._css.classNHDir + '" onclick="ajax_ftpFileData(\'' + tabDrawTree[i].path + '\')" onmouseover="Tree.fakeBtnHovered(this, true)" onmouseout="Tree.fakeBtnHovered(this, false)">' + tabDrawTree[i].name + '</span><br />';
                if (tabDrawTree[i].subdir !== null) {
                    strTree += this.draw(objTree, intDeep + 1, tabDrawTree[i].subdir);
                }
            }
            else {
                strTree += '|-<span id="' + tabDrawTree[i].path + '" class="' + Tree._css.classNH + '" onclick="ajax_ftpFileData(\'' + tabDrawTree[i].path + '\')" onmouseover="Tree.fakeBtnHovered(this, true)" onmouseout="Tree.fakeBtnHovered(this, false)">' + tabDrawTree[i].name + '</span><br />';
            }
        }
        return strTree;
    };
    Tree.fakeBtnHovered = function (objBtn, inside) {
        if (inside) {
            if (objBtn.className === Tree._css.classNH) {
                objBtn.className = Tree._css.classH;
            }
            else {
                objBtn.className = Tree._css.classHDir;
            }
        }
        else {
            if (objBtn.className === Tree._css.classH) {
                objBtn.className = Tree._css.classNH;
            }
            else {
                objBtn.className = Tree._css.classNHDir;
            }
        }
    };
    Tree._css = { classNH: 'fakeButtonNH',
        classNHDir: 'fakeButtonNHDir',
        classH: 'fakeButtonH',
        classHDir: 'fakeButtonHDir'
    };
    return Tree;
}());
