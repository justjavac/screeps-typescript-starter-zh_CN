/**
 * 包含了在游戏中进行寻路的强大方法。
 * 这个模块使用原生的高性能 C++ 代码实现，并支持跨越多个房间的自定义寻路成本及路径。
 */
interface PathFinder {
  /**
   * Container for custom navigation cost data.
   */
  CostMatrix: CostMatrix;

  /**
   * 在 `origin` 和 `goal` 之间查找最佳路径。
   *
   * @param origin 起始位置。
   * @param goal 一个或一组目标。如果提供了多个目标，则返回所有目标中移动成本最低的路径。
   * **重要：** 请注意，如果您的目标是无法行走的（例如，一个 `source`），请至少将 `range` 设置成至少为 `1`。否则您将浪费很多 CPU 资源来查找一个无法到达的目标。
   * @param opts 一个包含其他寻路选项的对象。
   */
  search(
    origin: RoomPosition,
    goal: RoomPosition | { pos: RoomPosition; range: number } | (RoomPosition | { pos: RoomPosition; range: number })[],
    opts?: PathFinderOpts
  ): PathFinderPath;
  /**
   * 指定是否在游戏中使用新的实验性 pathfinder
   * 该方法应在每个 tick 调用。它将影响以下方法的行为：
   * * `Room.findPath`
   * * `RoomPosition.findPathTo`
   * * `RoomPosition.findClosestByPath`
   * * `Creep.moveTo`
   *
   * @deprecated 此方法已被弃用，不久将被删除。
   * @param 是否要激活新的 pathfinder。默认值为 `true`。
   */
  use(isEnabled: boolean): undefined;
}

/**
 * 包含以下属性的对象：
 * - path - RoomPosition` 对象数组。
 * - ops - 寻路完成时的 operation 总消耗。
 * - cost - 从 `plainCost`，`swampCost` 和任何给定的 `CostMatrix` 实例推导出的移动总成本。
 * - incomplete - 如果 `pathfinder` 找不到完整的路径的话，该值将为 `true`。
 *   注意，`path` 中依旧会有部分路径，其中的不完整路径代表在当前搜索限制下所能找到的最接近的路径。
 */
interface PathFinderPath {
  /**
   * `RoomPosition` 对象数组。
   */
  path: RoomPosition[];
  /**
   * 寻路完成时的 operation 总消耗。
   */
  ops: number;
  /**
   * 从 `plainCost`，`swampCost` 和任何给定的 `CostMatrix` 实例推导出的移动总成本。
   */
  cost: number;
  /**
   * 如果 `pathfinder` 找不到完整的路径的话，该值将为 `true`。
   * 注意，`path` 中依旧会有部分路径，其中的不完整路径代表在当前搜索限制下所能找到的最接近的路径。
   */
  incomplete: boolean;
}

/**
 * 一个包含其他寻路选项的对象。
 */
interface PathFinderOpts {
  /**
   * 平原上的移动成本，默认为 `1`。
   */
  plainCost?: number;
  /**
   * 沼泽上的移动成本，默认为 `5`。
   */
  swampCost?: number;
  /**
   * 与其寻找前往目标的道路，不如寻找远离目标的道路。
   * 返回远离每个目标 `range` 的移动成本最低的路径。默认为 `false`。
   */
  flee?: boolean;
  /**
   * 寻路所允许的最大消耗。你可以限制用于搜索路径的 CPU 时间，基于 1 op ~ 0.001 CPU 的比例。默认值为 `2000`。
   */
  maxOps?: number;
  /**
   * 寻路所允许的最大房间数。默认值(最大值)为 `16`。
   */
  maxRooms?: number;
  /**
   * 寻路所允许的最大移动成本。如果 `pathfinder` 发现无论如何都找不到移动成本小于等于 `maxCost` 的路径时，它将立即停止搜索。默认值为无穷大(`Infinity`)。
   */
  maxCost?: number;
  /**
   * 应用于 A* 算法 `F = G + weight * H` 中的启发式权重(weight)。在使用该选项之前您最好已经了解了 A* 算法的底层实现！默认值为 `1.2`。
   */
  heuristicWeight?: number;

  /**
   * 该回调可以用来生成某些房间的 [`CostMatrix`](https://screeps-cn.github.io/api/#PathFinder-CostMatrix)，并提供给 `pathfinder` 来增强寻路效果。该回调拥有一个 `roomName` 参数。
   * 在寻路搜索中，每个房间只会被执行一次回调。
   * 如果您要在 1 tick 内为单个房间执行多次寻路操作，可以考虑缓存您的 `CostMatrix` 来提高代码运行效率。
   * 请阅读 [`CostMatrix`](https://screeps-cn.github.io/api/#PathFinder-CostMatrix) 文档来了解更多关于 `CostMatrix` 的信息。如果该回调返回 `false`，则对应的房间不会被搜索，并且该房间也不会加入到 `maxRooms` 里。
   *
   * @param roomName The name of the room the pathfinder needs a cost matrix for.
   */
  roomCallback?(roomName: string): boolean | CostMatrix;
}

/**
 * 存放自定义导航寻路成本的对象。
 *
 * 默认情况下，`PathFinder` 在寻路时只考虑地形 (平原、沼泽、墙壁) —— 如果您需要绕过建筑或者 creep，就需要把他们放进一个 `CostMatrix` 里。
 * 通常情况下，您将在 `roomCallback` 内部创建 `CostMatrix`。如果在房间的 `CostMatrix` 里找到了一个非零值，那么它将替代默认的地形移动成本。
 * 您应该避免在 `CostMatrix` 和地形移动成本标志里使用较大值。例如，使用 `{ plainCost: 1, swampCost: 5 }` 的 `PathFinder.search` 将比使用 `{plainCost: 2, swampCost: 10 }` 的运行的更快，并且他们将会寻路出相同的路径。
 */
interface CostMatrix {
  /**
   * Creates a new CostMatrix containing 0's for all positions.
   */
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  new (): CostMatrix;
  /**
   * 在 `CostMatrix` 中设置指定位置的移动成本。
   * @param x 位置在房间中的 x 坐标。
   * @param y 位置在房间中的 y 坐标。
   * @param cost 该位置的移动成本，必须是整数。值为 `0` 时将使用该地块默认的地形移动成本。大于或等于 `255` 的移动成本将视为无法通过。
   */
  set(x: number, y: number, cost: number): undefined;
  /**
   * 获取该 CostMatrix 中指定位置的移动成本。
   * @param x 位置在房间中的 x 坐标。
   * @param y 位置在房间中的 y 坐标。
   */
  get(x: number, y: number): number;
  /**
   * 使用当前 `CostMatrix` 中的相同数据创建一个新的 `CostMatrix`。
   */
  clone(): CostMatrix;
  /**
   * 返回该 `CostMatrix` 的紧凑形式，使其可以使用 `JSON.stringify` 进行存储。
   */
  serialize(): number[];
  /**
   * 静态方法，可以将 serialize 方法返回的值反序列化为一个新的 `CostMatrix`。
   * @param val 任何 serialize 的返回值。
   */
  deserialize(val: number[]): CostMatrix;
}

declare const PathFinder: PathFinder;
