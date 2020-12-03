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
   * The amount of game ticks the link has to wait until the next transfer is possible.
   */
  cooldown: number;
  /**
   * The amount of energy containing in the link.
   * @deprecated An alias for .store[RESOURCE_ENERGY].
   */
  energy: number;
  /**
   * The total amount of energy the link can contain.
   * @deprecated An alias for .store.getCapacity(RESOURCE_ENERGY).
   */
  energyCapacity: number;
  /**
   * A Store object that contains cargo of this structure.
   */
  store: Store<RESOURCE_ENERGY, false>;
  /**
   * Transfer energy from the link to another link or a creep.
   *
   * If the target is a creep, it has to be at adjacent square to the link.
   *
   * If the target is a link, it can be at any location in the same room.
   *
   * Remote transfer process implies 3% energy loss and cooldown delay depending on the distance.
   * @param target The target object.
   * @param amount The amount of energy to be transferred. If omitted, all the available energy is used.
   */
  transferEnergy(target: Creep | StructureLink, amount?: number): ScreepsReturnCode;
}

interface StructureLinkConstructor extends _Constructor<StructureLink>, _ConstructorById<StructureLink> {}

declare const StructureLink: StructureLinkConstructor;

/**
 * Non-player structure. Spawns NPC Source Keepers that guards energy sources
 * and minerals in some rooms. This structure cannot be destroyed.
 */
interface StructureKeeperLair extends OwnedStructure<STRUCTURE_KEEPER_LAIR> {
  readonly prototype: StructureKeeperLair;

  /**
   * Time to spawning of the next Source Keeper.
   */
  ticksToSpawn?: number;
}

interface StructureKeeperLairConstructor
  extends _Constructor<StructureKeeperLair>,
    _ConstructorById<StructureKeeperLair> {}

declare const StructureKeeperLair: StructureKeeperLairConstructor;

/**
 * Provides visibility into a distant room from your script.
 */
interface StructureObserver extends OwnedStructure<STRUCTURE_OBSERVER> {
  readonly prototype: StructureObserver;

  /**
   * Provide visibility into a distant room from your script. The target room object will be available on the next tick. The maximum range is 5 rooms.
   * @param roomName The room to observe.
   */
  observeRoom(roomName: string): ScreepsReturnCode;
}

interface StructureObserverConstructor extends _Constructor<StructureObserver>, _ConstructorById<StructureObserver> {}

declare const StructureObserver: StructureObserverConstructor;

/**
 * Non-player structure. Contains power resource which can be obtained by destroying the structure. Hits the attacker creep back on each attack.
 */
interface StructurePowerBank extends OwnedStructure<STRUCTURE_POWER_BANK> {
  readonly prototype: StructurePowerBank;

  /**
   * The amount of power containing.
   */
  power: number;
  /**
   * The amount of game ticks when this structure will disappear.
   */
  ticksToDecay: number;
}

interface StructurePowerBankConstructor
  extends _Constructor<StructurePowerBank>,
    _ConstructorById<StructurePowerBank> {}

declare const StructurePowerBank: StructurePowerBankConstructor;

/**
 * Non-player structure. Contains power resource which can be obtained by
 * destroying the structure. Hits the attacker creep back on each attack.
 */
interface StructurePowerSpawn extends OwnedStructure<STRUCTURE_POWER_SPAWN> {
  readonly prototype: StructurePowerSpawn;
  /**
   * The amount of energy containing in this structure.
   * @deprecated An alias for .store[RESOURCE_ENERGY].
   */
  energy: number;
  /**
   * The total amount of energy this structure can contain.
   * @deprecated An alias for .store.getCapacity(RESOURCE_ENERGY).
   */
  energyCapacity: number;
  /**
   * The amount of power containing in this structure.
   * @deprecated An alias for .store[RESOURCE_POWER].
   */
  power: number;
  /**
   * The total amount of power this structure can contain.
   * @deprecated An alias for .store.getCapacity(RESOURCE_POWER).
   */
  powerCapacity: number;
  /**
   *
   */
  store: Store<RESOURCE_ENERGY | RESOURCE_POWER, false>;

  /**
   * Register power resource units into your account. Registered power allows to develop power creeps skills. Consumes 1 power resource unit and 50 energy resource units.
   */
  processPower(): ScreepsReturnCode;
}

interface StructurePowerSpawnConstructor
  extends _Constructor<StructurePowerSpawn>,
    _ConstructorById<StructurePowerSpawn> {}

declare const StructurePowerSpawn: StructurePowerSpawnConstructor;

/**
 * Blocks movement of hostile creeps, and defends your creeps and structures on
 * the same tile. Can be used as a controllable gate.
 */
interface StructureRampart extends OwnedStructure<STRUCTURE_RAMPART> {
  readonly prototype: StructureRampart;

  /**
   * The amount of game ticks when this rampart will lose some hit points.
   */
  ticksToDecay: number;

  /**
   * If false (default), only your creeps can step on the same square. If true, any hostile creeps can pass through.
   */
  isPublic: boolean;

  /**
   * Make this rampart public to allow other players' creeps to pass through.
   * @param isPublic Whether this rampart should be public or non-public
   */
  setPublic(isPublic: boolean): undefined;
}

interface StructureRampartConstructor extends _Constructor<StructureRampart>, _ConstructorById<StructureRampart> {}

declare const StructureRampart: StructureRampartConstructor;

/**
 * Decreases movement cost to 1. Using roads allows creating creeps with less
 * `MOVE` body parts.
 */
interface StructureRoad extends Structure<STRUCTURE_ROAD> {
  readonly prototype: StructureRoad;

  /**
   * The amount of game ticks when this road will lose some hit points.
   */
  ticksToDecay: number;
}

interface StructureRoadConstructor extends _Constructor<StructureRoad>, _ConstructorById<StructureRoad> {}

declare const StructureRoad: StructureRoadConstructor;

/**
 * A structure that can store huge amount of resource units. Only one structure
 * per room is allowed that can be addressed by `Room.storage` property.
 */
interface StructureStorage extends OwnedStructure<STRUCTURE_STORAGE> {
  readonly prototype: StructureStorage;

  /**
   * An object with the storage contents.
   */
  store: StoreDefinition;
  /**
   * The total amount of resources the storage can contain.
   * @deprecated An alias for .store.getCapacity().
   */
  storeCapacity: number;
}

interface StructureStorageConstructor extends _Constructor<StructureStorage>, _ConstructorById<StructureStorage> {}

declare const StructureStorage: StructureStorageConstructor;

/**
 * Remotely attacks or heals creeps, or repairs structures. Can be targeted to
 * any object in the room. However, its effectiveness highly depends on the
 * distance. Each action consumes energy.
 */
interface StructureTower extends OwnedStructure<STRUCTURE_TOWER> {
  readonly prototype: StructureTower;

  /**
   * The amount of energy containing in this structure.
   * @deprecated An alias for .store[RESOURCE_ENERGY].
   */
  energy: number;
  /**
   * The total amount of energy this structure can contain.
   * @deprecated An alias for .store.getCapacity(RESOURCE_ENERGY).
   */
  energyCapacity: number;
  /**
   * A Store object that contains cargo of this structure.
   */
  store: Store<RESOURCE_ENERGY, false>;

  /**
   * Remotely attack any creep or structure in the room. Consumes 10 energy units per tick. Attack power depends on the distance to the target: from 600 hits at range 10 to 300 hits at range 40.
   * @param target The target creep.
   */
  attack(target: AnyCreep | Structure): ScreepsReturnCode;
  /**
   * Remotely heal any creep in the room. Consumes 10 energy units per tick. Heal power depends on the distance to the target: from 400 hits at range 10 to 200 hits at range 40.
   * @param target The target creep.
   */
  heal(target: AnyCreep): ScreepsReturnCode;
  /**
   * Remotely repair any structure in the room. Consumes 10 energy units per tick. Repair power depends on the distance to the target: from 600 hits at range 10 to 300 hits at range 40.
   * @param target The target structure.
   */
  repair(target: Structure): ScreepsReturnCode;
}

interface StructureTowerConstructor extends _Constructor<StructureTower>, _ConstructorById<StructureTower> {}

declare const StructureTower: StructureTowerConstructor;

/**
 * Blocks movement of all creeps.
 */
interface StructureWall extends Structure<STRUCTURE_WALL> {
  readonly prototype: StructureWall;
  /**
   * The amount of game ticks when the wall will disappear (only for automatically placed border walls at the start of the game).
   */
  ticksToLive: number;
}

interface StructureWallConstructor extends _Constructor<StructureWall>, _ConstructorById<StructureWall> {}

declare const StructureWall: StructureWallConstructor;

/**
 * Allows to harvest mineral deposits.
 */
interface StructureExtractor extends OwnedStructure<STRUCTURE_EXTRACTOR> {
  readonly prototype: StructureExtractor;
  /**
   * The amount of game ticks until the next harvest action is possible.
   */
  cooldown: number;
}

interface StructureExtractorConstructor
  extends _Constructor<StructureExtractor>,
    _ConstructorById<StructureExtractor> {}

declare const StructureExtractor: StructureExtractorConstructor;

/**
 * Produces mineral compounds from base minerals and boosts creeps.
 */
interface StructureLab extends OwnedStructure<STRUCTURE_LAB> {
  readonly prototype: StructureLab;
  /**
   * The amount of game ticks the lab has to wait until the next reaction is possible.
   */
  cooldown: number;
  /**
   * The amount of energy containing in the lab. Energy is used for boosting creeps.
   * @deprecated An alias for .store[RESOURCE_ENERGY].
   */
  energy: number;
  /**
   * The total amount of energy the lab can contain.
   * @deprecated An alias for .store.getCapacity(RESOURCE_ENERGY).
   */
  energyCapacity: number;
  /**
   * The amount of mineral resources containing in the lab.
   * @deprecated An alias for lab.store[lab.mineralType].
   */
  mineralAmount: number;
  /**
   * The type of minerals containing in the lab. Labs can contain only one mineral type at the same time.
   * Null in case there is no mineral resource in the lab.
   */
  mineralType: MineralConstant | MineralCompoundConstant | null;
  /**
   * The total amount of minerals the lab can contain.
   * @deprecated An alias for lab.store.getCapacity(lab.mineralType || yourMineral).
   */
  mineralCapacity: number;
  /**
   * A Store object that contains cargo of this structure.
   */
  store: Store<RESOURCE_ENERGY | MineralConstant | MineralCompoundConstant, false>;
  /**
   * Boosts creep body part using the containing mineral compound. The creep has to be at adjacent square to the lab. Boosting one body part consumes 30 mineral units and 20 energy units.
   * @param creep The target creep.
   * @param bodyPartsCount The number of body parts of the corresponding type to be boosted.
   *
   * Body parts are always counted left-to-right for TOUGH, and right-to-left for other types.
   *
   * If undefined, all the eligible body parts are boosted.
   */
  boostCreep(creep: Creep, bodyPartsCount?: number): ScreepsReturnCode;
  /**
   * Immediately remove boosts from the creep and drop 50% of the mineral compounds used to boost it onto the ground regardless of the creep's remaining time to live.
   * The creep has to be at adjacent square to the lab.
   * Unboosting requires cooldown time equal to the total sum of the reactions needed to produce all the compounds applied to the creep.
   * @param creep The target creep.
   */
  unboostCreep(creep: Creep): ScreepsReturnCode;
  /**
   * Breaks mineral compounds back into reagents. The same output labs can be used by many source labs.
   * @param lab1 The first result lab.
   * @param lab2 The second result lab.
   */
  reverseReaction(lab1: StructureLab, lab2: StructureLab): ScreepsReturnCode;
  /**
   * Produce mineral compounds using reagents from two another labs. Each lab has to be within 2 squares range. The same input labs can be used by many output labs
   * @param lab1 The first source lab.
   * @param lab2 The second source lab.
   */
  runReaction(lab1: StructureLab, lab2: StructureLab): ScreepsReturnCode;
}

interface StructureLabConstructor extends _Constructor<StructureLab>, _ConstructorById<StructureLab> {}

declare const StructureLab: StructureLabConstructor;

/**
 * Sends any resources to a Terminal in another room.
 */
interface StructureTerminal extends OwnedStructure<STRUCTURE_TERMINAL> {
  readonly prototype: StructureTerminal;
  /**
   * The remaining amount of ticks while this terminal cannot be used to make StructureTerminal.send or Game.market.deal calls.
   */
  cooldown: number;
  /**
   * A Store object that contains cargo of this structure.
   */
  store: StoreDefinition;
  /**
   * The total amount of resources the storage can contain.
   * @deprecated An alias for .store.getCapacity().
   */
  storeCapacity: number;
  /**
   * Sends resource to a Terminal in another room with the specified name.
   * @param resourceType One of the RESOURCE_* constants.
   * @param amount The amount of resources to be sent.
   * @param destination The name of the target room. You don't have to gain visibility in this room.
   * @param description The description of the transaction. It is visible to the recipient. The maximum length is 100 characters.
   */
  send(resourceType: ResourceConstant, amount: number, destination: string, description?: string): ScreepsReturnCode;
}

interface StructureTerminalConstructor extends _Constructor<StructureTerminal>, _ConstructorById<StructureTerminal> {}

declare const StructureTerminal: StructureTerminalConstructor;

/**
 * Contains up to 2,000 resource units. Can be constructed in neutral rooms. Decays for 5,000 hits per 100 ticks.
 */
interface StructureContainer extends Structure<STRUCTURE_CONTAINER> {
  readonly prototype: StructureContainer;
  /**
   * An object with the structure contents. Each object key is one of the RESOURCE_* constants, values are resources
   * amounts. Use _.sum(structure.store) to get the total amount of contents
   */
  store: StoreDefinition;
  /**
   * The total amount of resources the structure can contain.
   * @deprecated An alias for .store.getCapacity().
   */
  storeCapacity: number;
  /**
   * The amount of game ticks when this container will lose some hit points.
   */
  ticksToDecay: number;
}

interface StructureContainerConstructor
  extends _Constructor<StructureContainer>,
    _ConstructorById<StructureContainer> {}

declare const StructureContainer: StructureContainerConstructor;

/**
 * Launches a nuke to another room dealing huge damage to the landing area.
 * Each launch has a cooldown and requires energy and ghodium resources. Launching
 * creates a Nuke object at the target room position which is visible to any player
 * until it is landed. Incoming nuke cannot be moved or cancelled. Nukes cannot
 * be launched from or to novice rooms.
 */
interface StructureNuker extends OwnedStructure<STRUCTURE_NUKER> {
  readonly prototype: StructureNuker;
  /**
   * The amount of energy contained in this structure.
   * @deprecated An alias for .store[RESOURCE_ENERGY].
   */
  energy: number;
  /**
   * The total amount of energy this structure can contain.
   * @deprecated An alias for .store.getCapacity(RESOURCE_ENERGY).
   */
  energyCapacity: number;
  /**
   * The amount of energy contained in this structure.
   * @deprecated An alias for .store[RESOURCE_GHODIUM].
   */
  ghodium: number;
  /**
   * The total amount of energy this structure can contain.
   * @deprecated An alias for .store.getCapacity(RESOURCE_GHODIUM).
   */
  ghodiumCapacity: number;
  /**
   * The amount of game ticks the link has to wait until the next transfer is possible.
   */
  cooldown: number;
  /**
   * A Store object that contains cargo of this structure.
   */
  store: Store<RESOURCE_ENERGY | RESOURCE_GHODIUM, false>;
  /**
   * Launch a nuke to the specified position.
   * @param pos The target room position.
   */
  launchNuke(pos: RoomPosition): ScreepsReturnCode;
}

interface StructureNukerConstructor extends _Constructor<StructureNuker>, _ConstructorById<StructureNuker> {}

declare const StructureNuker: StructureNukerConstructor;

/**
 * A non-player structure.
 * Instantly teleports your creeps to a distant room acting as a room exit tile.
 * Portals appear randomly in the central room of each sector.
 */
interface StructurePortal extends Structure<STRUCTURE_PORTAL> {
  readonly prototype: StructurePortal;
  /**
   * If this is an inter-room portal, then this property contains a RoomPosition object leading to the point in the destination room.
   * If this is an inter-shard portal, then this property contains an object with shard and room string properties.
   * Exact coordinates are undetermined, the creep will appear at any free spot in the destination room.
   */
  destination: RoomPosition | { shard: string; room: string };
  /**
   * The amount of game ticks when the portal disappears, or undefined when the portal is stable.
   */
  ticksToDecay: number | undefined;
}

interface StructurePortalConstructor extends _Constructor<StructurePortal>, _ConstructorById<StructurePortal> {}

declare const StructurePortal: StructurePortalConstructor;

/**
 * A structure which produces trade commodities from base minerals and other commodities.
 */
interface StructureFactory extends OwnedStructure<STRUCTURE_FACTORY> {
  readonly prototype: StructureFactory;
  /**
   * The amount of game ticks the factory has to wait until the next produce is possible.
   */
  cooldown: number;
  /**
   * The level of the factory.
   * Can be set by applying the PWR_OPERATE_FACTORY power to a newly built factory.
   * Once set, the level cannot be changed.
   */
  level: number;
  /**
   * An object with the structure contents.
   */
  store: StoreDefinition;
  /**
   * Produces the specified commodity.
   * All ingredients should be available in the factory store.
   */
  produce(resource: CommodityConstant | MineralConstant | RESOURCE_ENERGY | RESOURCE_GHODIUM): ScreepsReturnCode;
}

interface StructureFactoryConstructor extends _Constructor<StructureFactory>, _ConstructorById<StructureFactory> {}

declare const StructureFactory: StructureFactoryConstructor;

/**
 * A structure which is a control center of NPC Strongholds, and also rules all invaders in the sector.
 */
interface StructureInvaderCore extends OwnedStructure<STRUCTURE_INVADER_CORE> {
  readonly prototype: StructureInvaderCore;
  /**
   * The level of the stronghold. The amount and quality of the loot depends on the level.
   */
  level: number;
  /**
   * Shows the timer for a not yet deployed stronghold, undefined otherwise.
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
