export type ITemplateFile = {
  _id: string;
  file_label: string;
  format: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

export type IFileLabel = {
  _id: string;
  title: string;
  slug: string;
  files: ITemplateFile[];
};

export type ISize = {
  _id: string;
  name: string;
  slug: string;
  file_labels: IFileLabel[];
};

export type IGroup = {
  _id: string;
  name: string;
  slug: string;
  sizes: ISize[];
};

export type ITemplate = {
  _id: string;
  category_id: number;
  category_name: string;
  slug: string;
  groups: IGroup[];
};
