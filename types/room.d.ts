/**
 * 一个代表了你的单位和建筑所在房间的对象。
 *
 * 它可以被用来“环顾四周”，查找路径等。
 *
 * 所有 `RoomObject` 都有一个链接到其所在房间 `Room` 实例的属性 `room`。
 */
interface Room {
  readonly prototype: Room;

  /**
   * 该房间中的控制器（Controller）建筑，如果其不存在则返回 `undefined`。
   */
  controller?: StructureController;
  /**
   * 本房间中所有 spawn 和 extension 中的可用能量总额。
   */
  energyAvailable: number;
  /**
   * 本房间中所有 spawn 和 extension 的容量上限 `energyCapacity` 总额。
   */
  energyCapacityAvailable: number;
  /**
   * 返回该房间中前一个 tick 发生的事件数组。
   * @param raw 如果该参数为 false 或者未定义，则本方法将会返回使用 `JSON.parse` 解析后的对象，在首次访问时可能会造成一些 CPU 消耗（返回值会被缓存以方便后续调用）。如果 raw 为 `true`。则原始的 JSON 字符串将会被返回。
   */
  getEventLog(raw?: boolean): EventItem[];
  /**
   * `Memory.rooms[room.name]` 的简写。你可以用它来快速访问到该房间特定的内存数据对象。[点此了解有关内存的更多信息](https://screeps-cn.github.io/global-objects.html#Memory-object)。
   */
  memory: RoomMemory;
  /**
   * One of the `MODE_*` constants.
   */
  mode: string;
  /**
   * 房间名称。
   */
  readonly name: string;
  /**
   * 该房间中的 `Storage` 建筑，如果其不存在则返回 `undefined`。
   */
  storage?: StructureStorage;
  /**
   * 该房间中的 `Terminal` 建筑，如果其不存在则返回 `undefined`。
   */
  terminal?: StructureTerminal;
  /**
   * 该房间的 `RoomVisual` 对象。您可以使用该对象在房间中绘制简单的形状 (线条，圆，文本标签)。
   */
  visual: RoomVisual;
  /**
   * 在指定位置创建一个新的 `ConstructionSite`。
   * @param x X 坐标。
   * @param y Y 坐标。
   * @param structureType `STRUCTURE_*` 常量之一: STRUCTURE_EXTENSION, STRUCTURE_RAMPART, STRUCTURE_ROAD, STRUCTURE_SPAWN, STRUCTURE_WALL, STRUCTURE_LINK
   * @returns Result Code: OK, ERR_INVALID_TARGET, ERR_INVALID_ARGS, ERR_RCL_NOT_ENOUGH
   */
  createConstructionSite(x: number, y: number, structureType: BuildableStructureConstant): ScreepsReturnCode;
  /**
   * 在指定位置创建一个新的 `ConstructionSite`。
   * @param pos 可以为 [`RoomPosition`](https://screeps-cn.github.io/api/#RoomPosition) 对象或任何包含 `RoomPosition` 的对象。
   * @param structureType `STRUCTURE_*` 常量之一: STRUCTURE_EXTENSION, STRUCTURE_RAMPART, STRUCTURE_ROAD, STRUCTURE_SPAWN, STRUCTURE_WALL, STRUCTURE_LINK
   * @returns Result Code: OK, ERR_INVALID_TARGET, ERR_INVALID_ARGS, ERR_RCL_NOT_ENOUGH
   */
  createConstructionSite(pos: RoomPosition | _HasRoomPosition, structureType: StructureConstant): ScreepsReturnCode;
  /**
   * 在指定位置创建一个新的 `ConstructionSite`。
   * @param x X 坐标。
   * @param y Y 坐标。
   * @param structureType `STRUCTURE_*` 常量之一: STRUCTURE_EXTENSION, STRUCTURE_RAMPART, STRUCTURE_ROAD, STRUCTURE_SPAWN, STRUCTURE_WALL, STRUCTURE_LINK
   * @param name 建筑的名称，该建筑必须支持设置名字（当前仅有 spawn）。
   * @returns Result Code: OK, ERR_INVALID_TARGET, ERR_INVALID_ARGS, ERR_RCL_NOT_ENOUGH
   */
  createConstructionSite(x: number, y: number, structureType: STRUCTURE_SPAWN, name?: string): ScreepsReturnCode;
  /**
   * 在指定位置创建一个新的 `ConstructionSite`。
   * @param pos 可以为 [`RoomPosition`](https://screeps-cn.github.io/api/#RoomPosition) 对象或任何包含 `RoomPosition` 的对象。
   * @param structureType `STRUCTURE_*` 常量之一: STRUCTURE_EXTENSION, STRUCTURE_RAMPART, STRUCTURE_ROAD, STRUCTURE_SPAWN, STRUCTURE_WALL, STRUCTURE_LINK
   * @param name 建筑的名称，该建筑必须支持设置名字（当前仅有 spawn）。
   * @returns Result Code: OK, ERR_INVALID_TARGET, ERR_INVALID_ARGS, ERR_RCL_NOT_ENOUGH
   */
  createConstructionSite(
    pos: RoomPosition | _HasRoomPosition,
    structureType: STRUCTURE_SPAWN,
    name?: string
  ): ScreepsReturnCode;
  /**
   * 在指定位置创建一个新的 [Flag](https://screeps-cn.github.io/api/#Flag)。
   * @param x X 坐标。
   * @param y Y 坐标。
   * @param name (可选) 新旗帜的名称。
   *
   * 它应该是唯一的，即 `Game.flags` 不应该包含拥有相同名称(哈希键)的不同旗帜。
   *
   * 如果未定义，则会生成随机名称。
   *
   * 最长不得超过 60 字符。
   * @param color (可选) 新旗帜的颜色。应为 `COLOR_*` 常量之一。默认值为 `COLOR_WHITE`。
   * @param secondaryColor (可选) 新旗帜的次要颜色。应为 `COLOR_*` 常量之一。默认值等于 color 属性值。
   * @returns 新旗帜的名称，或者下列错误码之一: `ERR_NAME_EXISTS`, `ERR_INVALID_ARGS`
   */
  createFlag(
    x: number,
    y: number,
    name?: string,
    color?: ColorConstant,
    secondaryColor?: ColorConstant
  ): ERR_NAME_EXISTS | ERR_INVALID_ARGS | string;
  /**
   * 在指定位置创建一个新的 [Flag](https://screeps-cn.github.io/api/#Flag)。
   * @param pos 可以为 [`RoomPosition`](https://screeps-cn.github.io/api/#RoomPosition) 对象或任何包含 `RoomPosition` 的对象。
   * @param name (可选) 新旗帜的名称。
   *
   * 它应该是唯一的，即 `Game.flags` 不应该包含拥有相同名称(哈希键)的不同旗帜。
   *
   * 如果未定义，则会生成随机名称。
   *
   * 最长不得超过 60 字符。
   * @param color (可选) 新旗帜的颜色。应为 `COLOR_*` 常量之一。默认值为 `COLOR_WHITE`。
   * @param secondaryColor (可选) 新旗帜的次要颜色。应为 `COLOR_*` 常量之一。默认值等于 color 属性值。
   * @returns 新旗帜的名称，或者下列错误码之一: `ERR_NAME_EXISTS`, `ERR_INVALID_ARGS`
   */
  createFlag(
    pos: RoomPosition | { pos: RoomPosition },
    name?: string,
    color?: ColorConstant,
    secondaryColor?: ColorConstant
  ): ERR_NAME_EXISTS | ERR_INVALID_ARGS | string;
  /**
   * 查找房间中指定类型的所有对象。在应用自定义的 `filter` 之前，搜索结果会被自动缓存到指定的房间和类型，自动缓存将持续到本 tick 结束。
   * @param type `FIND_*` 常量之一
   * @param opts 可选项对象，用户刷选。
   * @returns 找到的对象数组
   */
  find<K extends FindConstant>(type: K, opts?: FilterOptions<K>): FindTypes[K][];
  find<T extends Structure>(
    type: FIND_STRUCTURES | FIND_MY_STRUCTURES | FIND_HOSTILE_STRUCTURES,
    opts?: FilterOptions<FIND_STRUCTURES>
  ): T[];
  /**
   * 找到通往另一个房间的出口方向。请注意，房间之间的移动不需要此方法，您只需将另一个房间中的目标传递给 `Creep.moveTo` 方法即可。
   * @param room 其他房间的名称或者房间对象。
   * @returns 出口方向常量: `FIND_EXIT_TOP`, `FIND_EXIT_RIGHT`, `FIND_EXIT_BOTTOM`, `FIND_EXIT_LEFT`
   * 或者下列错误码之一: `ERR_NO_PATH`, `ERR_INVALID_ARGS`
   */
  findExitTo(room: string | Room): ExitConstant | ERR_NO_PATH | ERR_INVALID_ARGS;
  /**
   * 使用优化的 A* 搜索算法 [Jump Point Search](http://en.wikipedia.org/wiki/Jump_point_search) 在 `fromPos` 和 `toPos` 之间找到房间内的最佳路径。
   * @param fromPos 起始位置。
   * @param toPos 结束位置。
   * @param opts (可选) 包含寻路可选项的对象
   * @returns 一个数组，其元素为如下形式的路径步骤：
   *
   * ```json
   * [
   *   { x: 10, y: 5, dx: 1,  dy: 0, direction: RIGHT },
   *   { x: 10, y: 6, dx: 0,  dy: 1, direction: BOTTOM },
   *   { x: 9,  y: 7, dx: -1, dy: 1, direction: BOTTOM_LEFT },
   *   ...
   * ]
   * ```
   */
  findPath(fromPos: RoomPosition, toPos: RoomPosition, opts?: FindPathOpts): PathStep[];
  /**
   * 获取指定位置的 `RoomPosition` 对象。
   * @param x X 坐标。
   * @param y Y 坐标。
   * @returns 一个 RoomPosition 对象，如果无法获取则返回 null。
   */
  getPositionAt(x: number, y: number): RoomPosition | null;
  /**
   * 获取一个 [`Room.Terrain`](https://screeps-cn.github.io/api/#Room-Terrain) 对象，可以用它来快速访问房间内的静态地形数据。
   * 即使没有指定房间的视野，您依旧可以使用该方法访问它的地形数据，该方法适用于游戏世界中的所有房间。
   */
  getTerrain(): RoomTerrain;
  /**
   * 获取指定房间位置的对象数组。
   * @param x 该房间中的 X 坐标。
   * @param y 该房间中的 Y 坐标。
   * @returns 一个位于指定位置的对象数组，格式如下：
   *
   * ```json
   * [
   *   { type: 'creep', creep: {...} },
   *   { type: 'structure', structure: {...} },
   *   ..
   *   { type: 'terrain', terrain: 'swamp' }
   * ]
   * ```
   */
  lookAt(x: number, y: number): LookAtResult[];
  /**
   * 获取指定房间位置的对象数组。
   * @param target 可以是 `RoomPosition` 对象或者任何包含 RoomPosition 属性的对象。
   * @returns 一个位于指定位置的对象数组，格式如下：
   *
   * ```json
   * [
   *   { type: 'creep', creep: {...} },
   *   { type: 'structure', structure: {...} },
   *   ..
   *   { type: 'terrain', terrain: 'swamp' }
   * ]
   * ```
   */
  lookAt(target: RoomPosition | { pos: RoomPosition }): LookAtResult[];
  /**
   * 获取指定房间区域内的对象列表。
   * @param top 区域顶部边界的 Y 坐标。
   * @param left 区域左侧边界的 X 坐标。
   * @param bottom 区域底部边界的 Y 坐标。
   * @param right 区域右侧边界的 X 坐标。
   * @param asArray 设为 `true` 来获得纯数组形式。
   * @returns `asArray` 值为 `false` 或者未定义，则该方法以如下格式返回指定区域内的对象。
   */
  lookAtArea(top: number, left: number, bottom: number, right: number, asArray?: false): LookAtResultMatrix;
  /**
   * 获取指定房间区域内的对象列表。
   * @param top 区域顶部边界的 Y 坐标。
   * @param left 区域左侧边界的 X 坐标。
   * @param bottom 区域底部边界的 Y 坐标。
   * @param right 区域右侧边界的 X 坐标。
   * @param asArray 设为 `true` 来获得纯数组形式。
   * @returns 如果 `asArray` 值为 `true`，则该方法以如下格式返回指定区域内的对象数组：
   */
  lookAtArea(top: number, left: number, bottom: number, right: number, asArray: true): LookAtResultWithPos[];
  /**
   * 在指定位置查找指定类型的对象。
   * @param type `LOOK_*` 常量之一。
   * @param x 该房间中的 X 坐标。
   * @param y 该房间中的 Y 坐标。
   * @returns 在指定位置找到的指定类型的对象数组。
   */
  lookForAt<T extends keyof AllLookAtTypes>(type: T, x: number, y: number): AllLookAtTypes[T][];
  /**
   * 在指定位置查找指定类型的对象。
   * @param type `LOOK_*` 常量之一。
   * @param target 可以是 `RoomPosition` 对象或者任何包含 `RoomPosition` 属性的对象。
   * @returns 在指定位置找到的指定类型的对象数组。
   */
  lookForAt<T extends keyof AllLookAtTypes>(type: T, target: RoomPosition | _HasRoomPosition): AllLookAtTypes[T][];
  /**
   * 在指定房间区域查找指定类型的对象列表。
   * @param type `LOOK_*` 常量之一。
   * @param top 区域顶部边界的 Y 坐标。
   * @param left 区域左侧边界的 X 坐标。
   * @param bottom 区域底部边界的 Y 坐标。
   * @param right 区域右侧边界的 X 坐标。
   * @param asArray 设为 `true` 来获得纯数组形式。
   * @returns 如果 `asArray` 值为 `false` 或者未定义，则该方法以如下格式返回指定区域内的对象
   */
  lookForAtArea<T extends keyof AllLookAtTypes>(
    type: T,
    top: number,
    left: number,
    bottom: number,
    right: number,
    asArray?: false
  ): LookForAtAreaResultMatrix<AllLookAtTypes[T], T>;
  /**
   * 在指定房间区域查找指定类型的对象列表。
   * @param type `LOOK_*` 常量之一。
   * @param top 区域顶部边界的 Y 坐标。
   * @param left 区域左侧边界的 X 坐标。
   * @param bottom 区域底部边界的 Y 坐标。
   * @param right 区域右侧边界的 X 坐标。
   * @param asArray 设为 `true` 来获得纯数组形式。
   * @returns 如果 `asArray` 值为 `true`，则该方法以如下格式返回指定区域内的对象数组
   */
  lookForAtArea<T extends keyof AllLookAtTypes>(
    type: T,
    top: number,
    left: number,
    bottom: number,
    right: number,
    asArray: true
  ): LookForAtAreaResultArray<AllLookAtTypes[T], T>;

  /**
   * Serialize a path array into a short string representation, which is suitable to store in memory.
   * @param path A path array retrieved from Room.findPath.
   * @returns A serialized string form of the given path.
   */

  /**
   * Deserialize a short string path representation into an array form.
   * @param path A serialized path string.
   * @returns A path array.
   */
}

interface RoomConstructor extends _Constructor<Room> {
  new (id: string): Room;

  Terrain: RoomTerrainConstructor;

  /**
   * 将路径数组序列化为适合存储在内存中的短字符串形式。
   * @param path [`Room.findPath`](https://screeps-cn.github.io/api/#Room.findPath) 返回的路径数组。
   * @returns 参数路径的序列化字符串。
   */
  serializePath(path: PathStep[]): string;
  /**
   * 将短字符串形式的路径反序列化为路径数组。
   * @param path 序列化的路径字符串。
   * @returns 路径数组
   */
  deserializePath(path: string): PathStep[];
}

declare const Room: RoomConstructor;
