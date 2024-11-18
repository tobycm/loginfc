const users: Record<Hash, Username> = {
  "50ab5dd29f686c5ca8802bfd912f97f06992c0cd63a1bdec59ae7f244a81d9de29916af0552205cf2ede408fb014436ee003f876c186b581a25e381665637482": "toby",
};

type Hash = string;
type Username = string;

export default new Map(Object.entries(users));
