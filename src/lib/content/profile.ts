export const profile = {
  name: "Erik Aouizerate",
  title: "INGÉNIEUR LOGICIEL SENIOR — AI, Fullstack & DevOps",
  subtitle: "Typescript | Python | Cloud | Agentic",
  birthDate: "1986-04-07",
  // Kept from the original header: experience is derived from age.
  experienceOffset: 27,
  english: "Anglais : B2",
  summary:
    "Ingénieur passionné, j'interviens à toutes les étapes d'un projet — de la conception à la mise en production — en alliant excellence technique et vision produit. J'aime résoudre des problèmes complexes, tout en gardant à l'esprit l'impact business et l'expérience utilisateur. La communication est au cœur de mon approche, garantissant collaboration efficace, innovation et qualité durable.",
  contacts: [
    {
      kind: "phone",
      href: "tel:+330601994602",
      label: "06 01 99 46 02",
    },
    {
      kind: "mail",
      href: "mailto:erik.aouizerate.pro@gmail.com",
      label: "erik.aouizerate.pro@gmail.com",
    },
    {
      kind: "linkedin",
      href: "https://www.linkedin.com/in/erik-aouizerate-a9985257/",
      label: "linkedin.com/in/erik-aouizerate",
    },
    {
      kind: "github",
      href: "https://github.com/ErikAouizerate/",
      label: "github.com/ErikAouizerate",
    },
    {
      kind: "website",
      href: "https://erik-aouizerate.me",
      label: "erik-aouizerate.me",
    },
  ],
} as const;

export type ContactKind = (typeof profile.contacts)[number]["kind"];
