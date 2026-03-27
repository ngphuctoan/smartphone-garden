export type NavItem = {
  type: "directLink";
  label: string;
  linkTo: string;
} | {
  type: "hasSubMenu";
  label: string;
  menus: {
    title: string;
    items: {
      label: string;
      linkTo: string;
    }[];
  }[];
};
