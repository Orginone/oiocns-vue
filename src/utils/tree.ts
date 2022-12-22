export interface TreeNodeBase {
    id: string;
    children?: TreeNodeBase[];
}

/**
 * 获取树形所有节点
 * @param data 树数据
 */
export function getAllNodes<T extends TreeNodeBase>(data: T[]): T[] {
    return data.concat(
        data.flatMap(d => getAllNodes(d.children || []), 1)
    );
}