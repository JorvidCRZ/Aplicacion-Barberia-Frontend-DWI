import { Categoria } from '@/app/core/models/catalogos/categorias.model';
import { TreeNode } from 'primeng/api';

export function buildCategoryTree(categorias: Categoria[]): TreeNode[] {
    const makeNode = (categorias: Categoria): TreeNode => {
        const children = categorias.subcategorias?.length ? categorias.subcategorias.map(subcategoria => makeNode(subcategoria)) : [];
        const node: TreeNode = { label: categorias.nombre, key: String(categorias.id), data: categorias, children };
        if (children.length) node.expanded = true;
        return node;
    };
    return categorias.filter(categoria => categoria.padreId == null).map(categoria => makeNode(categoria));
}