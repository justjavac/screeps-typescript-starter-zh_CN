/**
 * 母巢 (spawn) 是你的殖民地中心。此建筑可以创建、更新和回收 creeps。
 * 你能通过 `Game.spawns` 这个 hash list 访问所有的母巢 (spawn) 。
 * 母巢 (spawn) 每 tick 会生产少许能量，以免玩家陷入无 creep 可用、无 creep 可造的困境。
 */
interface StructureSpawn extends OwnedStructure<STRUCTURE_SPAWN> {
  readonly prototype: StructureSpawn;
  /**
   * 此属性已被弃用，将很快删除。
   * @deprecated `.store[RESOURCE_ENERGY]` 的别名
   */
  energy: number;
  /**
   * 此属性已被弃用，将很快删除。
   * @deprecated `.store.getCapacity(RESOURCE_ENERGY)` 的别名
   */
  energyCapacity: number;
  /**
   * `Memory.spawns[spawn.name]` 的一个简写。您可以使用它来快速访问母巢 (spawn) 的特定内存数据对象。
   *
   * @see https://screeps-cn.github.io/global-objects.html#Memory-object
   */
  memory: SpawnMemory;
  /**
   * Spawn 的名字。在创建新母巢 (spawn) 时赋予，一但创建就无法更改，除非拆除重造。此名称是一个散列键，用于通过 [`Game.spawns`](https://screeps-cn.github.io/api/#Game.spawns) 对象访问。
   */
  name: string;
  /**
   * 如果母巢 (spawn) 正在孵化一个新的 creep ，母巢 (spawn) 将包含一个 [`StructureSpawn.Spawning`](https://screeps-cn.github.io/api/#StructureSpawn-Spawning) 对象，否则为 `null`。
   */
  spawning: Spawning | null;
  /**
   * 一个 [`Store`](https://screeps-cn.github.io/api/#Store) 对象，它包含这个建筑的所有货物。
   */
  store: Store<RESOURCE_ENERGY, false>;
  /**
   * 检查是否可以创建 creep。
   *
   * **此方法已被弃用，不久将被删除。**
   *
   * @deprecated 请使用 [`StructureSpawn.spawnCreep`](https://screeps-cn.github.io/api/#StructureSpawn.spawnCreep) 的 `dryRun` 标志代替。
   * @param body 描述新 creep’s body 的数组。应该包含1至50个元素（以下常量之一）: `WORK`, `MOVE`, `CARRY`, `ATTACK`, `RANGED_ATTACK`, `HEAL`, `TOUGH`, `CLAIM`
   * @param name 新 creep 的名字。它应该是唯一的 creep 名称, 所以 `Game.creeps` 对象不应该包含另一个同名的 creep (hash key)。如果没有定义，将生成一个随机名称。
   */
  canCreateCreep(body: BodyPartConstant[], name?: string): ScreepsReturnCode;
  /**
   * 启动 creep 孵化过程。所需的能量量可以从房间里的所有母巢和扩展中提取出来。
   *
   * **此方法已被弃用，不久将被删除。**
   *
   * @deprecated 请使用 [`StructureSpawn.spawnCreep`](https://screeps-cn.github.io/api/#StructureSpawn.spawnCreep) 代替。
   * @param body 描述新 creep’s body 的数组。应该包含1至50个元素（以下常量之一）: `WORK`, `MOVE`, `CARRY`, `ATTACK`, `RANGED_ATTACK`, `HEAL`, `TOUGH`, `CLAIM`
   * @param name 新 creep 的名字。它应该是唯一的 creep 名称, 所以 `Game.creeps` 对象不应该包含另一个同名的 creep (hash key)。如果没有定义，将生成一个随机名称。
   * @param memory 一个新 creep 的 memory 。如果提供，它将立即存储到 `Memory.creeps[name]`。
   * @returns 产生一个新的 creep 会遇到这些错误代码之一
   * ```
   * ERR_NOT_OWNER            -1  你不是该 spawn 的所有者。
   * ERR_NAME_EXISTS          -3  已经有一个叫这个名字的 creep 了。
   * ERR_BUSY                 -4  这个母巢已经在孵化另一个 creep 了。
   * ERR_NOT_ENOUGH_ENERGY    -6  这个母巢和他的扩展包含的能量不足以孵化具有给定 body 的 creep。
   * ERR_INVALID_ARGS         -10 Body 没有被恰当地描述。
   * ERR_RCL_NOT_ENOUGH       -14 您的房间控制器级别不足以使用此 spawn。
   * ```
   */
  createCreep(body: BodyPartConstant[], name?: string, memory?: CreepMemory): ScreepsReturnCode | string;

  /**
   * 启动 creep 孵化过程。所需的能量量可以从房间里的所有母巢和扩展中提取出来。
   *
   * @param body 描述新 creep’s body 的数组。应该包含1至50个元素（以下常量之一）
   *  * `WORK`
   *  * `MOVE`
   *  * `CARRY`
   *  * `ATTACK`
   *  * `RANGED_ATTACK`
   *  * `HEAL`
   *  * `TOUGH`
   *  * `CLAIM`
   * @param name 新 creep 的名字。它应是个独一无二的 creep 名以保证 `Game.creeps` 不含有重名的的 creep 。
   * @param opts 为孵化进程提供附加选项的对象。
   * @returns 如下错误码之一：
   * ```
   * OK                       0   这个操作已经成功纳入计划。
   * ERR_NOT_OWNER            -1  你不是该母巢 (spawn) 的所有者。
   * ERR_NAME_EXISTS          -3  已经有一个叫这个名字的 creep 了。
   * ERR_BUSY                 -4  这个母巢 (spawn) 已经在孵化另一个 creep 了。
   * ERR_NOT_ENOUGH_ENERGY    -6  这个母巢 (spawn) 和他的扩展包含的能量不足以孵化具有给定 body 的 creep。
   * ERR_INVALID_ARGS         -10 Body 没有被恰当地描述。
   * ERR_RCL_NOT_ENOUGH       -14 您的房间控制器级别不足以使用此 spawn。
   * ```
   */
  spawnCreep(body: BodyPartConstant[], name: string, opts?: SpawnOptions): ScreepsReturnCode;

  /**
   * 立即摧毁这个建筑。
   */
  destroy(): ScreepsReturnCode;
  /**
   * 检查这个建筑是否可用。如果房间控制等级不足，这个方法会返回 `false`，并且这个建筑会在游戏中红色高亮。
   */
  isActive(): boolean;
  /**
   * 切换这个建筑受到攻击时的自动通知。通知会发送到你的账户邮箱。默认开启。
   * @param enabled 是否启用通知。
   */
  notifyWhenAttacked(enabled: boolean): ScreepsReturnCode;
  /**
   * 增加目标 creep 的剩余生存时间。
   *
   * 目标应在相邻的方格处。
   *
   * spawn 不应忙于孵化过程。
   *
   * 每次执行都会增加 creep 的计时器，根据此公式按 ticks 数计算：
   *
   * `floor(600/body_size)`
   *
   * 每次执行所需的能量由以下公式确定:
   *
   * `ceil(creep_cost/2.5/body_size)`
   *
   * 更新 creep 会移除所有的增益。
   *
   * @param target 目标 creep 对象。
   */
  renewCreep(target: Creep): ScreepsReturnCode;
  /**
   * 杀死 creep ，并视其剩余寿命而掉落最多 100％ 的资源用于其繁殖和增强。目标应该在相邻的方块上。每个身体部位的能量回收限制在 125 个单位。
   * @param target 目标 creep 对象。
   */
  recycleCreep(target: Creep): ScreepsReturnCode;
}

interface StructureSpawnConstructor extends _Constructor<StructureSpawn>, _ConstructorById<StructureSpawn> {
  Spawning: SpawningConstructor;
}

declare const StructureSpawn: StructureSpawnConstructor;
declare const Spawn: StructureSpawnConstructor; // legacy alias
// declare type Spawn = StructureSpawn;

/**
 * 当前正在孵化的 creep 的详细信息，可以通过 [`StructureSpawn.spawning`](https://screeps-cn.github.io/api/#StructureSpawn.spawning) 属性进行访问。
 */
interface Spawning {
  readonly prototype: Spawning;

  /**
   * 一个指示了出生方向的数组
   * @see https://screeps-cn.github.io/api/#StructureSpawn.Spawning.setDirections
   */
  directions: DirectionConstant[];

  /**
   * 新 creep 的名字。
   */
  name: string;

  /**
   * 完成孵化总共需要的时间。
   */
  needTime: number;

  /**
   * 剩下的时间。
   */
  remainingTime: number;

  /**
   * 一个到对应 spawn 的链接。
   */
  spawn: StructureSpawn;

  /**
   * 立即取消孵化。不返还消耗的资源。
   */
  cancel(): ScreepsReturnCode & (OK | ERR_NOT_OWNER);

  /**
   * 设置出生方向，以使它们在生成时应移动到的位置。
   * @param directions 包含方向常量的数组。
   */
  setDirections(directions: DirectionConstant[]): ScreepsReturnCode & (OK | ERR_NOT_OWNER | ERR_INVALID_ARGS);
}

/**
 * 为孵化进程提供附加选项的对象。
 */
interface SpawnOptions {
  /**
   * 一个新 creep 的 memory。如果提供，它将立即存储到 `Memory.creeps[name]`。
   */
  memory?: CreepMemory;
  /**
   * 孵化时使用能量的 spawns/extensions 数组，建筑将按顺序使用其中的能量。
   */
  energyStructures?: (StructureSpawn | StructureExtension)[];
  /**
   * 如果 `dryRun` 为 `true`，则操作将仅检查是否可以孵化 creep。
   */
  dryRun?: boolean;
  /**
   * 设置 creep 出生时移动的方向，是一个带有以下常量的数组:
   * - TOP
   * - TOP_RIGHT
   * - RIGHT
   * - BOTTOM_RIGHT
   * - BOTTOM
   * - BOTTOM_LEFT
   * - LEFT
   * - TOP_LEFT
   */
  directions?: DirectionConstant[];
}

interface SpawningConstructor extends _Constructor<Spawning>, _ConstructorById<Spawning> {}
