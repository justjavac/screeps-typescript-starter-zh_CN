/**
 * 所有建筑的基础原型对象。
 */
interface Structure<T extends StructureConstant = StructureConstant> extends RoomObject {
  readonly prototype: Structure;

  /**
   * 当前这个建筑的当前生命值。
   */
  hits: number;
  /**
   * 这个建筑的最大生命值。
   */
  hitsMax: number;
  /**
   * 一个唯一的对象标识。你可以使用 [`Game.getObjectById`](https://screeps-cn.github.io/api/#Game.getObjectById) 方法获取对象实例。
   */
  id: Id<this>;
  /**
   * Room 对象的链接。如果对象是标志或工地并且放置在你不可见的房间中，则可能为 `undefined`。
   */
  room: Room;
  /**
   * `STRUCTURE_*` 常量之一。
   */
  structureType: T;
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
}

interface StructureConstructor extends _Constructor<Structure>, _ConstructorById<Structure> {}

declare const Structure: StructureConstructor;

/**
 * 存在拥有者的建筑的基础原型。 这类建筑可以被用 `FIND_MY_STRUCTURES` 或 `FIND_HOSTILE_STRUCTURES` 找到。
 */
interface OwnedStructure<T extends StructureConstant = StructureConstant> extends Structure<T> {
  readonly prototype: OwnedStructure;

  /**
   * 是否是你拥有的建筑。
   */
  my: boolean;
  /**
   * 建筑拥有者信息
   */
  owner: T extends STRUCTURE_CONTROLLER ? Owner | undefined : Owner;
  /**
   * Room 对象的链接
   */
  room: Room;
}

interface OwnedStructureConstructor extends _Constructor<OwnedStructure>, _ConstructorById<OwnedStructure> {}

declare const OwnedStructure: OwnedStructureConstructor;

/**
 * 占领(claim) 这个建筑来控制其所在的房间。控制器无法被攻击或摧毁。你可以通过 `Room.controller` 属性来快速访问到它。
 */
interface StructureController extends OwnedStructure<STRUCTURE_CONTROLLER> {
  readonly prototype: StructureController;

  /**
   * 该房间是否启用了超能 (power)。
   *
   * 使用 [`PowerCreep.enableRoom`](https://screeps-cn.github.io/api/#PowerCreep.enableRoom) 来启用超能。
   */
  isPowerEnabled: boolean;
  /**
   * 当前的控制器等级，从 `0` 到 `8`。
   */
  level: number;
  /**
   * 当前控制器升级到下个等级的进度。
   */
  progress: number;
  /**
   * 控制器升级到下个等级所需的总进度。
   */
  progressTotal: number;
  /**
   * 如果控制器被预定，则该对象表示预定的信息
   */
  reservation: ReservationDefinition | undefined;
  /**
   * 安全模式还有多少 tick 结束。没激活安全模式时返回 `undefined`。
   */
  safeMode?: number;
  /**
   * 可用的安全模式激活次数。
   */
  safeModeAvailable: number;
  /**
   * 安全模式的冷却时间还有多少 tick。冷却结束前将无法激活安全模式，当安全模式没有冷却时返回 `undefined`。
   */
  safeModeCooldown?: number;
  /**
   * 如果控制器被签名，则该对象表示签名的信息
   */
  sign: SignDefinition | undefined;
  /**
   * 该控制器还有多少 tick 将要降级。当控制器升级或者降级时, 该计时器将被设置为总降级时间的 50%。可以使用 [`Creep.upgradeController`](https://screeps-cn.github.io/api/#Creep.upgradeController) 来增加该计时器的时间。控制器想要升级必须先保证该计时器满额。
   */
  ticksToDowngrade: number;
  /**
   * 还有多少 tick 就能从控制器被攻击从而无法升级的状态中恢复过来。在此期间安全模式也不可用。
   */
  upgradeBlocked: number;
  /**
   * 激活安全模式 (如果有的话)。
   * @returns Result Code: OK, ERR_NOT_OWNER, ERR_BUSY, ERR_NOT_ENOUGH_RESOURCES, ERR_TIRED
   */
  activateSafeMode(): ScreepsReturnCode;
  /**
   * 放弃该房间，使得控制器重新变为中立状态。
   */
  unclaim(): ScreepsReturnCode;
}

interface StructureControllerConstructor
  extends _Constructor<StructureController>,
    _ConstructorById<StructureController> {}

declare const StructureController: StructureControllerConstructor;

/**
 * 填充能量从而允许建造更大型的 creep。Extension 可以被放置在房间的任何地方，无论距离有多远，任何 spawn 都可以使用其中的能量进行孵化。
 */
interface StructureExtension extends OwnedStructure<STRUCTURE_EXTENSION> {
  readonly prototype: StructureExtension;

  /**
   * @deprecated 已废弃。使用 `.store[RESOURCE_ENERGY]` 代替。
   */
  energy: number;
  /**
   * @deprecated 已废弃。使用 `.store.getCapacity(RESOURCE_ENERGY) 代替。
   */
  energyCapacity: number;

  /**
   * 一个包含了该建筑中所存储的货物的 `Store` 对象。
   */
  store: Store<RESOURCE_ENERGY, false>;
}

interface StructureExtensionConstructor
  extends _Constructor<StructureExtension>,
    _ConstructorById<StructureExtension> {}

declare const StructureExtension: StructureExtensionConstructor;

/**
 * 将能量远程传输到同一房间的另一个 Link 中。
 */
interface StructureLink extends OwnedStructure<STRUCTURE_LINK> {
  readonly prototype: StructureLink;

  /**
   * 下次传输之前还需多少 tick 的冷却。
   */
  cooldown: number;
  /**
   * 此属性已被弃用，将很快删除。
   * @deprecated `.store[RESOURCE_ENERGY]` 的别名。
   */
  energy: number;
  /**
   * 此属性已被弃用，将很快删除。
   * @deprecated `.store.getCapacity(RESOURCE_ENERGY)` 的别名。
   */
  energyCapacity: number;
  /**
   * 一个包含了该建筑中所存储资源的 [`Store`](https://screeps-cn.github.io/api/#Store) 对象。
   */
  store: Store<RESOURCE_ENERGY, false>;
  /**
   * 将能量远程传输到同一房间中任何位置的另一个 Link 中。
   *
   * If the target is a creep, it has to be at adjacent square to the link.
   *
   * If the target is a link, it can be at any location in the same room.
   *
   * Remote transfer process implies 3% energy loss and cooldown delay depending on the distance.
   * @param target 目标对象。
   * @param amount 将要传输的能量值。如果省略，所有能量都将被传输。
   */
  transferEnergy(target: Creep | StructureLink, amount?: number): ScreepsReturnCode;
}

interface StructureLinkConstructor extends _Constructor<StructureLink>, _ConstructorById<StructureLink> {}

declare const StructureLink: StructureLinkConstructor;

/**
 * 非玩家建筑。孵化 NPC 资源守护者（Source Keeper）来守卫某些房间中的能量 source 和 mineral。该建筑无法被摧毁。
 */
interface StructureKeeperLair extends OwnedStructure<STRUCTURE_KEEPER_LAIR> {
  readonly prototype: StructureKeeperLair;

  /**
   * 距离孵化下一个资源守护者还有多少 tick。
   */
  ticksToSpawn?: number;
}

interface StructureKeeperLairConstructor
  extends _Constructor<StructureKeeperLair>,
    _ConstructorById<StructureKeeperLair> {}

declare const StructureKeeperLair: StructureKeeperLairConstructor;

/**
 * 为你的代码提供远处房间的视野。
 */
interface StructureObserver extends OwnedStructure<STRUCTURE_OBSERVER> {
  readonly prototype: StructureObserver;

  /**
   * 为你的代码提供远处房间的视野。目标房间将在下一个 tick 可见。最大范围为 5 房间。
   * @param roomName 目标房间名。
   */
  observeRoom(roomName: string): ScreepsReturnCode;
}

interface StructureObserverConstructor extends _Constructor<StructureObserver>, _ConstructorById<StructureObserver> {}

declare const StructureObserver: StructureObserverConstructor;

/**
 * 非玩家建筑。储存着超能资源，可以通过摧毁该建筑获得。
 * 攻击该建筑的 creep 每次攻击都会承受反弹回来的伤害。
 * 点击[本文](https://screeps-cn.github.io/power.html)了解更多关于超能的信息。
 */
interface StructurePowerBank extends OwnedStructure<STRUCTURE_POWER_BANK> {
  readonly prototype: StructurePowerBank;

  /**
   * 储存的 power 容量。
   */
  power: number;
  /**
   * 该建筑还有多少 tick 就要因老化而消失。
   */
  ticksToDecay: number;
}

interface StructurePowerBankConstructor
  extends _Constructor<StructurePowerBank>,
    _ConstructorById<StructurePowerBank> {}

declare const StructurePowerBank: StructurePowerBankConstructor;

/**
 * 提炼超能 (power) 并注册到您的账户当中，可以孵化拥有独一无二能力的超能 creep (仍在开发中)。 点击[本文](https://screeps-cn.github.io/power.html)查看跟多有关超能的信息。
 */
interface StructurePowerSpawn extends OwnedStructure<STRUCTURE_POWER_SPAWN> {
  readonly prototype: StructurePowerSpawn;
  /**
   * 此属性已被弃用，将很快删除。
   * @deprecated `.store[RESOURCE_ENERGY]` 的别名。
   */
  energy: number;
  /**
   * 此属性已被弃用，将很快删除。
   * @deprecated `.store.getCapacity(RESOURCE_ENERGY)` 的别名。
   */
  energyCapacity: number;
  /**
   * 此属性已被弃用，将很快删除。
   * @deprecated `.store[RESOURCE_POWER]` 的别名。
   */
  power: number;
  /**
   * 此属性已被弃用，将很快删除。
   * @deprecated `.store.getCapacity(RESOURCE_POWER)` 的别名。
   */
  powerCapacity: number;
  /**
   * 一个包含了该建筑中所存储的货物的 [`Store`](https://screeps-cn.github.io/api/#Store) 对象。
   */
  store: Store<RESOURCE_ENERGY | RESOURCE_POWER, false>;

  /**
   * 将超能 (power) 资源注册到您的账户当中。注册超能允许开发超能 creep 的技能。
   */
  processPower(): ScreepsReturnCode;
}

interface StructurePowerSpawnConstructor
  extends _Constructor<StructurePowerSpawn>,
    _ConstructorById<StructurePowerSpawn> {}

declare const StructurePowerSpawn: StructurePowerSpawnConstructor;

/**
 * 阻挡敌方 creep 的移动。并防御本格空间上的我方建筑和 creep。可以当做可控门来进行使用。
 */
interface StructureRampart extends OwnedStructure<STRUCTURE_RAMPART> {
  readonly prototype: StructureRampart;

  /**
   * 还有多少 tick 就要因老化而失去生命值。
   */
  ticksToDecay: number;

  /**
   * 当值为 `false` (默认) 时。只有你的 creep 能通过。当值为 `true` 时，任何玩家的 creep 都可以通过。
   */
  isPublic: boolean;

  /**
   * 将该 rampart 的状态设置为开放，从而允许其他玩家的 creep 通过。
   * @param isPublic 该 rampart 是否开放
   */
  setPublic(isPublic: boolean): undefined;
}

interface StructureRampartConstructor extends _Constructor<StructureRampart>, _ConstructorById<StructureRampart> {}

declare const StructureRampart: StructureRampartConstructor;

/**
 * 将每个身体部件的移动成本降低至 `1`。建造道路之后，你就可以用更少的 `MOVE` 身体部件来孵化一个 creep。
 * 你也可以在自然墙壁上建造一个道路来使其可以通行。
 */
interface StructureRoad extends Structure<STRUCTURE_ROAD> {
  readonly prototype: StructureRoad;

  /**
   * 还有多少 tick 就要因老化而失去生命值。
   */
  ticksToDecay: number;
}

interface StructureRoadConstructor extends _Constructor<StructureRoad>, _ConstructorById<StructureRoad> {}

declare const StructureRoad: StructureRoadConstructor;

/**
 * 可以储存大量资源的建筑。每个房间内仅允许建造一个，所以你可以使用 `Room.storage` 属性来快速访问它。
 */
interface StructureStorage extends OwnedStructure<STRUCTURE_STORAGE> {
  readonly prototype: StructureStorage;

  /**
   * 一个包含了该建筑中所存储的货物的 Store 对象。
   */
  store: StoreDefinition;
  /**
   * 此属性已被弃用，将很快删除。
   * @deprecated `.store.getCapacity()` 属性的别名。
   */
  storeCapacity: number;
}

interface StructureStorageConstructor extends _Constructor<StructureStorage>, _ConstructorById<StructureStorage> {}

declare const StructureStorage: StructureStorageConstructor;

/**
 * 远程攻击 creep，治疗 creep，或维修建筑。房间里的任意对象都可以指定为它的目标。然而，效果线性地取决距离。每一个动作都会消耗能量。
 */
interface StructureTower extends OwnedStructure<STRUCTURE_TOWER> {
  readonly prototype: StructureTower;

  /**
   * 此属性已被弃用，将很快删除。
   * @deprecated `.store[RESOURCE_ENERGY]` 的别名。
   */
  energy: number;
  /**
   * 此属性已被弃用，将很快删除。
   * @deprecated `.store.getCapacity(RESOURCE_ENERGY)` 的别名。
   */
  energyCapacity: number;
  /**
   * 一个代表这该结构所存储能量的 `Store` 对象。
   */
  store: Store<RESOURCE_ENERGY, false>;

  /**
   * 远程攻击房间里的任意 creep、超能 creep 或房间内的结构。
   * @param target 目标 creep。
   */
  attack(target: AnyCreep | Structure): ScreepsReturnCode;
  /**
   * 远程治疗房间里的任意 creep 或超能 creep。
   * @param target 目标 creep。
   */
  heal(target: AnyCreep): ScreepsReturnCode;
  /**
   * 远程维修房间里的任意建筑。
   * @param target 目标建筑。
   */
  repair(target: Structure): ScreepsReturnCode;
}

interface StructureTowerConstructor extends _Constructor<StructureTower>, _ConstructorById<StructureTower> {}

declare const StructureTower: StructureTowerConstructor;

/**
 * 阻挡所有 creep 的移动。 玩家可以在已控制的房间中建造可破坏的构筑墙。
 * 有些房间还包含不可破坏的构筑墙，将新手区或重生区与世界其他地方隔开，又或将新手/重生区划分为较小的区域。
 * 不可破坏的构筑墙没有 `hits` 属性。
 */
interface StructureWall extends Structure<STRUCTURE_WALL> {
  readonly prototype: StructureWall;
  /**
   * 该 wall 还有多少 tick 死亡(only for automatically placed border walls at the start of the game)。
   */
  ticksToLive: number;
}

interface StructureWallConstructor extends _Constructor<StructureWall>, _ConstructorById<StructureWall> {}

declare const StructureWall: StructureWallConstructor;

/**
 * 允许采集矿藏 (Mineral)，点击 [本文](https://screeps-cn.github.io/resources.html) 查看更多关于矿物的内容。
 */
interface StructureExtractor extends OwnedStructure<STRUCTURE_EXTRACTOR> {
  readonly prototype: StructureExtractor;
  /**
   * 还有多少 tick 才能进行下次采集 (harvest) 操作。
   */
  cooldown: number;
}

interface StructureExtractorConstructor
  extends _Constructor<StructureExtractor>,
    _ConstructorById<StructureExtractor> {}

declare const StructureExtractor: StructureExtractorConstructor;

/**
 * 使用基础矿物生产化合物，强化(boost) creep 和清除强化。 点击本文来了解更多关于矿物的信息。
 */
interface StructureLab extends OwnedStructure<STRUCTURE_LAB> {
  readonly prototype: StructureLab;
  /**
   * 下次反应或者清除强化之前还需等待多少 tick 的冷却。
   */
  cooldown: number;
  /**
   * 此属性已被弃用，将很快删除。
   * @deprecated `.store[RESOURCE_ENERGY]` 的别名。
   */
  energy: number;
  /**
   * 此属性已被弃用，将很快删除。
   * @deprecated `.store.getCapacity(RESOURCE_ENERGY)` 的别名。
   */
  energyCapacity: number;
  /**
   * 此属性已被弃用，将很快删除。
   * @deprecated `lab.store[lab.mineralType]` 的别名。
   */
  mineralAmount: number;
  /**
   * 该 lab 储存的矿物类型。lab 同一时间内只能储存一种类型的矿物。
   * `null` in case there is no mineral resource in the lab.
   */
  mineralType: MineralConstant | MineralCompoundConstant | null;
  /**
   * 此属性已被弃用，将很快删除。
   * @deprecated `lab.store.getCapacity(lab.mineralType || yourMineral)` 的别名。
   */
  mineralCapacity: number;
  /**
   * 一个包含了该建筑中所存储资源的 `Store` 对象。
   */
  store: Store<RESOURCE_ENERGY | MineralConstant | MineralCompoundConstant, false>;
  /**
   * 使用存储中的矿物强化 creep 的身体部件。creep 必须在相邻与 lab 的正方形区域内。
   * @param creep 目标 creep。
   * @param bodyPartsCount 要强化的指定身体部件的数量。
   *
   * `TOUGH` 身体部件始终是从左到右进行强化，而其他部件则是从右到左。
   *
   * 如果 `undefined`，则对所有合适的身体部件进行强化。
   */
  boostCreep(creep: Creep, bodyPartsCount?: number): ScreepsReturnCode;
  /**
   * 立刻从 creep 身上移除强化并将强化所需的 50% 化合物丢弃在地面上，该操作不会关心 creep 的剩余存活时间。
   * creep 必须在紧邻 lab 的正方形区域内。清除强化所需的冷却时间等于生产强化该 creep 所需化合物的总时间。
   * @param creep 目标 creep。
   */
  unboostCreep(creep: Creep): ScreepsReturnCode;
  /**
   * Breaks mineral compounds back into reagents. The same output labs can be used by many source labs.
   * @param lab1 The first result lab.
   * @param lab2 The second result lab.
   */
  reverseReaction(lab1: StructureLab, lab2: StructureLab): ScreepsReturnCode;
  /**
   * 将化合物还原为其反应底物。同一个输出 lab 可以和多个输入 lab 进行反应。
   * @param lab1 第一个输出 lab。
   * @param lab2 第二个输出 lab。
   */
  runReaction(lab1: StructureLab, lab2: StructureLab): ScreepsReturnCode;
}

interface StructureLabConstructor extends _Constructor<StructureLab>, _ConstructorById<StructureLab> {}

declare const StructureLab: StructureLabConstructor;

/**
 * 终端可以发送任意资源到另一个房间的终端。目标终端可以属于任何一个玩家。 每个事务都需要额外消耗能量（无论传输资源类型如何），
 * 可以使用 `Game.market.calcTransactionCost` 计算所需能量。
 *
 * 例如，从 W0N0 发送 1000 单位矿物到 W10N5 需要消耗 742 单位能量。 你可以使用 `Game.market` 对象跟踪你的收入和支出事务。
 * 一个房间只会有一个终端，所以可以通过 `Room.terminal` 属性访问。
 *
 * 终端可以用于交易系统.
 */
interface StructureTerminal extends OwnedStructure<STRUCTURE_TERMINAL> {
  readonly prototype: StructureTerminal;
  /**
   * 这个终端不能调用 `StructureTerminal.send` 或 `Game.market.deal` 的剩余 tick。
   */
  cooldown: number;
  /**
   * 一个包含了该建筑中所存储资源的 `Store` 对象。
   */
  store: StoreDefinition;
  /**
   * 此属性已被弃用，将很快删除。
   * @deprecated `.store.getCapacity()` 的别名。
   */
  storeCapacity: number;
  /**
   * 发送资源给指定房间的终端
   * @param resourceType `RESOURCE_*` 常量之一。
   * @param amount 发送资源数量。
   * @param destination 目标房间名称。这个房间不需要对你可见。
   * @param description 这个事务的备注。它只对收件人可见。最大长度100字符。
   */
  send(resourceType: ResourceConstant, amount: number, destination: string, description?: string): ScreepsReturnCode;
}

interface StructureTerminalConstructor extends _Constructor<StructureTerminal>, _ConstructorById<StructureTerminal> {}

declare const StructureTerminal: StructureTerminalConstructor;

/**
 * 一个可以用来存储资源的小型容器。这是一个允许走上去的建筑。所有丢弃在同一方格上的资源都会被自动存储到 container 中。
 */
interface StructureContainer extends Structure<STRUCTURE_CONTAINER> {
  readonly prototype: StructureContainer;
  /**
   * 一个包含了该建筑中所存储的货物的 `Store` 对象。
   */
  store: StoreDefinition;
  /**
   * 此属性已被弃用，将很快删除。
   * @deprecated `.store.getCapacity()` 的别名。
   */
  storeCapacity: number;
  /**
   * 还有多少 tick 就要因老化而失去生命值。
   */
  ticksToDecay: number;
}

interface StructureContainerConstructor
  extends _Constructor<StructureContainer>,
    _ConstructorById<StructureContainer> {}

declare const StructureContainer: StructureContainerConstructor;

/**
 * 向其他房间发射一枚核弹，对着落区域造成大量伤害。发射后需要时间冷却且需重新装填能量和 ghodium 资源。
 * 发射后将会在目标房间位置创建一个对任何玩家可见的 [`Nuke`](https://screeps-cn.github.io/api/#Nuke) 对象，直至其着陆。
 * 已发射的核弹无法移动或者取消。核弹不能从新手房间发射或者发射向新手房间。
 * 放置到 `StructureNuker` 中的资源无法被取出 (withdraw)。
 */
interface StructureNuker extends OwnedStructure<STRUCTURE_NUKER> {
  readonly prototype: StructureNuker;
  /**
   * 此属性已被弃用，将很快删除。
   * @deprecated `.store[RESOURCE_ENERGY]` 的别名。
   */
  energy: number;
  /**
   * 此属性已被弃用，将很快删除。
   * @deprecated `.store.getCapacity(RESOURCE_ENERGY)` 的别名。
   */
  energyCapacity: number;
  /**
   * 此属性已被弃用，将很快删除。
   * @deprecated `.store[RESOURCE_GHODIUM]` 的别名。
   */
  ghodium: number;
  /**
   * 此属性已被弃用，将很快删除。
   * @deprecated `.store.getCapacity(RESOURCE_GHODIUM)` 的别名。
   */
  ghodiumCapacity: number;
  /**
   * 下次发射前还需多少 tick 的冷却时间。
   */
  cooldown: number;
  /**
   * 一个包含了该建筑中所存储资源的 `Store` 对象。
   */
  store: Store<RESOURCE_ENERGY | RESOURCE_GHODIUM, false>;
  /**
   * 向指定位置发射核弹。
   * @param pos 目标房间位置
   */
  launchNuke(pos: RoomPosition): ScreepsReturnCode;
}

interface StructureNukerConstructor extends _Constructor<StructureNuker>, _ConstructorById<StructureNuker> {}

declare const StructureNuker: StructureNukerConstructor;

/**
 * 一个非玩家建筑。立刻将你的 creep 传送至一个遥远房间的出口位置。传送门会在每个区块的中央房间随机刷新。
 */
interface StructurePortal extends Structure<STRUCTURE_PORTAL> {
  readonly prototype: StructurePortal;
  /**
   * 如果这是个**通往其他房间**的传送门，则该属性为指向目的地房间出口位置的 `RoomPosition` 对象。
   *
   * 如果这是个**通往其他 shard** 的传送门，则该属性为一个包含了 `shard` 和 `room` 字符串属性的对象。无法确定其具体出口位置，creep 会被随机传送到目标房间的任意空闲位置。
   */
  destination: RoomPosition | { shard: string; room: string };
  /**
   * 还有多少 tick 就要因老化而失去生命值，当传送门稳定时其值为 `undefined`。
   */
  ticksToDecay: number | undefined;
}

interface StructurePortalConstructor extends _Constructor<StructurePortal>, _ConstructorById<StructurePortal> {}

declare const StructurePortal: StructurePortalConstructor;

/**
 * 使用基础矿物和其他商品(commodities)来生产贸易商品。
 */
interface StructureFactory extends OwnedStructure<STRUCTURE_FACTORY> {
  readonly prototype: StructureFactory;
  /**
   * 还有多少 tick 才能进行下一次生产。
   */
  cooldown: number;
  /**
   * 工厂的等级，可以通过 `PWR_OPERATE_FACTORY` 超能来给一个新建的工厂设置等级。 一旦被设置，等级将无法再次更改。
   */
  level: number;
  /**
   * 一个包含了该建筑中所存储的货物的 Store 对象。
   */
  store: StoreDefinition;
  /**
   * 生产指定商品。工厂存储中应该包含所有的生产用料。
   */
  produce(resource: CommodityConstant | MineralConstant | RESOURCE_ENERGY | RESOURCE_GHODIUM): ScreepsReturnCode;
}

interface StructureFactoryConstructor extends _Constructor<StructureFactory>, _ConstructorById<StructureFactory> {}

declare const StructureFactory: StructureFactoryConstructor;

/**
 * 该 NPC 建筑是 NPC 要塞的控制中心，并且也统治着本区块中的所有入侵者。
 *
 * @see https://screeps-cn.github.io/api/#StructureInvaderCore
 */
interface StructureInvaderCore extends OwnedStructure<STRUCTURE_INVADER_CORE> {
  readonly prototype: StructureInvaderCore;
  /**
   * 此要塞的等级。该等级也决定了战利品的数量和质量。
   */
  level: number;
  /**
   * 部署阶段的计时器，在要塞尚未部署完成时显示，否则为 `undefined`。
   */
  ticksToDeploy: number;
}

interface StructureInvaderCoreConstructor
  extends _Constructor<StructureInvaderCore>,
    _ConstructorById<StructureInvaderCore> {}

declare const StructureInvaderCore: StructureInvaderCoreConstructor;

/**
 * A discriminated union on Structure.type of all owned structure types
 */
type AnyOwnedStructure =
  | StructureController
  | StructureExtension
  | StructureExtractor
  | StructureFactory
  | StructureInvaderCore
  | StructureKeeperLair
  | StructureLab
  | StructureLink
  | StructureNuker
  | StructureObserver
  | StructurePowerBank
  | StructurePowerSpawn
  | StructureRampart
  | StructureSpawn
  | StructureStorage
  | StructureTerminal
  | StructureTower;

type AnyStoreStructure =
  | StructureExtension
  | StructureFactory
  | StructureLab
  | StructureLink
  | StructureNuker
  | StructurePowerSpawn
  | StructureSpawn
  | StructureStorage
  | StructureTerminal
  | StructureTower
  | StructureContainer;

/**
 * A discriminated union on Structure.type of all structure types
 */
type AnyStructure = AnyOwnedStructure | StructureContainer | StructurePortal | StructureRoad | StructureWall;

/**
 * Conditional type for all concrete implementations of Structure.
 * Unlike Structure<T>, ConcreteStructure<T> gives you the actual concrete class that extends Structure<T>.
 */
type ConcreteStructure<T extends StructureConstant> = T extends STRUCTURE_EXTENSION
  ? StructureExtension
  : T extends STRUCTURE_RAMPART
  ? StructureRampart
  : T extends STRUCTURE_ROAD
  ? StructureRoad
  : T extends STRUCTURE_SPAWN
  ? StructureSpawn
  : T extends STRUCTURE_LINK
  ? StructureLink
  : T extends STRUCTURE_WALL
  ? StructureWall
  : T extends STRUCTURE_STORAGE
  ? StructureStorage
  : T extends STRUCTURE_TOWER
  ? StructureTower
  : T extends STRUCTURE_OBSERVER
  ? StructureObserver
  : T extends STRUCTURE_POWER_SPAWN
  ? StructurePowerSpawn
  : T extends STRUCTURE_EXTRACTOR
  ? StructureExtractor
  : T extends STRUCTURE_LAB
  ? StructureLab
  : T extends STRUCTURE_TERMINAL
  ? StructureTerminal
  : T extends STRUCTURE_CONTAINER
  ? StructureContainer
  : T extends STRUCTURE_NUKER
  ? StructureNuker
  : T extends STRUCTURE_FACTORY
  ? StructureFactory
  : T extends STRUCTURE_KEEPER_LAIR
  ? StructureKeeperLair
  : T extends STRUCTURE_CONTROLLER
  ? StructureController
  : T extends STRUCTURE_POWER_BANK
  ? StructurePowerBank
  : T extends STRUCTURE_PORTAL
  ? StructurePortal
  : T extends STRUCTURE_INVADER_CORE
  ? StructureInvaderCore
  : never;
