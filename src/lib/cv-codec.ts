import {
  JOB_COUNT,
  SKILL_COUNT,
  type CvState,
  type JobMode,
} from "#lib/cv.js";

export const CODEC_VERSION = 3;
export const CODE_LENGTH = 24;

const VERSION_BITS = 4;
const JOB_BITS = 2;
const BITS = VERSION_BITS + JOB_COUNT * JOB_BITS + SKILL_COUNT;
const CAPACITY = CODE_LENGTH * 6;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const CODE_PATTERN = /^[A-Za-z0-9_-]{24}$/;

if (BITS > CAPACITY) {
  throw new Error(`CV state needs ${BITS} bits, code holds ${CAPACITY}`);
}

export function encodeCv(state: CvState): string {
  if (state.jobs.length !== JOB_COUNT || state.skills.length !== SKILL_COUNT) {
    throw new Error(
      `CV state shape mismatch: ${state.jobs.length} jobs / ${state.skills.length} skills`,
    );
  }

  let value = BigInt(CODEC_VERSION);

  for (const mode of state.jobs) {
    if (mode !== 0 && mode !== 1 && mode !== 2) {
      throw new Error(`Invalid job mode: ${mode}`);
    }
    value = (value << BigInt(JOB_BITS)) | BigInt(mode);
  }

  for (const selected of state.skills) {
    value = (value << 1n) | (selected ? 1n : 0n);
  }

  if (value >= 1n << BigInt(BITS)) {
    throw new Error("CV state does not fit in the code capacity");
  }

  value <<= BigInt(CAPACITY - BITS);

  let code = "";
  for (let i = 0; i < CODE_LENGTH; i += 1) {
    code = ALPHABET[Number(value & 63n)] + code;
    value >>= 6n;
  }
  return code;
}

export function decodeCv(code: string): CvState | null {
  if (!CODE_PATTERN.test(code)) return null;

  let value = 0n;
  for (const char of code) {
    const index = ALPHABET.indexOf(char);
    if (index === -1) return null;
    value = (value << 6n) | BigInt(index);
  }

  value >>= BigInt(CAPACITY - BITS);

  const version = Number(value >> BigInt(BITS - VERSION_BITS));
  if (version !== CODEC_VERSION) return null;

  const skills: boolean[] = Array.from({ length: SKILL_COUNT });
  for (let i = 0; i < SKILL_COUNT; i += 1) {
    skills[i] = ((value >> BigInt(SKILL_COUNT - 1 - i)) & 1n) === 1n;
  }

  const jobs: JobMode[] = Array.from({ length: JOB_COUNT });
  for (let i = 0; i < JOB_COUNT; i += 1) {
    const shift = BigInt(SKILL_COUNT + (JOB_COUNT - 1 - i) * JOB_BITS);
    const mode = Number((value >> shift) & 3n);
    if (mode !== 0 && mode !== 1 && mode !== 2) return null;
    jobs[i] = mode;
  }

  return { jobs, skills };
}
