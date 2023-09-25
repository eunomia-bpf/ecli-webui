export default class {
    tabsMap: Map<number, string> = new Map();

    addTab(tabName: string) {
        this.tabsMap.set(this.tabsMap.size + 1, tabName);
    }

    deleteTab(tabId: number) {
        this.tabsMap.delete(tabId);
    }
   
}