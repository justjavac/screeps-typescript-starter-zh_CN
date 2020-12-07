// memory extension samples
interface CreepMemory {
  /** creep 的角色 */
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
