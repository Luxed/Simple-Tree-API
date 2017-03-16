/**
 * Simple Tree API
 * 0.1
 */

interface TreeNode {
    name: string;
    path: string;
    isDir: boolean;
    child: TreeNode[];
}

interface CSSFakeButtons {
    classNH: string;
    classNHDir: string;
    classH: string;
    classHDir: string;
}

class Tree {
    private _tabTree: TreeNode[];
    private _strDOMElement: string;
    static _css: CSSFakeButtons = {classNH: 'fakeButtonNH',
                                    classNHDir: 'fakeButtonNHDir',
                                    classH: 'fakeButtonH',
                                    classHDir: 'fakeButtonHDir'
    };

    constructor(strDOMElement:string, strTree: string) {
        console.log('Creating a Tree');
        this._strDOMElement = strDOMElement;

        this._tabTree = Tree.toTab(strTree);
    }

    static createNode(strName, strPath, bDir, tabSub): TreeNode {
        return {
            name:strName,
            path:strPath,
            isDir:bDir,
            child:tabSub
        };
    }

    static toTab(strTree: string): TreeNode[] {
        let tab: TreeNode[];

        try {
            tab = Tree.JSONToTab(JSON.parse(strTree));
        } catch(error) {
            console.log('No JSON was given, assuming string');
            tab = Tree.strToTab(strTree);
        }

        return tab;
    }

    static strToTab(strTree: string): TreeNode[] {
        let tab = [];
        let tabFiles = [];
        let tabTreeSplit = strTree.split(':');

        let i;
        let l = tabTreeSplit.length;
        let strPath, tabName;
        for (i = 0; i < l; i++) {
            strPath = tabTreeSplit[i].substr(2); // Removing the d; or f; information from the path
            tabName = strPath.split('/');
            if (tabTreeSplit[i].substr(0,1) === 'd') {
                //console.log(tabName[tabName.length-2]+'/');
                tab.push(Tree.createNode(tabName[tabName.length-2]+'/', strPath, true, null));
            } else {
                tabFiles.push(Tree.createNode(tabName[tabName.length-1], strPath, false, null));
            }
        }

        let x;
        l = tabFiles.length;
        for (x = 0; x < l; x++) {
            //console.log(tabFiles[x].name);
            tab.push(tabFiles[x]);
        }

        return tab;
    }

    static JSONToTab(objJSON) {
        let tab: TreeNode[] = [];

        let tabName;
        if (typeof objJSON.dir !== 'undefined') {
            for (let str of objJSON.dir) {
                tabName = str.split('/');
                tab.push(Tree.createNode(tabName[tabName.length - 2] + '/', str, true, null));
            }
        }

        if (typeof objJSON.file !== 'undefined') {
            for (let str of objJSON.file) {
                tabName = str.split('/');
                tab.push(Tree.createNode(tabName[tabName.length - 1], str, false, null));
            }
        }

        return tab;
    }

    public findNode(strPath: string, tabFind?: TreeNode[]): TreeNode {
        if (typeof tabFind === 'undefined'){
            tabFind = this._tabTree;
        }
        let objTree = null;

        let i;
        let l = tabFind.length;
        for (i = 0; i < l; i++) {
            if (strPath === tabFind[i].path) {
                objTree = tabFind[i];
                break;
            }
            else if (strPath.indexOf(tabFind[i].path) > -1) {
                objTree = this.findNode(strPath, tabFind[i].child);
            }
        }

        return objTree;
    }

    public addNode(strPath: string, strTree: string) {
        let node = this.findNode(strPath);
        node.child = Tree.toTab(strTree);
    }

    public resetChildNode(strPath: string) {
        let node = this.findNode(strPath);
        node.child = null;
    }

    get tabTree(): TreeNode[] {
        return this._tabTree;
    }

    static set css(objCSS: CSSFakeButtons) {
        Tree._css = objCSS;
    }

    public guiString(intDeep?: number, tabDrawTree?: TreeNode[]) {
        if (typeof intDeep === 'undefined') {
            intDeep = 0;
        }
        if (typeof tabDrawTree === 'undefined') {
            tabDrawTree = this._tabTree;
        }
        let strTree = '';

        let i, x;
        let l = tabDrawTree.length;
        for (i = 0; i < l; i++) {
            for (x = 0; x < intDeep; x++) {
                strTree += '&nbsp&nbsp&nbsp';
            }
            if (tabDrawTree[i].isDir) {
                if (tabDrawTree[i].child === null) {
                    strTree += '|';
                } else {
                    strTree += '/';
                }
                strTree += '-<span id="'+tabDrawTree[i].path+'" class="'+Tree._css.classNHDir+'" onmouseover="Tree.fakeBtnHovered(this, true)" onmouseout="Tree.fakeBtnHovered(this, false)">'+tabDrawTree[i].name+'</span><br />';

                if (tabDrawTree[i].child !== null) {
                    strTree += this.guiString(intDeep+1, tabDrawTree[i].child);
                }
            } else {
                strTree += '|-<span id="'+tabDrawTree[i].path+'" class="'+Tree._css.classNH+'" onmouseover="Tree.fakeBtnHovered(this, true)" onmouseout="Tree.fakeBtnHovered(this, false)">'+tabDrawTree[i].name+'</span><br />';
            }
        }

        return strTree;
    }

    public draw() {
        document.getElementById(this._strDOMElement).innerHTML = this.guiString();
    }

    public click(func: any, tabClick?: TreeNode[]) {
        if (typeof func === 'function') {
            if (typeof tabClick === 'undefined') {
                tabClick = this._tabTree;
            }
            let i;
            let l = tabClick.length;
            for (i = 0; i < l; i++) {
                if (tabClick[i].child === null) {
                    document.getElementById(this._strDOMElement).onclick = func;
                } else {
                    this.click(func, tabClick[i].child);
                }
            }
        }
    }

    static fakeBtnHovered(objBtn, inside) {
        if (inside){
            if (objBtn.className === Tree._css.classNH) {
                objBtn.className = Tree._css.classH;
            } else {
                objBtn.className = Tree._css.classHDir;
            }
        } else {
            if (objBtn.className === Tree._css.classH) {
                objBtn.className = Tree._css.classNH;
            } else {
                objBtn.className = Tree._css.classNHDir;
            }
        }
    }

    public test() {
        console.log('what you did works');
    }
}