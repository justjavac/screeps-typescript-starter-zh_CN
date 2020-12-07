// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
  role?: string;
  room?: string;
  /** 是否正在建造 */
  building?: boolean;
  /** 是否正在升级 */
  upgrading?: boolean;
}

interface Memory {
  uuid: number;
  log: any;
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
