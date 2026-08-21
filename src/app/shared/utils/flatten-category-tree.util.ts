import { CategoryNode } from '../../core/models';

// Flattens GET /admin/categories' recursive tree into a single list a p-select can render,
// carrying `depth` so the template can indent children under their parent.
export interface FlatCategoryOption {
  id: number;
  name: string;
  depth: number;
}

export function flattenCategoryTree(nodes: CategoryNode[], depth = 0): FlatCategoryOption[] {
  return nodes.flatMap((node) => [
    { id: node.id, name: node.name, depth },
    ...flattenCategoryTree(node.children, depth + 1),
  ]);
}
