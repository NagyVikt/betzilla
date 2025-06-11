import type { Schema, Struct } from '@strapi/strapi';

export interface CategorySubItemSubItems extends Struct.ComponentSchema {
  collectionName: 'components_category_sub_item_sub_items';
  info: {
    displayName: 'subItems';
    icon: 'attachment';
  };
  attributes: {
    href: Schema.Attribute.String;
    label: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'category-sub-item.sub-items': CategorySubItemSubItems;
    }
  }
}
