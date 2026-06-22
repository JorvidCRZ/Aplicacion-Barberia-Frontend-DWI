import { TreeNode } from 'primeng/api';
import { SelectOption } from './select.option.model';

export type FilterFieldType =
    | 'text'
    | 'number'
    | 'autocomplete'
    | 'select'
    | 'multiselect'
    | 'treeselect'
    | 'date'
    // | 'dateRange'
    | 'boolean';

export interface FilterField<T = any, V = any> {
    key: keyof T;
    label: string;
    endOfDay?: boolean;
    suggestions?: any[];
    placeholder?: string;
    includeTime?: boolean;
    type: FilterFieldType;
    options?: SelectOption<V>[];
    treeOptions?: TreeNode[];
    currency?: boolean;
    treeSelectionMode?: 'single' | 'checkbox' | 'multiple';
    completeMethod?: (event: any) => void;
}