
import {
  siDocker,
  siFigma,
  siGit,
  siGithub,
  siGitlab,
  siJavascript,
  siLaravel,
  siMongodb,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siPhp,
  siPostgresql,
  siPrisma,
  siPython,
  siReact,
  siRedis,
  siTypescript,
  siPostman,
  siSwagger,
  siInsomnia,
  siVuedotjs,
  siNuxt,
  siAngular,
  siSvelte,
  siVite,
  siTailwindcss,
  siBootstrap,
  siSass,
  siJquery,
  siExpress,
  siNestjs,
  siFastapi,
  siDjango,
  siFlask,
  siSpringboot,
  siGo,
  siRust,
  siOpenjdk,
  siCplusplus,
  siDotnet,
  siSqlite,
  siSupabase,
  siFirebase,
  siMariadb,
  siElasticsearch,
  siTypeorm,
  siSequelize,
  siGithubactions,
  siKubernetes,
  siGooglecloud,
  siVercel,
  siNetlify,
  siJenkins,
  siTerraform,
  siNginx,
  siApache,
  siLinux,
  siUbuntu,
  siTensorflow,
  siPytorch,
  siScikitlearn,
  siPandas,
  siNumpy,
  siJupyter,
  siOpencv,
  siKeras,
  siNotion,
  siJira,
  siTrello,
  siCypress,
  siSelenium,
  siJest,
  siVitest,
  siStorybook,
  siGraphql,
  siApollographql,
  siJsonwebtokens,
} from "simple-icons";

import { Code } from "iconoir-react";

const brandIcons = {
  // Original icons
  docker: siDocker,
  figma: siFigma,
  git: siGit,
  javascript: siJavascript,
  js: siJavascript,
  laravel: siLaravel,
  mongodb: siMongodb,
  mongo: siMongodb,
  mysql: siMysql,
  nextjs: siNextdotjs,
  nextdotjs: siNextdotjs,
  nodejs: siNodedotjs,
  nodedotjs: siNodedotjs,
  php: siPhp,
  postgresql: siPostgresql,
  postgres: siPostgresql,
  prisma: siPrisma,
  python: siPython,
  react: siReact,
  redis: siRedis,
  typescript: siTypescript,
  ts: siTypescript,

  // API development
  postman: siPostman,
  swagger: siSwagger,
  openapi: siSwagger,
  insomnia: siInsomnia,

  // Frontend
  vue: siVuedotjs,
  vuejs: siVuedotjs,
  nuxt: siNuxt,
  nuxtjs: siNuxt,
  angular: siAngular,
  svelte: siSvelte,
  vite: siVite,
  tailwind: siTailwindcss,
  tailwindcss: siTailwindcss,
  bootstrap: siBootstrap,
  sass: siSass,
  jquery: siJquery,

  // Backend
  express: siExpress,
  expressjs: siExpress,
  nestjs: siNestjs,
  fastapi: siFastapi,
  django: siDjango,
  flask: siFlask,
  springboot: siSpringboot,
  spring: siSpringboot,

  // Programming languages
  go: siGo,
  golang: siGo,
  rust: siRust,
  java: siOpenjdk,
  cpp: siCplusplus,
  cplusplus: siCplusplus,
  csharp: siDotnet,
  dotnet: siDotnet,
  dotnetcore: siDotnet,

  // Database and ORM
  sqlite: siSqlite,
  supabase: siSupabase,
  firebase: siFirebase,
  mariadb: siMariadb,
  elasticsearch: siElasticsearch,
  typeorm: siTypeorm,
  sequelize: siSequelize,

  // Git and DevOps
  github: siGithub,
  gitlab: siGitlab,
  githubactions: siGithubactions,
  actions: siGithubactions,
  kubernetes: siKubernetes,
  k8s: siKubernetes,
  gcp: siGooglecloud,
  googlecloud: siGooglecloud,
  vercel: siVercel,
  netlify: siNetlify,
  jenkins: siJenkins,
  terraform: siTerraform,
  nginx: siNginx,
  apache: siApache,
  linux: siLinux,
  ubuntu: siUbuntu,

  // AI and data science
  tensorflow: siTensorflow,
  pytorch: siPytorch,
  sklearn: siScikitlearn,
  scikitlearn: siScikitlearn,
  pandas: siPandas,
  numpy: siNumpy,
  jupyter: siJupyter,
  opencv: siOpencv,
  keras: siKeras,

  // Design and project management
  notion: siNotion,
  jira: siJira,
  trello: siTrello,

  // Testing
  cypress: siCypress,
  selenium: siSelenium,
  jest: siJest,
  vitest: siVitest,
  storybook: siStorybook,

  // API architecture and authentication
  graphql: siGraphql,
  apollographql: siApollographql,
  jwt: siJsonwebtokens,
} as const;

function normalizeIconKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

type SkillLogoProps = {
  name: string;
  icon: string | null;
};

type SkillIconProps = SkillLogoProps & {
  className?: string;
};

export function SkillIcon({ name, icon, className = "size-7" }: SkillIconProps) {
  const brand =
    brandIcons[
      normalizeIconKey(icon ?? "") as keyof typeof brandIcons
    ] ??
    brandIcons[
      normalizeIconKey(name) as keyof typeof brandIcons
    ];

  if (!brand) {
    return <Code aria-hidden="true" className={`${className} text-[#648477]`} />;
  }

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className={className}
      fill={`#${brand.hex}`}
    >
      <path d={brand.path} />
    </svg>
  );
}

export function SkillLogo({ name, icon }: SkillLogoProps) {
  return (
    <div
      role="listitem"
      title={name}
      className="group/logo flex min-h-28 w-24 flex-col items-center justify-center gap-2 rounded-xl border border-transparent px-2 py-3 text-center transition hover:border-[#dce7e1] hover:bg-white hover:shadow-sm"
    >
      <span className="flex size-12 items-center justify-center rounded-xl border border-[#e6eee8] bg-white transition group-hover/logo:-translate-y-0.5">
        <SkillIcon name={name} icon={icon} />
      </span>

      <span className="w-full wrap-break-word text-xs font-medium leading-4 text-[#527064]">
        {name}
      </span>
    </div>
  );
}
