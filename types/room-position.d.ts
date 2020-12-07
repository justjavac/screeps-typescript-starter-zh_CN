/**
 * 表示房间中指定位置的对象。
 *
 * 房间中的每个 `RoomObject` 都通过其 `pos` 属性链接到对应的 `RoomPosition` 上。
 *
 * 可以使用 `Room.getPositionAt` 或者构造函数创建自定义地点的位置对象。
 */
interface RoomPosition {
  readonly prototype: RoomPosition;

  /**
   * 所处房间的名称。
   */
  roomName: string;
  /**
   * 所处房间的 X 坐标。
   */
  x: number;
  /**
   * 所处房间的 Y 坐标。
   */
  y: number;
  /**
   * 在指定位置创建新的 `ConstructionSite`。
   * @param structureType `STRUCTURE_*` 常量之一:
   *  * `STRUCTURE_EXTENSION`
   *  * `STRUCTURE_RAMPART`
   *  * `STRUCTURE_ROAD`
   *  * `STRUCTURE_SPAWN`
   *  * `STRUCTURE_WALL`
   *  * `STRUCTURE_LINK`
   */
  createConstructionSite(structureType: BuildableStructureConstant): ScreepsReturnCode;
  /**
   * 在指定位置创建新的 `ConstructionSite`。
   * @param structureType `STRUCTURE_*` 常量之一:
   *  * `STRUCTURE_EXTENSION`
   *  * `STRUCTURE_RAMPART`
   *  * `STRUCTURE_ROAD`
   *  * `STRUCTURE_SPAWN`
   *  * `STRUCTURE_WALL`
   *  * `STRUCTURE_LINK`
   * @param name 建筑的名称，该建筑必须支持设置名字（当前仅有 spawn）。
   */
  createConstructionSite(structureType: STRUCTURE_SPAWN, name?: string): ScreepsReturnCode;
  /**
   * 在指定位置创建一个新的 `Flag`。
   * @param name 新旗帜的名称。
   * 它应该是唯一的，即 `Game.flags` 不应该包含拥有相同名称(哈希键)的不同旗帜。
   * 如果未定义，则会生成随机名称。
   * @param color 新旗帜的颜色。应为 `COLOR_*` 常量之一。默认值为 `COLOR_WHITE`。
   * @param secondaryColor 新旗帜的次要颜色。应为 `COLOR_*` 常量之一。默认值等于 `color` 属性值。
   * @returns 新旗帜的名称，或者下列错误码之一: `ERR_NAME_EXISTS`, `ERR_INVALID_ARGS`
   */
  createFlag(
    name?: string,
    color?: ColorConstant,
    secondaryColor?: ColorConstant
  ): ERR_NAME_EXISTS | ERR_INVALID_ARGS | string;
  /**
   * 查找到该位置路径最短的对象。使用跳点搜索（Jump Point Search）算法和 Dijkstra's 算法进行搜索。
   * @param type `FIND_*` 常量之一。
   * @param opts 一个对象，包含了寻路选项（详见 `Room.findPath`），或下列属性：
   *
   * - filter, 只有通过筛选器的对象才会被使用，由 `_.filter` 执行筛选。
   *
   * - algorithm 下列常量之一：
   *
   *   - `astar` 当可能存在的目标相对较少时运行速度更快；
   *   - `dijkstra` 当可能存在的目标较多或者附近就有最近的目标时，速度会更快。
   *
   * 默认算法是使用启发法自行决定的。
   * @returns 返回找到的最近对象，没找到则返回 null。
   */
  findClosestByPath<K extends FindConstant>(
    type: K,
    opts?: FindPathOpts & Partial<FilterOptions<K>> & { algorithm?: FindClosestByPathAlgorithm }
  ): FindTypes[K] | null;
  findClosestByPath<T extends Structure>(
    type: FIND_STRUCTURES | FIND_MY_STRUCTURES | FIND_HOSTILE_STRUCTURES,
    opts?: FindPathOpts & Partial<FilterOptions<FIND_STRUCTURES>> & { algorithm?: FindClosestByPathAlgorithm }
  ): T | null;
  /**
   * 查找到该位置路径最短的对象。使用跳点搜索（Jump Point Search）算法和 Dijkstra's 算法进行搜索。
   * @param objects 要执行搜索的房间对象数组或者 `RoomPosition` 对象数组。
   * @param opts 一个对象，包含了寻路选项（详见 `Room.findPath`），或下列属性：
   *
   * - filter, 只有通过筛选器的对象才会被使用，由 `_.filter` 执行筛选。
   *
   * - algorithm 下列常量之一：
   *
   *   - `astar` 当可能存在的目标相对较少时运行速度更快；
   *   - `dijkstra` 当可能存在的目标较多或者附近就有最近的目标时，速度会更快。
   *
   * 默认算法是使用启发法自行决定的。
   * @returns 返回找到的最近对象，没找到则返回 null。
   */
  findClosestByPath<T extends _HasRoomPosition | RoomPosition>(
    objects: T[],
    opts?: FindPathOpts & {
      filter?: ((object: T) => boolean) | FilterObject | string;
      algorithm?: FindClosestByPathAlgorithm;
    }
  ): T | null;
  /**
   * 查找到该位置线性距离最短的对象。
   * @param type `FIND_*` 常量之一。
   * @param opts 可选对象
   */
  findClosestByRange<K extends FindConstant>(type: K, opts?: FilterOptions<K>): FindTypes[K] | null;
  findClosestByRange<T extends Structure>(
    type: FIND_STRUCTURES | FIND_MY_STRUCTURES | FIND_HOSTILE_STRUCTURES,
    opts?: FilterOptions<FIND_STRUCTURES>
  ): T | null;
  /**
   * 查找到该位置线性距离最短的对象。
   * @param objects 要执行搜索的房间对象数组或者 `RoomPosition` 对象数组。
   * @param opts 可选对象
   */
  findClosestByRange<T extends _HasRoomPosition | RoomPosition>(
    objects: T[],
    opts?: { filter: any | string }
  ): T | null;
  /**
   * 查找在指定线性范围中的所有对象。
   * @param type `FIND_*` 常量之一。
   * @param range T范围距离（半径）。
   * @param opts 详见 `Room.find`.
   */
  findInRange<K extends FindConstant>(type: K, range: number, opts?: FilterOptions<K>): FindTypes[K][];
  findInRange<T extends Structure>(
    type: FIND_STRUCTURES | FIND_MY_STRUCTURES | FIND_HOSTILE_STRUCTURES,
    range: number,
    opts?: FilterOptions<FIND_STRUCTURES>
  ): T[];
  /**
   * 查找在指定线性范围中的所有对象。
   * @param objects 要执行搜索的房间对象数组或者 `RoomPosition` 对象数组。
   * @param range 范围距离（半径）。
   * @param opts 详见 `Room.find`.
   */
  findInRange<T extends _HasRoomPosition | RoomPosition>(
    objects: T[],
    range: number,
    opts?: { filter?: any | string }
  ): T[];
  /**
   * 使用 A* 算法查找到指定位置的最佳路径。
   *
   * 该方法是 `Room.findPath` 的简写。如果目标在其他房间，则相应的出口将被作为目标。
   * @param x 该房间中的 X 坐标。
   * @param y 该房间中的 Y 坐标。
   * @param opts 一个对象，包含了寻路相关的选项标识 (查看 `Room.findPath` 来获得更多信息)。
   */
  findPathTo(x: number, y: number, opts?: FindPathOpts): PathStep[];
  /**
   * 使用 A* 算法查找到指定位置的最佳路径。
   *
   * 该方法是 `Room.findPath` 的简写。如果目标在其他房间，则相应的出口将被作为目标。
   * @param target 可以是 `RoomPosition` 对象或者任何包含 `RoomPosition` 属性的对象。
   * @param opts 一个对象，包含了寻路相关的选项标识 (查看 `Room.findPath` 来获得更多信息)。
   */
  findPathTo(target: RoomPosition | _HasRoomPosition, opts?: FindPathOpts): PathStep[];
  /**
   * 获取到指定位置的直线方向。
   * @param x 该房间中的 X 坐标。
   * @param y 该房间中的 Y 坐标。
   */
  getDirectionTo(x: number, y: number): DirectionConstant;
  /**
   * 获取到指定位置的直线方向。
   * @param target 可以是 RoomPosition 对象或者任何包含 RoomPosition 属性的对象。
   */
  getDirectionTo(target: RoomPosition | _HasRoomPosition): DirectionConstant;
  /**
   * 获取到指定位置的线性范围。
   * @param x 该房间中的 X 坐标。
   * @param y 该房间中的 Y 坐标。
   */
  getRangeTo(x: number, y: number): number;
  /**
   * 获取到指定位置的线性范围。
   * @param target 可以是 RoomPosition 对象或者任何包含 RoomPosition 属性的对象。
   */
  getRangeTo(target: RoomPosition | { pos: RoomPosition }): number;
  /**
   * 检查该位置是否在其他位置的指定范围内。
   * @param x 该房间中的 X 坐标。
   * @param y 该房间中的 Y 坐标。
   * @param range 范围距离（半径）。
   */
  inRangeTo(x: number, y: number, range: number): boolean;
  /**
   * 检查该位置是否在其他位置的指定范围内。
   * @param toPos 目标位置
   * @param range 范围距离（半径）。
   */
  inRangeTo(target: RoomPosition | { pos: RoomPosition }, range: number): boolean;
  /**
   * 检查该位置是否和指定位置相同。
   * @param x 该房间中的 X 坐标。
   * @param y 该房间中的 Y 坐标。
   */
  isEqualTo(x: number, y: number): boolean;
  /**
   * 检查该位置是否和指定位置相同。
   * @param target 可以是 `RoomPosition` 对象或者任何包含 `RoomPosition` 属性的对象。
   */
  isEqualTo(target: RoomPosition | { pos: RoomPosition }): boolean;
  /**
   * 检查该位置是否在紧邻指定位置的正方形区域内。类似于 `inRangeTo(target, 1)`。
   * @param x 该房间中的 X 坐标。
   * @param y 该房间中的 Y 坐标。
   */
  isNearTo(x: number, y: number): boolean;
  /**
   * 检查该位置是否在紧邻指定位置的正方形区域内。类似于 `inRangeTo(target, 1)`。
   * @param target 可以是 RoomPosition 对象或者任何包含 RoomPosition 属性的对象。
   */
  isNearTo(target: RoomPosition | { pos: RoomPosition }): boolean;
  /**
   * 获取位于该位置的对象列表。
   */
  look(): LookAtResult[];
  /**
   * 获取该位置上给定类型的对象列表。
   * @param type `LOOK_*` 常量之一。
   */
  lookFor<T extends keyof AllLookAtTypes>(type: T): AllLookAtTypes[T][];
}

interface RoomPositionConstructor extends _Constructor<RoomPosition> {
  /**
   * 你可以使用其构造函数创建一个新的 RoomPosition 对象。
   * @param x 房间中的 X 坐标。
   * @param y 房间中的 Y 坐标。
   * @param roomName 房间名称。
   */
  new (x: number, y: number, roomName: string): RoomPosition;
  (x: number, y: number, roomName: string): RoomPosition;
}

declare const RoomPosition: RoomPositionConstructor;
