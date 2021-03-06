/// <reference path="./TreeNode.ts" />
namespace SimpleTree {

    import TreeRenderer = SimpleTree.Rendering.TreeRenderer;
    interface CSSFakeButtons {
        classNH: string;
        classNHDir: string;
        classH: string;
        classHDir: string;
    }

    export class Tree {
        private _rootNode: TreeNode;
        private _DOMElement: string = null;
        private _clickFunction = null;
        private _renderer: TreeRenderer = null;
        private _autoDraw: boolean = false;
        static _css: CSSFakeButtons = {
            classNH: 'fakeButtonNH',
            classNHDir: 'fakeButtonNHDir',
            classH: 'fakeButtonH',
            classHDir: 'fakeButtonHDir'
        };

        constructor(strTree?: string) {
            console.log('Creating a Tree');
            if (typeof strTree !== 'undefined') {
                this._rootNode = SimpleTree.Tree.createNode('root', '/', true, SimpleTree.Tree.toTab(strTree));
            } else {
                this._rootNode = SimpleTree.Tree.createNode('root', '/', true, null);
            }
        }

        static createNode(strName, strPath, bDir, tabSub): TreeNode {
            return {
                name: strName,
                path: strPath,
                isDir: bDir,
                isOpen: false,
                child: tabSub
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
                    tab.push(SimpleTree.Tree.createNode(tabName[tabName.length - 2] + '/', strPath, true, null));
                } else {
                    tabFiles.push(SimpleTree.Tree.createNode(tabName[tabName.length - 1], strPath, false, null));
                }
            }

            let x;
            l = tabFiles.length;
            for (x = 0; x < l; x++) {
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
                    tabFind = this._rootNode.child;
                }

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
            } else {
                objTree = this._rootNode;
            }

            return objTree;
        }

        public addNode(strPath: string, strTree: string, open?: boolean) {
            if (typeof open === 'undefined') {
                open = false;
            }
            let node = this.findNode(strPath);
            node.child = SimpleTree.Tree.toTab(strTree);
            node.isOpen = open;
        }

        public resetChildNode(strPath: string) {
            let node = this.findNode(strPath);
            node.child = null;
        }

        public openDir(strPath: string) {
            let node = this.findNode(strPath);
            node.isOpen = true;

            this.redraw();
        }

        public closeDir(strPath: string) {
            let node = this.findNode(strPath);
            node.isOpen = false;

            this.redraw();
        }

        public ocDir(strPath: string)  {
            let node = this.findNode(strPath);
            node.isOpen = !node.isOpen;

            this.redraw();
        }

        get rootNode(): TreeNode {
            return this._rootNode;
        }

        public click(func: any, tabClick?: TreeNode[]) {
            if (typeof func === 'function') {
                //console.log('click');
                if (typeof tabClick === 'undefined') {
                    let str = this._rootNode.path;
                    document.getElementById(str).onclick = function () { func(str) };
                    tabClick = this._rootNode.child;
                }

                if ((typeof tabClick !== 'undefined') && (typeof tabClick !== null) && this._rootNode.isOpen) {
                    let i;
                    let l = tabClick.length;
                    for (i = 0; i < l; i++) {
                        let str = tabClick[i].path;
                        //console.log(str);
                        if (tabClick[i].child !== null && tabClick[i].isOpen) {
                            this.click(func, tabClick[i].child);
                        }
                        document.getElementById(str).onclick = function () {
                            func(str)
                        };
                    }
                }
            }
        }

        public autoDraw(DOMElement: string, renderer: TreeRenderer, func) {
            this._DOMElement = DOMElement;
            this._clickFunction = func;
            this._renderer = renderer;
            this._autoDraw = true;
            this.redraw();
        }

        private redraw() {
            if (this._autoDraw) {
                if (this._DOMElement !== null && this._clickFunction !== null) {
                    document.getElementById(this._DOMElement).innerHTML = this._renderer.render(this._rootNode);
                    this.click(this._clickFunction);
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
    }
}