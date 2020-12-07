interface _HasId {
  id: Id<this>;
}

interface _HasRoomPosition {
  pos: RoomPosition;
}

interface GlobalControlLevel {
  /**
   * 当前的等级。
   */
  level: number;
  /**
   * 到下一个等级当前的进展。
   */
  progress: number;
  /**
   * 到下一个等级所需的进展。
   */
  progressTotal: number;
}

interface GlobalPowerLevel {
  /**
   * 当前的等级。
   */
  level: number;
  /**
   * 到下一个等级当前的进展。
   */
  progress: number;
  /**
   * 到下一个等级所需的进展。
   */
  progressTotal: number;
}

interface Shard {
  /**
   * shard 的名称。
   */
  name: string;
  /**
   * 目前总是等于 normal.
   */
  type: "normal";
  /**
   * 这个 shard 是否为 [PTR](https://screeps-cn.github.io/ptr.html).
   */
  ptr: boolean;
}

interface CPU {
  /**
   * 你在当前指定 shard 的 CPU 限制。
   */
  limit: number;
  /**
   * 当前游戏 tick 可用的 CPU 时间。通常它高于 `Game.cpu.limit`.
   * @see https://screeps-cn.github.io/cpu-limit.html
   */
  tickLimit: number;
  /**
   * 在你的 bucket 中累积的未使用的 CPU 数量。
   * @see https://screeps-cn.github.io/cpu-limit.html#Bucket
   */
  bucket: number;
  /**
   * 包含了每个 shard cpu 上限的对象，以 shard 名称为关键字。你可以使用 `setShardLimits` 方法重设他们。
   */
  shardLimits: CPUShardLimits;
  /**
   * 您的账户是否已经解锁了完整的 CPU。
   */
  unlocked: boolean;
  /**
   * 您账户解锁完整 CPU 时的 UNIX 毫秒时间戳。当您账户的完整 CPU 未解锁或未使用 subscription 时该属性未定义。
   */
  unlockedTime: number | undefined;

  /**
   * 获取当前游戏开始时使用的 CPU 时间总量。在模拟模式下始终返回 `0`。
   */
  getUsed(): number;
  /**
   * 分配 CPU 限制到不同的 shard。CPU 总量应保持等于 `Game.cpu.shardLimits`。此方法每 12 小时只能使用一次。
   *
   * @param limits 表示每个 shard 的 CPU 值，与 `Game.cpu.shardLimits` 格式相同。
   * @returns `OK | ERR_BUSY | ERR_INVALID_ARGS`
   */
  setShardLimits(limits: CPUShardLimits): OK | ERR_BUSY | ERR_INVALID_ARGS;

  /**
   * **这个方法只在虚拟机在你的账户运行时设置中被设为 Isolated 时可用**
   *
   * 使用此方法获取虚拟机的堆统计信息。
   * 返回值几乎与 Node.js 函数 `v8.getHeapStatistics()` 相同。 此函数返回一个附加属性：`externally_allocated_size`，它是当前分配的内存总量，不包含在 v8 堆中，但会计入此隔离的内存限制。
   * 超过一定大小的 `ArrayBuffer` 实例是外部分配的，将在此计算。
   */
  getHeapStatistics?(): HeapStatistics;

  /**
   * **这个方法只在虚拟机在你的账户运行时设置中被设为 Isolated 时可用**
   *
   * 重置你的运行环境并擦除堆内存中的所有数据。
   */
  halt?(): never;
  /**
   * 从您的 bucket 中取出 5000 CPU 来生成一点 pixel 资源。
   */
  generatePixel(): OK | ERR_NOT_ENOUGH_RESOURCES;

  /**
   * 为您的账户解锁 24 小时的完整 CPU。
   * 该方法将消耗一个您账户中的 CPU unlock（详见 Game.resources）。
   * 如果之前尚未激活过完整 CPU。则可能需要一点时间（5 分钟之内）来为您的账户应用解锁。
   */
  unlock(): OK | ERR_NOT_ENOUGH_RESOURCES | ERR_FULL;
}

interface HeapStatistics {
  total_heap_size: number;
  total_heap_size_executable: number;
  total_physical_size: number;
  total_available_size: number;
  used_heap_size: number;
  heap_size_limit: number;
  malloced_memory: number;
  peak_malloced_memory: number;
  does_zap_garbage: 0 | 1;
  externally_allocated_size: number;
}

/**
 * creep 身体部件的描述
 */
type BodyPartDefinition<T extends BodyPartConstant = BodyPartConstant> = T extends any
  ? {
      /**
       * `RESOURCE_*` 常量之一
       *
       * 如果该身体部件被强化(boost)了，则该属性指定了强化所用的化合物类型。[了解更多](https://screeps-cn.github.io/resources.html)。
       */
      boost?: keyof typeof BOOSTS[T];
      /**
       * 身体部件常量之一。
       */
      type: T;
      /**
       * 该身体部件剩余的生命值。
       */
      hits: number;
    }
  : never;

interface Owner {
  /**
   * 拥有者姓名。
   */
  username: string;
}
interface ReservationDefinition {
  /** 预定了该房间的玩家名称。 */
  username: string;
  /** 预定时间还有多少 tick 结束。 */
  ticksToEnd: number;
}
interface SignDefinition {
  /** 将控制器签名的玩家名称。 */
  username: string;
  /** 签名的文本内容。 */
  text: string;
  /** 进行签名的游戏 tick 时间。 */
  time: number;
  /** 进行签名的现实时间。 */
  datetime: Date;
}

interface CPUShardLimits {
  [shard: string]: number;
}

/** A general purpose Store, which has a limited capacity */
type StoreDefinition = Store<ResourceConstant, false>;

/** A general purpose Store, which has an unlimited capacity */
type StoreDefinitionUnlimited = Store<ResourceConstant, true>;

// type SD<K extends ResourceConstant> = {
//   [P in K]: number;
//   energy: number;
// }

type ExitsInformation = Partial<Record<ExitKey, string>>;

interface AllLookAtTypes {
  constructionSite: ConstructionSite;
  creep: Creep;
  energy: Resource<RESOURCE_ENERGY>;
  exit: any; // TODO what type is this?
  flag: Flag;
  mineral: Mineral;
  deposit: Deposit;
  nuke: Nuke;
  resource: Resource;
  source: Source;
  structure: Structure;
  terrain: Terrain;
  tombstone: Tombstone;
  powerCreep: PowerCreep;
  ruin: Ruin;
}

type LookAtTypes = Partial<AllLookAtTypes>;

type LookAtResult<K extends LookConstant = LookConstant> = Pick<LookAtTypes, K> & { type: K };

type LookAtResultWithPos<K extends LookConstant = LookConstant> = LookAtResult<K> & {
  x: number;
  y: number;
};

interface LookAtResultMatrix<K extends LookConstant = LookConstant> {
  [y: number]: {
    [x: number]: LookAtResult<K>[];
  };
}

interface LookForAtAreaResultMatrix<T, K extends keyof LookAtTypes = keyof LookAtTypes> {
  [y: number]: {
    [x: number]: LookForAtAreaResult<T, K>[];
  };
}

type LookForAtAreaResult<T, K extends keyof LookAtTypes = keyof LookAtTypes> = { type: K } & { [P in K]: T };

type LookForAtAreaResultWithPos<T, K extends keyof LookAtTypes = keyof LookAtTypes> = LookForAtAreaResult<T, K> & {
  x: number;
  y: number;
};

type LookForAtAreaResultArray<T, K extends keyof LookAtTypes = keyof LookAtTypes> = LookForAtAreaResultWithPos<T, K>[];

interface FindTypes {
  [key: number]:
    | RoomPosition
    | AnyCreep
    | Source
    | Resource
    | Structure
    | Flag
    | ConstructionSite
    | Mineral
    | Nuke
    | Tombstone
    | Deposit
    | Ruin;
  1: RoomPosition; // FIND_EXIT_TOP
  3: RoomPosition; // FIND_EXIT_RIGHT
  5: RoomPosition; // FIND_EXIT_BOTTOM
  7: RoomPosition; // FIND_EXIT_LEFT
  10: RoomPosition; // FIND_EXIT
  101: Creep; // FIND_CREEPS
  102: Creep; // FIND_MY_CREEPS
  103: Creep; // FIND_HOSTILE_CREEPS
  104: Source; // FIND_SOURCES_ACTIVE
  105: Source; // FIND_SOURCES
  106: Resource; // FIND_DROPPED_RESOURCES
  107: AnyStructure; // FIND_STRUCTURES
  108: AnyOwnedStructure; // FIND_MY_STRUCTURES
  109: AnyOwnedStructure; // FIND_HOSTILE_STRUCTURES
  110: Flag; // FIND_FLAGS
  111: ConstructionSite; // FIND_CONSTRUCTION_SITES
  112: StructureSpawn; // FIND_MY_SPAWNS
  113: StructureSpawn; // FIND_HOSTILE_SPAWNS
  114: ConstructionSite; // FIND_MY_CONSTRUCTION_SITES
  115: ConstructionSite; // FIND_HOSTILE_CONSTRUCTION_SITES
  116: Mineral; // FIND_MINERALS
  117: Nuke; // FIND_NUKES
  118: Tombstone; // FIND_TOMBSTONES
  119: PowerCreep; // FIND_POWER_CREEPS
  120: PowerCreep; // FIND_MY_POWER_CREEPS
  121: PowerCreep; // FIND_HOSTILE_POWER_CREEPS
  122: Deposit; // FIND_DEPOSITS
  123: Ruin; // FIND_RUINS
}

interface FindPathOpts {
  /**
   * 将其他 creep 所处的地块视作可通行的。在附件有大量移动的 creep 或者其他一些情况时会很有用。默认值为 `false`。
   */
  ignoreCreeps?: boolean;

  /**
   * 将可破坏的建筑 (constructed walls, ramparts, spawns, extensions) 所在的地块视作可通行的。默认为 `false`。
   */
  ignoreDestructibleStructures?: boolean;

  /**
   * 无视道路。启用该项将加快搜索速度。默认值为 `false`。仅当新的 [`PathFinder`](https://screeps-cn.github.io/api/#PathFinder) 启用时才可用。
   */
  ignoreRoads?: boolean;

  /**
   * 你可以使用该回调在搜索过程中为任意房间修改 `CostMatrix`。
   *
   * 回调接受两个参数，`roomName` 和 `costMatrix`。
   *
   * 使用 `costMatrix` 实例来修改地形移动成本。如果你从回调中返回了一个新的 matrix。它将会代替内置的缓存 matrix。
   *
   * 仅当新的 `PathFinder` 启用时才可用。
   * @param roomName 房间名
   * @param costMatrix 当前的地形移动成本 `CostMatrix`
   * @returns 修改后的新的地形移动成本 `CostMatrix`
   */
  costCallback?(roomName: string, costMatrix: CostMatrix): void | CostMatrix;

  /**
   * 一个数组，其元素为房间中的对象或者 `RoomPosition` 对象，在搜索时会将该数组中的对象位置视作可通行的地块。当启用新的 `PathFinder` 时无法使用。（请用 `costCallback` 选项代替）。
   */
  ignore?: any[] | RoomPosition[];

  /**
   * 一个数组，其元素为房间中的对象或者 `RoomPosition` 对象，在搜索时会将该数组中的对象位置视作无法通行的地块。当启用新的 `PathFinder` 时无法使用。（请用 `costCallback` 选项代替）。
   */
  avoid?: any[] | RoomPosition[];

  /**
   * 用于寻路的消耗上限。你可以限制在寻路上花费的 CPU 时间，基于 1 op ~ 0.001 CPU 的比例。默认值为 `2000`。
   */
  maxOps?: number;

  /**
   * 应用于 A* 算法 `F = G + weight * H` 中的启发式权重(weight)。在使用该选项之前您最好已经了解了 A* 算法的底层实现！默认值为 `1.2`。
   */
  heuristicWeight?: number;

  /**
   * 如果为 `true`，将会使用 `Room.serializePath` 对结果路径进行序列化。默认值为 `false`。
   */
  serialize?: boolean;

  /**
   * 寻路所允许的最大房间数。默认值为 `16`。仅当新的 [`PathFinder`](https://screeps-cn.github.io/api/#PathFinder) 启用时才可用。
   */
  maxRooms?: number;

  /**
   * 找到到达位于目标指定线性区域内位置的路径。默认值为 `0`.
   */
  range?: number;

  /**
   * 平原地形的移动成本。默认为 `1`。
   */
  plainCost?: number;

  /**
   * 沼泽地形的移动成本。默认为 `5`。
   */
  swampCost?: number;
}

interface MoveToOpts extends FindPathOpts {
  /**
   * 此选项将缓存前方多个 tick 将要移动的路径。该操作可以节省 cpu 时间，但是会导致 creep 的反应变慢。
   * 路径被缓存到 creep 内存中的 `_move` 属性里。`reusePath` 的值定义了要缓存前方多少 tick 的移动路径。默认值为 `5`。
   * 增加该值来节省更多的 CPU。减少该值来使移动更加连贯。设置为 `0` 来禁用路径重用。
   */
  reusePath?: number;

  /**
   * 如果 `reusePath` 启用并且该值设为 `true`，重用的路径将会使用 [Room.serializePath](https://screeps-cn.github.io/api/#Room.Room-serializePath) 进行序列化并储存在内存中。默认值为 `true`。
   */
  serializeMemory?: boolean;

  /**
   * 如果该选择设为 `true` 并且内存中没有重用路径时，`moveTo` 将会返回 `ERR_NOT_FOUND`。
   * 在某些情况下，这会节省大量的 CPU 时间。默认值为 `false`。
   */
  noPathFinding?: boolean;

  /**
   * 使用 RoomVisual.poly 来在 creep 的移动路线上画一条线。你可以提供一个空对象或者自定义样式参数。默认的样式如下：
   *
   * ```css
   * {
   *   fill: 'transparent',
   *   stroke: '#fff',
   *   lineStyle: 'dashed',
   *   strokeWidth: .15,
   *   opacity: .1
   * }
   * ```
   */
  visualizePathStyle?: PolyStyle;
}

interface PathStep {
  x: number;
  dx: number;
  y: number;
  dy: number;
  direction: DirectionConstant;
}

/**
 * An object with survival game info
 */
interface SurvivalGameInfo {
  /**
   * Current score.
   */
  score: number;
  /**
   * Time to the next wave of invaders.
   */
  timeToWave: number;
  /**
   * The number of the next wave.
   */
  wave: number;
}

interface _Constructor<T> {
  readonly prototype: T;
}

interface _ConstructorById<T> extends _Constructor<T> {
  new (id: Id<T>): T;
  (id: Id<T>): T;
}

declare namespace Tag {
  const OpaqueTagSymbol: unique symbol;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  class OpaqueTag<T> {
    private [OpaqueTagSymbol]: T;
  }
}
type Id<T> = string & Tag.OpaqueTag<T>;
