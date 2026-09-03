import { create } from "zustand";

import devData from "@/data/dev";
import iaData from "@/data/ia";
import cloudData from "@/data/cloud";
import devopsData from "@/data/devops";
import transverseData from "@/data/transverse";
import jobsData from "@/data/jobs";
import { current, produce } from "immer";

interface skillsI {
  data: {
    skills: {
      dev: Array<any>;
      ia: Array<any>;
      cloud: Array<any>;
      devops: Array<any>;
      transverse: Array<any>;
    };
    jobs: Array<any>;
    schools: Array<any>;
  };

  history: Array<any>;
  skillsActions: {
    remove: (key) => (index) => any;
    removeAll: () => any;
    showAll: () => any;
    reset: () => any;
  };
  jobsActions: {
    remove: (index) => any;
    showAll: () => any;
    reset: () => any;
    addSkills: (clear) => (tools) => any;
    toggleSmall: (key) => any;
  };

  reset: () => any;
  showAll: () => any;
  undo: () => any;
}

const initialSkills = {
  dev: devData.filter((skill) => skill.default),
  ia: iaData.filter((skill) => skill.default),
  cloud: cloudData.filter((skill) => skill.default),
  devops: devopsData.filter((skill) => skill.default),
  transverse: transverseData.filter((skill) => skill.default),
};

const initialJobs = jobsData.filter((skill) => skill.default || skill.small);

const matchSkill = (item, tools) => {
  const labels = item.match && item.match.length ? item.match : [item.label];
  return labels.some((label) => tools.includes(label));
};

const useSkillsStore = create<skillsI>((set) => ({
  data: {
    skills: initialSkills,
    jobs: initialJobs,
    schools: [],
  },

  history: [],
  jobsActions: {
    remove: (index) =>
      set(
        produce((state) => {
          state.history.push(current(state.data));
          state.data.jobs = state.data.jobs.filter((_, i) => i !== index);
        }),
      ),

    showAll: () =>
      set(
        produce((state) => {
          state.history.push(current(state.data));
          state.data.jobs = jobsData;
        }),
      ),
    toggleSmall: (key) =>
      set(
        produce((state) => {
          state.history.push(current(state.data));
          state.data.jobs = state.data.jobs.map((job, i) => {
            if (i === key) {
              return { ...job, small: !job.small };
            } else {
              return job;
            }
          });
        }),
      ),
    reset: () =>
      set(
        produce((state) => {
          state.history.push(current(state.data));
          state.data.jobs = initialJobs;
        }),
      ),
    addSkills: (tools) => (clear) =>
      set(
        produce((state) => {
          state.history.push(current(state.data));

          state.data.skills.dev = devData.filter(
            (item) =>
              matchSkill(item, tools) ||
              (clear &&
                state.data.skills.dev.map((i) => i.label).includes(item.label)),
          );

          state.data.skills.ia = iaData.filter(
            (item) =>
              matchSkill(item, tools) ||
              (clear &&
                state.data.skills.ia.map((i) => i.label).includes(item.label)),
          );

          state.data.skills.cloud = cloudData.filter(
            (item) =>
              matchSkill(item, tools) ||
              (clear &&
                state.data.skills.cloud.map((i) => i.label).includes(item.label)),
          );

          state.data.skills.devops = devopsData.filter(
            (item) =>
              matchSkill(item, tools) ||
              (clear &&
                state.data.skills.devops
                  .map((i) => i.label)
                  .includes(item.label)),
          );

          state.data.skills.transverse = transverseData.filter(
            (item) =>
              matchSkill(item, tools) ||
              (clear &&
                state.data.skills.transverse
                  .map((i) => i.label)
                  .includes(item.label)),
          );
        }),
      ),
  },
  skillsActions: {
    remove: (key) => (index) =>
      set(
        produce((state) => {
          state.history.push(current(state.data));
          state.data.skills[key] = state.data.skills[key].filter(
            (_, i) => i !== index,
          );
        }),
      ),

    showAll: () =>
      set(
        produce((state) => {
          state.history.push(current(state.data));
          state.data.skills.dev = devData;
          state.data.skills.ia = iaData;
          state.data.skills.cloud = cloudData;
          state.data.skills.devops = devopsData;
          state.data.skills.transverse = transverseData;
        }),
      ),
    removeAll: () =>
      set(
        produce((state) => {
          state.history.push(current(state.data));
          state.data.skills = {
            dev: [],
            ia: [],
            cloud: [],
            devops: [],
            transverse: [],
          };
        }),
      ),
    reset: () =>
      set(
        produce((state) => {
          state.history.push(current(state.data));
          state.data.skills = initialSkills;
        }),
      ),
  },
  reset: () =>
    set(
      produce((state) => {
        state.history.push(current(state.data));
        state.data.skills = initialSkills;
        state.data.jobs = initialJobs;
      }),
    ),
  showAll: () =>
    set(
      produce((state) => {
        state.history.push(current(state.data));
        state.data.skills.dev = devData;
        state.data.skills.ia = iaData;
        state.data.skills.cloud = cloudData;
        state.data.skills.devops = devopsData;
        state.data.skills.transverse = transverseData;
        state.data.jobs = jobsData.map((job) => {
          return { ...job, small: false };
        });
      }),
    ),
  undo: () =>
    set(
      produce((state) => {
        if (state.history.length > 0) {
          state.data = state.history.pop();
        }
      }),
    ),
}));

export default useSkillsStore;
