import { EducationApprenticeLevel } from '@/const/saplaryReport';
import { toCurrency } from './helpers';

interface RelationshipData {
  id: number;
  level: number;
  name: string;
  unitPrice: number;
  hours: number;
  amount: number;
  parentId: number;
}

// 輸出資料型別
interface TreeNode {
  content: {
    label: string;
    caption?: string;
  };
  children?: TreeNode[];
  level: number;
}

export function transformRelationshipsToTree(relationships: RelationshipData[], rootNode: TreeNode): any {
  const mergedMap = relationships.reduce((acc, item) => {
    const existing = acc.get(item.id);
    if (!existing) {
      acc.set(item.id, item);
      return acc;
    }
    acc.set(item.id, {
      ...item,
      amount: existing.amount + item.amount,
    });

    return acc;
  }, new Map<number, RelationshipData>());

  //
  const nodeMap = [...mergedMap.values()].reduce((acc, item) => {
    acc.set(item.id, {
      content: {
        label: item.name,
        caption: `${EducationApprenticeLevel[item.level]} ${toCurrency(item.amount ?? 0)}`,
      },
      level: item.level,
    });

    return acc;
  }, new Map<number, TreeNode>());

  const minLevel = Math.min(...[...mergedMap.values()].map(item => item.level));

  [...mergedMap.values()].forEach((item) => {
    const currentNode = nodeMap.get(item.id)!;
    if (item.level !== minLevel) {
      const parentNode = nodeMap.get(item.parentId)!;
      parentNode.children = parentNode?.children ?? [];
      parentNode.children.push(currentNode);
    }
  });

  const firstLevelNodes = [...nodeMap.values()].filter(item => item.level === minLevel);

  return {
    ...rootNode,
    children: firstLevelNodes,
  };
}
