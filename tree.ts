/// <reference path="TreeNode.ts" />
namespace SimpleTree {

    interface CSSFakeButtons {
        classNH: string;
        classNHDir: string;
        classH: string;
        classHDir: string;
    }

    export class Tree {
        private _rootNode: TreeNode;
        private _strDOMElement: string;
        static _css: CSSFakeButtons = {
            classNH: 'fakeButtonNH',
            classNHDir: 'fakeButtonNHDir',
            classH: 'fakeButtonH',
            classHDir: 'fakeButtonHDir'
        };

        constructor(strDOMElement: string, strTree: string) {
            console.log('Creating a Tree');
            this._strDOMElement = strDOMElement;

            this._rootNode = SimpleTree.Tree.createNode('root', '/', true, SimpleTree.Tree.toTab(strTree));
        }

        static createNode(strName, strPath, bDir, tabSub): TreeNode {
            return {
                name: strName,
                path: strPath,
                isDir: bDir,
                isOpen: false,
                childs: tabSub
            };
        }

        static toTab(strTree: string): TreeNode[] {
            let tab: TreeNode[];

            try {
                tab = SimpleTree.Tree.JSONToTab(JSON.parse(strTree));
            } catch (error) {
                console.log('No JSON was given, assuming string');
                tab = SimpleTree.Tree.strToTab(strTree);
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
                if (tabTreeSplit[i].substr(0, 1) === 'd') {
                    //console.log(tabName[tabName.length-2]+'/');
                    tab.push(SimpleTree.Tree.createNode(tabName[tabName.length - 2] + '/', strPath, true, null));
                } else {
                    tabFiles.push(SimpleTree.Tree.createNode(tabName[tabName.length - 1], strPath, false, null));
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
                    tab.push(SimpleTree.Tree.createNode(tabName[tabName.length - 2] + '/', str, true, null));
                }
            }

            if (typeof objJSON.file !== 'undefined') {
                for (let str of objJSON.file) {
                    tabName = str.split('/');
                    tab.push(SimpleTree.Tree.createNode(tabName[tabName.length - 1], str, false, null));
                }
            }

            return tab;
        }

        public findNode(strPath: string, tabFind?: TreeNode[]): TreeNode {
            let objTree = null;
            if (strPath !== this._rootNode.path) {
                if (typeof tabFind === 'undefined') {
                    tabFind = this._rootNode.childs;
                }

                let i;
                let l = tabFind.length;
                for (i = 0; i < l; i++) {
                    if (strPath === tabFind[i].path) {
                        objTree = tabFind[i];
                        break;
                    }
                    else if (strPath.indexOf(tabFind[i].path) > -1) {
                        objTree = this.findNode(strPath, tabFind[i].childs);
                    }
                }
            } else {
                objTree = this._rootNode;
            }

            return objTree;
        }

        public addNode(strPath: string, strTree: string) {
            let node = this.findNode(strPath);
            node.childs = SimpleTree.Tree.toTab(strTree);
        }

        public resetChildNode(strPath: string) {
            let node = this.findNode(strPath);
            node.childs = null;
        }

        get rootNode(): TreeNode {
            return this._rootNode;
        }

        public openDir(strPath: string) {
            let node = this.findNode(strPath);
            node.isOpen = true;
        }

        public click(func: any, tabClick?: TreeNode[]) {
            if (typeof func === 'function') {
                console.log('click');
                if (typeof tabClick === 'undefined') {
                    tabClick = this._rootNode.childs;
                }

                let i;
                let l = tabClick.length;
                for (i = 0; i < l; i++) {
                    let str = tabClick[i].path;
                    if (tabClick[i].childs !== null) {
                        this.click(func, tabClick[i].childs);
                    }
                    document.getElementById(tabClick[i].path).onclick = function () { func(str) };
                }
            }
        }

        static set css(objCSS: CSSFakeButtons) {
            SimpleTree.Tree._css = objCSS;
        }

        static fakeBtnHovered(objBtn, inside) {
            if (inside) {
                if (objBtn.className === SimpleTree.Tree._css.classNH) {
                    objBtn.className = SimpleTree.Tree._css.classH;
                } else {
                    objBtn.className = SimpleTree.Tree._css.classHDir;
                }
            } else {
                if (objBtn.className === SimpleTree.Tree._css.classH) {
                    objBtn.className = SimpleTree.Tree._css.classNH;
                } else {
                    objBtn.className = SimpleTree.Tree._css.classNHDir;
                }
            }
        }

        public test(str) {
            console.log('what you did works ' + str);
        }
    }
}