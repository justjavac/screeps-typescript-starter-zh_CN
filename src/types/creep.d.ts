/**
 * creep 是你的单位。
 *
 * creep 可以移动、采集能量、建造建筑、攻击其他 creep 以及执行其他动作。
 *
 * 每个 creep 都由最多 50 个身体部件构成，身体部件的类型如下：
 *
 * ![](https://screeps-cn.github.io/api/img/bodyparts.png)
 *
 * 身体部件 | 孵化成本 | 每个部件效果
 * :---- | :--- | :-----
 * `MOVE` | `50` | 每 tick 减少 2 点疲惫值
 * `WORK` | `100` | 每 tick 从能量源采集 2 单位能量。
 * || 每 tick 从矿区采集 1 单位矿物。
 * || 每 tick 增加工地建设进度 5 点，花费 5 单位能量。
 * || 每 tick 增加建筑 100 耐久度，花费 1 单位能量。
 * || 每 tick 拆减建筑 50 点耐久，并返还 0.25 单位能量。
 * || 每 tick 提高控制器升级进度 1 点，花费 1 单位能量。
 * `CARRY` | `50` | 携带最多 50 单位资源。
 * `ATTACK` | `80` | 对相邻的 creep 或建筑造成 30 点伤害。
 * `RANGED_ATTACK` | `150` | 单个目标时，每 tick 对 creep 或建筑造成 10 点伤害，范围为 3 格。
 * || 多个目标时，每 tick 对范围内所有 creep 与建筑造成 1-4-10 点伤害，具体伤害取决于距离，范围为 3 格。
 * `HEAL` | `250` | 治疗对象可为自己或其它 creep。自愈或治疗相邻 creep 时每 tick 恢复 12 点耐久，一定距离内远程治疗每 tick 恢复 4 点耐久。
 * `CLAIM` | `600` | 占领一个中立房间的控制器。
 * || 每部件每 tick 使己方对中立房间控制器的预定时间增加 1 tick，或使其他玩家的预定时间减少 1 tick。
 * || 每部件每 tick 使其他玩家控制器降级计数器加速 300 tick。
 * || 注：拥有该部件的 creep 寿命只有 600 tick，且无法被 renew。
 * `TOUGH` | `10` | 无附加效果，唯一作用是增加 creep 的最大耐久值。可被强化以承受更多伤害。
 */
interface Creep extends RoomObject {
  readonly prototype: Creep;

  /**
   * 一个描述了该 creep 身体部件的数组，每一个数组元素都拥有如下的属性:
   *
   * 参数 | 类型 | 描述
   * :---- | :--- | :-----
   * boost | `string` \| `undefined` | 如果该身体部件被强化(boost)了，则该属性指定了强化所用的化合物类型。化合物为 `RESOURCE_*` 常量之一。
   * type | `string` | 身体部件常量之一。
   * hits | `number` | 该身体部件剩余的生命值。
   */
  body: BodyPartDefinition[];
  /**
   * **已废弃**
   *
   * 一个包含了该建筑中所存储的货物的 [`Store`](https://screeps-cn.github.io/api/#Store) 对象。
   * @deprecated [`Creep.store`](https://screeps-cn.github.io/api/#Creep.store) 的别名。
   */
  carry: StoreDefinition;
  /**
   * **已废弃**
   *
   * 返回指定资源的存储容量, 对于通用型 store，当 reource 参数为 `undefined` 则返回总容量。
   * @deprecated [`Creep.store.getCapacity()`](https://screeps-cn.github.io/api/#Store.getCapacity) 的别名。
   */
  carryCapacity: number;
  /**
   * 每次移动的疲劳值指示器，当该值大于零时 creep 无法移动。
   */
  fatigue: number;
  /**
   * 当前的 creep 生命值。
   */
  hits: number;
  /**
   * 该 creep 的最大生命值。
   */
  hitsMax: number;
  /**
   * 一个唯一的对象标识。你可以使用 [`Game.getObjectById`](https://screeps-cn.github.io/api/#Game.getObjectById) 方法获取对象实例。
   */
  id: Id<this>;
  /**
   * 指向 `Memory.creeps[creep.name]` 的链接。你可以用它来快速访问该 creep 的特定内存对象。[点此了解更多关于 memory 的信息](https://screeps-cn.github.io/global-objects.html#Memory-object)
   */
  memory: CreepMemory;
  /**
   * 该 creep 属于您还是其他人。
   */
  my: boolean;
  /**
   * creep 的名字。您可以在创建一个新的 creep 时给它取名，名称一旦指定无法更改。此名称是 `Game.creeps` 对象中指向该 creep 对象的哈希键。你可以使用它来快速访问到该 creep。
   */
  name: string;
  /**
   * 该 creep 的所有者信息。
   */
  owner: Owner;
  /**
   * Room 对象的链接。如果对象是标志或工地并且放置在你不可见的房间中，则可能为 `undefined`。
   */
  room: Room;
  /**
   * 该 creep 是否仍在孵化中。
   */
  spawning: boolean;
  /**
   * creep 所说的最后一句话。
   */
  saying: string;
  /**
   * 一个包含了该建筑中所存储的货物的 [`Store`](https://screeps-cn.github.io/api/#Store) 对象。
   */
  store: StoreDefinition;
  /**
   * 该 creep 还有多少 tick 死亡。
   *
   * 当 creep 还正在孵化时，值为 `undefined`。
   */
  ticksToLive: number | undefined;
  /**
   * 使用近战攻击其他 creep、超能(power) creep 或建筑。需要 ATTACK 身体部件。如果目标在 rampart 中，则优先攻击 rampart。
   *
   * 目标必须与 creep 相邻，如果目标是一个带有 ATTACK 身体的 creep 并且没有自己没有在 rampart 中，则该目标会自动进行反击。
   *
   * @param target 要攻击的目标
   *
   * @returns 如下错误码之一：
   *
   * 常量 | 值 | 描述
   * :---- | :--- | :-----
   * `OK` | `0` | 这个操作已经成功纳入计划。
   * `ERR_NOT_OWNER` | `-1` | 你不是这个 creep 的拥有者。
   * `ERR_BUSY` | `-4` | 这个 creep 依然在孵化中。
   * `ERR_INVALID_TARGET` | `-7` | 这个目标不是一个有效的攻击目标。
   * `ERR_NOT_IN_RANGE` | `-9` | 目标太远了。
   * `ERR_NO_BODYPART` | `-12` | 这个 creep 身上没有 `ATTACK` 部件。
   */
  attack(target: AnyCreep | Structure): CreepActionReturnCode;
  /**
   * 攻击时，每个 `CLAIM` 身体部件都能使得房间控制器的降级计时器降低 300 tick，或者将预定计时器降低 1 tick。
   *
   * 如果受到攻击的控制器已经有所属者，则接下来的 1000 tick 将无法升级(upgrade)或再次进行攻击。目标必须与 creep 相邻。
   *
   * @param target 目标房间控制器对象。
   *
   * @returns  如下错误码之一：
   *
   * 常量 | 值 | 描述
   * :---- | :--- | :-----
   * `OK` | `0` | 这个操作已经成功纳入计划。
   * `ERR_NOT_OWNER` | `-1` | 你不是这个 creep 的拥有者。
   * `ERR_BUSY` | `-4` | 这个 creep 依然在孵化中。
   * `ERR_INVALID_TARGET` | `-7` | 该目标不存在有效的所属者或者预订者对象。
   * `ERR_NOT_IN_RANGE` | `-9` | 目标太远了。
   * `ERR_TIRED` | `-11` | 您必须等待控制器可以被再次攻击。
   * `ERR_NO_BODYPART` | `-12` | 这个 creep 身上没有 `CLAIM` 部件。
   */
  attackController(target: StructureController): CreepActionReturnCode;
  /**
   * 使用自己携带的能量来在目标工地上建造一个建筑。需要 `WORK` 和 `CARRY` 身体部件。
   *
   * 目标必须位于以 creep 为中心的 7*7 正方形区域内。
   *
   * @param target 待建造的目标工地。
   * @returns 如下错误码之一：
   *
   * 常量 | 值 | 描述
   * :---- | :--- | :-----
   * `OK` | `0` | 这个操作已经成功纳入计划。
   * `ERR_NOT_OWNER` | `-1` | 你不是这个 creep 的拥有者。
   * `ERR_BUSY` | `-4` | 这个 creep 依然在孵化中。
   * `ERR_NOT_ENOUGH_RESOURCES` | `-6` | 这个 creep 没有携带任何能量。
   * `ERR_INVALID_TARGET` | `-7` | 该目标不是一个有效的建筑工地(construction site)或者此处无法建造建筑(有可能是 creep 站在该地块上导致的)。
   * `ERR_NOT_IN_RANGE` | `-9` | 目标太远了。
   * `ERR_NO_BODYPART` | `-12` | 这个 creep 身上没有 `WORK` 部件。
   */
  build(target: ConstructionSite): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_RCL_NOT_ENOUGH;
  /**
   * 取消当前 tick 中给出的某个指令。
   * @param methodName 需要被取消的 creep 方法名。
   * @returns 如下错误码之一：
   *
   * 常量 | 值 | 描述
   * :---- | :--- | :-----
   * `OK` | `0` | 这个操作被成功取消了。
   * `ERR_NOT_FOUND` | `-5` | 找不到给出的指令名。
   */
  cancelOrder(methodName: string): OK | ERR_NOT_FOUND;
  /**
   * 占领一个中立的房间。
   *
   * 需要 CLAIM 身体部件。
   *
   * - 目标必须与 creep 相邻。你需要有对应的全局控制等级(Global Control Level)才能占领新的房间。
   * - 如果你没有足够的 GCL。请考虑[预定(reserving)](https://screeps-cn.github.io/api/#reserveController) 该房间。
   *
   * [点击了解更多](https://screeps-cn.github.io/control.html#Global-Control-Level)
   *
   * @param target 目标控制中心对象。
   * @returns 如下错误码之一：
   *
   * 常量 | 值 | 描述
   * :---- | :--- | :-----
   * `OK` | `0` | 这个操作已经成功纳入计划。
   * `ERR_NOT_OWNER` | `-1` | 你不是这个 creep 的拥有者。
   * `ERR_BUSY` | `-4` | 这个 creep 依然在孵化中。
   * `ERR_NOT_ENOUGH_RESOURCES` | `-6` | 这个 creep 没有携带任何能量。
   * `ERR_INVALID_TARGET` | `-7` | 目标不是一个有效的中立控制中心对象。
   * `ERR_FULL` | `-8` | 你不能在新手区占领超过3个房间。
   * `ERR_NOT_IN_RANGE` | `-9` | 目标太远了。
   * `ERR_NO_BODYPART` | `-12` | 这个 creep 身上没有 `CLAIM` 部件。
   * `ERR_GCL_NOT_ENOUGH` | `-15` | 你的全局控制等级不足。
   */
  claimController(target: StructureController): CreepActionReturnCode | ERR_FULL | ERR_GCL_NOT_ENOUGH;
  /**
   * 拆解任意可以建造的建筑（即使是敌人的）并且返回 50% 其修理所花的能量。
   *
   * 需要 `WORK` 身体部件。如果 creep 有空余的 `CARRY` 身体部件，则会直接将能量转移进去；否则能量将掉落在地上。
   *
   * 目标必须与 creep 相邻。
   * @param target 目标建筑。
   */
  dismantle(target: Structure): CreepActionReturnCode;
  /**
   * Drop this resource on the ground.
   * @param resourceType One of the RESOURCE_* constants.
   * @param amount The amount of resource units to be dropped. If omitted, all the available carried amount is used.
   */
  drop(resourceType: ResourceConstant, amount?: number): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NOT_ENOUGH_RESOURCES;
  /**
   * Add one more available safe mode activation to a room controller. The creep has to be at adjacent square to the target room controller and have 1000 ghodium resource.
   * @param target The target room controller.
   * @returns Result Code: OK, ERR_NOT_OWNER, ERR_BUSY, ERR_NOT_ENOUGH_RESOURCES, ERR_INVALID_TARGET, ERR_NOT_IN_RANGE
   */
  generateSafeMode(target: StructureController): CreepActionReturnCode;
  /**
   * Get the quantity of live body parts of the given type. Fully damaged parts do not count.
   * @param type A body part type, one of the following body part constants: MOVE, WORK, CARRY, ATTACK, RANGED_ATTACK, HEAL, TOUGH, CLAIM
   */
  getActiveBodyparts(type: BodyPartConstant): number;
  /**
   * Harvest energy from the source or resource from minerals or deposits.
   *
   * Needs the WORK body part.
   *
   * If the creep has an empty CARRY body part, the harvested resource is put into it; otherwise it is dropped on the ground.
   *
   * The target has to be at an adjacent square to the creep.
   * @param target The source object to be harvested.
   */
  harvest(target: Source | Mineral | Deposit): CreepActionReturnCode | ERR_NOT_FOUND | ERR_NOT_ENOUGH_RESOURCES;
  /**
   * Heal self or another creep. It will restore the target creep’s damaged body parts function and increase the hits counter.
   *
   * Needs the HEAL body part.
   *
   * The target has to be at adjacent square to the creep.
   * @param target The target creep object.
   */
  heal(target: AnyCreep): CreepActionReturnCode;
  /**
   * Move the creep one square in the specified direction or towards a creep that is pulling it.
   *
   * Requires the MOVE body part if not being pulled.
   * @param direction The direction to move in (`TOP`, `TOP_LEFT`...)
   */
  move(direction: DirectionConstant): CreepMoveReturnCode;
  move(target: Creep): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NOT_IN_RANGE | ERR_INVALID_ARGS;
  /**
   * Move the creep using the specified predefined path. Needs the MOVE body part.
   * @param path A path value as returned from Room.findPath or RoomPosition.findPathTo methods. Both array form and serialized string form are accepted.
   */
  moveByPath(path: PathStep[] | RoomPosition[] | string): CreepMoveReturnCode | ERR_NOT_FOUND | ERR_INVALID_ARGS;
  /**
   * Find the optimal path to the target within the same room and move to it.
   * A shorthand to consequent calls of pos.findPathTo() and move() methods.
   * If the target is in another room, then the corresponding exit will be used as a target.
   *
   * Needs the MOVE body part.
   * @param x X position of the target in the room.
   * @param y Y position of the target in the room.
   * @param opts An object containing pathfinding options flags (see Room.findPath for more info) or one of the following: reusePath, serializeMemory, noPathFinding
   */
  moveTo(x: number, y: number, opts?: MoveToOpts): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET;
  /**
   * Find the optimal path to the target within the same room and move to it.
   * A shorthand to consequent calls of pos.findPathTo() and move() methods.
   * If the target is in another room, then the corresponding exit will be used as a target.
   *
   * Needs the MOVE body part.
   * @param target Can be a RoomPosition object or any object containing RoomPosition.
   * @param opts An object containing pathfinding options flags (see Room.findPath for more info) or one of the following: reusePath, serializeMemory, noPathFinding
   */
  moveTo(
    target: RoomPosition | { pos: RoomPosition },
    opts?: MoveToOpts
  ): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND;
  /**
   * Toggle auto notification when the creep is under attack. The notification will be sent to your account email. Turned on by default.
   * @param enabled Whether to enable notification or disable.
   */
  notifyWhenAttacked(enabled: boolean): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_INVALID_ARGS;
  /**
   * Pick up an item (a dropped piece of energy). Needs the CARRY body part. The target has to be at adjacent square to the creep or at the same square.
   * @param target The target object to be picked up.
   */
  pickup(target: Resource): CreepActionReturnCode | ERR_FULL;
  /**
   * Allow another creep to follow this creep. The fatigue generated for the target's move will be added to the creep instead of the target.
   *
   * Requires the MOVE body part. The target must be adjacent to the creep. The creep must move elsewhere, and the target must move towards the creep.
   * @param target The target creep to be pulled.
   */
  pull(target: Creep): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_INVALID_TARGET | ERR_NOT_IN_RANGE | ERR_NO_BODYPART;
  /**
   * A ranged attack against another creep or structure.
   *
   * Needs the RANGED_ATTACK body part. If the target is inside a rampart, the rampart is attacked instead.
   *
   * The target has to be within 3 squares range of the creep.
   * @param target The target object to be attacked.
   */
  rangedAttack(target: AnyCreep | Structure): CreepActionReturnCode;
  /**
   * Heal another creep at a distance.
   *
   * It will restore the target creep’s damaged body parts function and increase the hits counter.
   *
   * Needs the HEAL body part. The target has to be within 3 squares range of the creep.
   * @param target The target creep object.
   */
  rangedHeal(target: AnyCreep): CreepActionReturnCode;
  /**
   * A ranged attack against all hostile creeps or structures within 3 squares range.
   *
   * Needs the RANGED_ATTACK body part.
   *
   * The attack power depends on the range to each target. Friendly units are not affected.
   */
  rangedMassAttack(): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NO_BODYPART;
  /**
   * Repair a damaged structure using carried energy. Needs the WORK and CARRY body parts. The target has to be within 3 squares range of the creep.
   * @param target The target structure to be repaired.
   */
  repair(target: Structure): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES;
  /**
   * Temporarily block a neutral controller from claiming by other players.
   *
   * Each tick, this command increases the counter of the period during which the controller is unavailable by 1 tick per each CLAIM body part.
   *
   * The maximum reservation period to maintain is 5,000 ticks.
   *
   * The target has to be at adjacent square to the creep....
   * @param target The target controller object to be reserved.
   * @return Result code: OK, ERR_NOT_OWNER, ERR_BUSY, ERR_INVALID_TARGET, ERR_NOT_IN_RANGE, ERR_NO_BODYPART
   */
  reserveController(target: StructureController): CreepActionReturnCode;
  /**
   * Display a visual speech balloon above the creep with the specified message.
   *
   * The message will disappear after a few seconds. Useful for debugging purposes.
   *
   * Only the creep's owner can see the speech message unless toPublic is true.
   * @param message The message to be displayed. Maximum length is 10 characters.
   * @param set to 'true' to allow other players to see this message. Default is 'false'.
   */
  say(message: string, toPublic?: boolean): OK | ERR_NOT_OWNER | ERR_BUSY;
  /**
   * Sign a controller with a random text visible to all players. This text will appear in the room UI, in the world map, and can be accessed via the API.
   * You can sign unowned and hostile controllers. The target has to be at adjacent square to the creep. Pass an empty string to remove the sign.
   * @param target The target controller object to be signed.
   * @param text The sign text. The maximum text length is 100 characters.
   * @returns Result Code: OK, ERR_BUSY, ERR_INVALID_TARGET, ERR_NOT_IN_RANGE
   */
  signController(target: StructureController, text: string): OK | ERR_BUSY | ERR_INVALID_TARGET | ERR_NOT_IN_RANGE;
  /**
   * Kill the creep immediately.
   */
  suicide(): OK | ERR_NOT_OWNER | ERR_BUSY;
  /**
   * Transfer resource from the creep to another object. The target has to be at adjacent square to the creep.
   * @param target The target object.
   * @param resourceType One of the RESOURCE_* constants
   * @param amount The amount of resources to be transferred. If omitted, all the available carried amount is used.
   */
  transfer(target: AnyCreep | Structure, resourceType: ResourceConstant, amount?: number): ScreepsReturnCode;
  /**
   * Upgrade your controller to the next level using carried energy.
   *
   * Upgrading controllers raises your Global Control Level in parallel.
   *
   * Needs WORK and CARRY body parts.
   *
   * The target has to be at adjacent square to the creep.
   *
   * A fully upgraded level 8 controller can't be upgraded with the power over 15 energy units per tick regardless of creeps power.
   *
   * The cumulative effect of all the creeps performing upgradeController in the current tick is taken into account.
   * @param target The target controller object to be upgraded.
   */
  upgradeController(target: StructureController): ScreepsReturnCode;
  /**
   * Withdraw resources from a structure, a tombstone or a ruin.
   *
   * The target has to be at adjacent square to the creep.
   *
   * Multiple creeps can withdraw from the same structure in the same tick.
   *
   * Your creeps can withdraw resources from hostile structures as well, in case if there is no hostile rampart on top of it.
   * @param target The target object.
   * @param resourceType The target One of the RESOURCE_* constants..
   * @param amount The amount of resources to be transferred. If omitted, all the available amount is used.
   */
  withdraw(target: Structure | Tombstone | Ruin, resourceType: ResourceConstant, amount?: number): ScreepsReturnCode;
}

interface CreepConstructor extends _Constructor<Creep>, _ConstructorById<Creep> {}

declare const Creep: CreepConstructor;
