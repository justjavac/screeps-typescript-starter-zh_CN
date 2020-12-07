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
   * 将资源丢弃到地上。
   * @param resourceType `RESOURCE_*` 常量之一。
   * @param amount 丢弃资源的数量。如果没有这个参数，丢弃全部资源。
   */
  drop(resourceType: ResourceConstant, amount?: number): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NOT_ENOUGH_RESOURCES;
  /**
   * 向房间控制器添加一个新的安全模式激活次数。creep 必须与房间控制器相邻并且带有 1000 ghodium 资源。
   * @param target 目标控制中心。
   * @returns
   * 如下错误码之一：
   *
   * 常量 | 值 | 描述
   * :---- | :--- | :-----
   * `OK` | `0` | 这个操作已经成功纳入计划。
   * `ERR_NOT_OWNER` | `-1` | 你不是这个 creep 的拥有者。
   * `ERR_BUSY` | `-4` | 这个 creep 依然在孵化中。
   * `ERR_NOT_ENOUGH_RESOURCES` | `-6` | 这个 creep 没有足够的 ghodium。
   * `ERR_INVALID_TARGET` | `-7` | 目标不是一个有效的控制中心对象。
   * `ERR_NOT_IN_RANGE` | `-9` | 目标太远了。
   */
  generateSafeMode(target: StructureController): CreepActionReturnCode;
  /**
   * 获取指定类型可用的身体部件数量。完全毁坏的部件不会被计算。
   * @param type 一个身体部件类型，下列身体部件类型常量之一：`MOVE`, `WORK`, `CARRY`, `ATTACK`, `RANGED_ATTACK`, `HEAL`, `TOUGH`, `CLAIM`
   */
  getActiveBodyparts(type: BodyPartConstant): number;
  /**
   * 从 source 中采集能量或者从 mineral 或 deposit 中采集资源。
   *
   * 需要 `WORK` 身体部件。
   *
   * 如果 creep 有空余的 `CARRY` 身体，则会自动将采集到的资源转移进去；否则将会掉落在地上。
   *
   * 目标必须与 creep 相邻。
   * @param target 要采集的对象。
   * @returns
   * 如下错误码之一：
   *
   * 常量 | 值 | 描述
   * :---- | :--- | :-----
   * `OK` | `0` | 这个操作已经成功纳入计划。
   * `ERR_NOT_OWNER` | `-1` | 你不是该 creep 的所有者，或者其他玩家已经占领或者预定了该房间的控制器。
   * `ERR_BUSY` | `-4` | 这个 creep 依然在孵化中。
   * `ERR_NOT_FOUND` | `-5` | 未找到 extractor。你必须建造一个 extractor 来开采矿物。[了解更多](https://screeps-cn.github.io/minerals.html)
   * `ERR_NOT_ENOUGH_RESOURCES` | `-6` | 目标中已经没有可采集的能量或者矿物。
   * `ERR_INVALID_TARGET` | `-7` | 目标不是有效的 source 或者 mineral 对象。
   * `ERR_NOT_IN_RANGE` | `-9` | 目标太远了。
   * `ERR_TIRED` | `-11` | extractor 仍在冷却中。
   * `ERR_NO_BODYPART` | `-12` | 这个 creep 身上没有 `WORK` 部件。
   */
  harvest(target: Source | Mineral | Deposit): CreepActionReturnCode | ERR_NOT_FOUND | ERR_NOT_ENOUGH_RESOURCES;
  /**
   * 治疗自己或者其他 creep。这将恢复目标 creep 受损身体部件的功能，并恢复已损失的生命值(hits)。
   *
   * 需要 `HEAL` 身体部件。
   *
   * 目标必须与 creep 相邻。
   * @param target 目标 creep 对象。
   * @returns
   * 如下错误码之一：
   *
   * 常量 | 值 | 描述
   * :---- | :--- | :-----
   * `OK` | `0` | 这个操作已经成功纳入计划。
   * `ERR_NOT_OWNER` | `-1` | 你不是这个 creep 的拥有者。
   * `ERR_BUSY` | `-4` | 这个 creep 依然在孵化中。
   * `ERR_INVALID_TARGET` | `-7` | 目标不是有效的 creep 对象。
   * `ERR_NOT_IN_RANGE` | `-9` | 目标太远了。
   * `ERR_NO_BODYPART` | `-12` | 这个 creep 身上没有 `HEAL` 部件。
   */
  heal(target: AnyCreep): CreepActionReturnCode;
  /**
   * 使 creep 朝指定方向移动一个地块。
   *
   * 需要 `MOVE` 身体部件，或者其他 creep 在其附近并拉动该 creep。
   *
   * 如果你对着一个相邻 creep 调用了 move 方法，将会使本 creep 跳过 `ERR_TIRED` 和 `ERR_NO_BODYPART` 检查; 否则将跳过 `ERR_NOT_IN_RANGE` 检查。
   * @param direction 一个相邻的 creep 或者下列常量之一：
   * - `TOP`
   * - `TOP_LEFT`
   * - `RIGHT`
   * - `BOTTOM_RIGHT`
   * - `BOTTOM`
   * - `BOTTOM_LEFT`
   * - `LEFT`
   * - `TOP_LEFT`
   * @returns
   * 如下错误码之一：
   *
   * 常量 | 值 | 描述
   * :---- | :--- | :-----
   * `OK` | `0` | 这个操作已经成功纳入计划。
   * `ERR_NOT_OWNER` | `-1` | 你不是这个 creep 的拥有者。
   * `ERR_BUSY` | `-4` | 这个 creep 依然在孵化中。
   * `ERR_NOT_IN_RANGE` | `-9` | 目标 creep 距离过远。
   * `ERR_INVALID_ARGS` | `-10` | 提供的方向不正确。
   * `ERR_TIRED` | `-11` | 该 creep 的疲劳（fatigue）计数器不为零。
   * `ERR_NO_BODYPART` | `-12` | 该 creep 没有 `MOVE` 身体部件。
   */
  move(direction: DirectionConstant): CreepMoveReturnCode;
  move(target: Creep): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NOT_IN_RANGE | ERR_INVALID_ARGS;
  /**
   * 使用预先定义的路径进行移动。需要 `MOVE` 身体部件。
   * @param path 从 [`Room.findPath`](https://screeps-cn.github.io/api/#Room.findPath),
   * [`RoomPosition.findPathTo`](https://screeps-cn.github.io/api/#RoomPosition.findPathTo)
   * 或 [`PathFinder.search`](https://screeps-cn.github.io/api/#PathFinder.search) 方法返回的路径值，数组或序列字符串形式都可接受。
   */
  moveByPath(path: PathStep[] | RoomPosition[] | string): CreepMoveReturnCode | ERR_NOT_FOUND | ERR_INVALID_ARGS;
  /**
   * 在本房间内查询到目标的最佳路径并向目标移动。
   * 该方法是 [`pos.findPathTo()`](https://screeps-cn.github.io/api/#RoomPosition.findPathTo) 与 [`move()`](https://screeps-cn.github.io/api/#Creep.move) 的调用简写。
   * 如果目标在其他房间，则相应的出口将被当做目标(在本房间中)。
   *
   * 需要 `MOVE` 身体部件。
   * @param x 目标在 creep 所在房间中的 x 坐标。
   * @param y 目标在 creep 所在房间中的 y 坐标。
   * @param opts 可选的附加对象信息
   */
  moveTo(x: number, y: number, opts?: MoveToOpts): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET;
  /**
   * 在本房间内查询到目标的最佳路径并向目标移动。
   * 该方法是 [`pos.findPathTo()`](https://screeps-cn.github.io/api/#RoomPosition.findPathTo) 与 [`move()`](https://screeps-cn.github.io/api/#Creep.move) 的调用简写。
   * 如果目标在其他房间，则相应的出口将被当做目标(在本房间中)。
   *
   * 需要 `MOVE` 身体部件。
   * @param target 可以是 [`RoomPosition`](https://screeps-cn.github.io/api/#RoomPosition) 对象或者任何包含 `RoomPosition` 属性的对象。该位置不必和 creep 在同一房间。
   * @param opts 可选的附加对象信息
   */
  moveTo(
    target: RoomPosition | { pos: RoomPosition },
    opts?: MoveToOpts
  ): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND;
  /**
   * 当 creep 受到攻击时切换自动通知。通知将发送到您的帐户邮箱。默认情况下启用。
   * @param enabled 是否启用通知。
   */
  notifyWhenAttacked(enabled: boolean): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_INVALID_ARGS;
  /**
   * 捡起一个物品 (如捡起一些能量)。需要 `CARRY` 身体部件。目标必须与 creep 相邻或者和 creep 在相同位置。
   * @param target 要捡起的目标对象。
   */
  pickup(target: Resource): CreepActionReturnCode | ERR_FULL;
  /**
   * 帮助其他 creep 跟随该 creep。目标 creep 移动产生的疲劳值将由该 creep 承担。
   *
   * 需要 `MOVE` 身体部件。目标必须与 creep 相邻。该 creep 必须[移动](https://screeps-cn.github.io/api/#Creep.move)到其他地方，目标 creep 也必须朝该 creep 移动。
   * @param target 目标 creep。
   */
  pull(target: Creep): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_INVALID_TARGET | ERR_NOT_IN_RANGE | ERR_NO_BODYPART;
  /**
   * 远程攻击其他 creep 或者建筑。
   *
   * 需要 `RANGED_ATTACK` 身体部件。如果目标在 rampart 中，则 rampart 将被优先攻击。
   *
   * 目标必须位于以 creep 为中心的 7*7 正方形区域内。
   * @param target 要攻击的目标。
   */
  rangedAttack(target: AnyCreep | Structure): CreepActionReturnCode;
  /**
   * 远程治疗其他 creep。
   *
   * 这将恢复目标 creep 受损身体部件的功能，并恢复已损失的生命值(hits)。
   *
   * 需要 `HEAL` 身体部件。目标必须位于以 creep 为中心的 7*7 正方形区域内。
   * @param target 目标 creep 对象。
   */
  rangedHeal(target: AnyCreep): CreepActionReturnCode;
  /**
   * 对以该 creep 为中心，3 格范围内的所有敌方 creep 和建筑进行攻击。
   *
   * 需要 `RANGED_ATTACK` 身体部件。
   *
   * 对目标造成的伤害随距离的增加而衰减。友方单位不会受到影响。
   */
  rangedMassAttack(): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NO_BODYPART;
  /**
   * 使用携带的能量修复受损建筑。需要 `WORK` 和 `CARRY` 身体部件。目标必须位于以 creep 为中心的 7*7 正方形区域内。
   * @param target 要修复的目标建筑。
   */
  repair(target: Structure): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES;
  /**
   * 暂时阻止其他玩家占领该房间控制器并且将 source 的能量上限恢复至正常容量。
   *
   * 每 tick 执行该命令都可以让控制器的不可占领时间增加，增加的 tick 等同于 `CLAIM` 身体部件的数量。
   *
   * 最大的预定时间为 5,000 tick。
   *
   * 目标必须与 creep 相邻。
   * @param target 要预定的目标控制器对象。
   */
  reserveController(target: StructureController): CreepActionReturnCode;
  /**
   * 在该 creep 上显示带有指定内容的可视对话气泡。此信息只会显示 1 tick。
   *
   * 你可以通过 saying 属性获取说过的最后一条信息。
   *
   * 允许使用任何有效的 Unicode 字符。包括 emoji。
   * @param message 要显示的信息，最长 10 字符。
   * @param toPublic 设置为 `true` 来让其他玩家也能看到该信息。默认为 `false`。
   */
  say(message: string, toPublic?: boolean): OK | ERR_NOT_OWNER | ERR_BUSY;
  /**
   * 用对所有玩家可见的任意文本对控制器进行签名。该文本将显示在世界地图的房间 UI 中。并可通过 api 进行访问。你可以签名无主甚至敌对玩家的控制器。目标必须与 creep 相邻。传递一个空字符串来移除签名。
   * @param target 要签名的目标控制器对象。
   * @param text 签名文本，最多 100 字符，之后的内容将被截断。
   */
  signController(target: StructureController, text: string): OK | ERR_BUSY | ERR_INVALID_TARGET | ERR_NOT_IN_RANGE;
  /**
   * 立刻杀死该 creep。
   */
  suicide(): OK | ERR_NOT_OWNER | ERR_BUSY;
  /**
   * 将资源从该 creep 转移至其他对象。目标必须与 creep 相邻。
   * @param target 目标对象。
   * @param resourceType `RESOURCE_*` 常量之一。
   * @param amount 要转移的资源数量。如果省略，将转移携带的全部指定资源。
   */
  transfer(target: AnyCreep | Structure, resourceType: ResourceConstant, amount?: number): ScreepsReturnCode;
  /**
   * 使用携带的能量将您的控制器升级到新的等级。升级控制器将同时提高你的全局控制等级(Global Control Level)。
   *
   * 需要 `WORK` 和 `CARRY` 身体部件。目标必须位于以 creep 为中心的 7*7 正方形区域内。
   *
   * 一个完全升级的 8 级控制器每 tick 最多接受 15 能量的升级，无论 creep 的能力有没有超过。
   * 该值限制了当前 tick 所有 creep 执行 `upgradeController` 积累的总能量值。
   * 可以使用 [ghodium 化合物强化](https://screeps-cn.github.io/resources.html) 来提高此上限。
   *
   * 升级控制器会把它的 `ticksToDowngrade` 计时器提高 100 tick。该计时器必须填满才能提升控制器等级。
   * @param target 要进行升级的目标控制器。
   */
  upgradeController(target: StructureController): ScreepsReturnCode;
  /**
   * 从建筑(structure)或是墓碑(tombstone)中拿取资源。
   *
   * 目标必须与 creep 相邻。
   *
   * 多个 creep 可以在同一 tick 里从相同对象中拿取资源。
   *
   * 你的 creep 同样也可以从敌对建筑/墓碑中拿取资源，如果它上面没有敌对的 rampart 的话。
   *
   * 此方法不应该被用来在 creep 之间转移资源。想要在 creep 之间转移，请对携带资源的 creep 执行 [`transfer`](https://screeps-cn.github.io/api/#Creep.transfer) 方法。
   * @param target 目标对象。
   * @param resourceType `RESOURCE_*` 常量之一。
   * @param amount 被传递资源的数量。如果没有这个参数，传递全部可用数量的资源。
   */
  withdraw(target: Structure | Tombstone | Ruin, resourceType: ResourceConstant, amount?: number): ScreepsReturnCode;
}

interface CreepConstructor extends _Constructor<Creep>, _ConstructorById<Creep> { }

declare const Creep: CreepConstructor;
