import type { Schema, Struct } from '@strapi/strapi';

export interface AwayAway extends Struct.ComponentSchema {
  collectionName: 'components_away_aways';
  info: {
    displayName: 'away';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    name: Schema.Attribute.String;
    url: Schema.Attribute.Text;
  };
}

export interface CategorySubItemInformation extends Struct.ComponentSchema {
  collectionName: 'components_category_sub_item_information';
  info: {
    displayName: 'information';
  };
  attributes: {
    Information: Schema.Attribute.Component<
      'category.information-category',
      true
    >;
  };
}

export interface CategorySubItemStaticstis1 extends Struct.ComponentSchema {
  collectionName: 'components_category_sub_item_staticstis1s';
  info: {
    displayName: 'Staticstis1';
  };
  attributes: {
    awayValue: Schema.Attribute.String;
    category: Schema.Attribute.String;
    homeValue: Schema.Attribute.String;
  };
}

export interface CategorySubItemStatistics extends Struct.ComponentSchema {
  collectionName: 'components_category_sub_item_statistics';
  info: {
    displayName: 'statistics';
    icon: 'pin';
  };
  attributes: {
    statisctics: Schema.Attribute.Component<
      'category-sub-item.staticstis1',
      true
    >;
  };
}

export interface CategoryCategory extends Struct.ComponentSchema {
  collectionName: 'components_category_categories';
  info: {
    displayName: 'category';
    icon: 'database';
  };
  attributes: {
    category: Schema.Attribute.Enumeration<
      ['Referee', 'Venue', 'Capacity', 'Attendance']
    >;
  };
}

export interface CategoryInformationCategory extends Struct.ComponentSchema {
  collectionName: 'components_category_information_categories';
  info: {
    displayName: 'InformationCategory';
  };
  attributes: {
    category: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface HomeHome extends Struct.ComponentSchema {
  collectionName: 'components_home_homes';
  info: {
    displayName: 'home';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    name: Schema.Attribute.String;
    url: Schema.Attribute.Text;
  };
}

export interface ResultResultss extends Struct.ComponentSchema {
  collectionName: 'components_result_resultsses';
  info: {
    displayName: 'Resultss';
  };
  attributes: {
    away: Schema.Attribute.Integer;
    home: Schema.Attribute.Integer;
    regulationTime: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'away.away': AwayAway;
      'category-sub-item.information': CategorySubItemInformation;
      'category-sub-item.staticstis1': CategorySubItemStaticstis1;
      'category-sub-item.statistics': CategorySubItemStatistics;
      'category.category': CategoryCategory;
      'category.information-category': CategoryInformationCategory;
      'home.home': HomeHome;
      'result.resultss': ResultResultss;
    }
  }
}
