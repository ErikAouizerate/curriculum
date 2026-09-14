import next from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...next,
  {
    rules: {
      "react-hooks/exhaustive-deps": "off",
      indent: [
        "error",
        2,
        {
          SwitchCase: 1,
        },
      ],
      "no-console": 0,
    },
  },
];

export default eslintConfig;
