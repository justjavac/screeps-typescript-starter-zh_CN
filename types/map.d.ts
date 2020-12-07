/**
 * The options that can be accepted by `findRoute()` and friends.
 */
interface RouteOptions {
  /**
   * 它可以用来计算进入一个房间的开销。你可以用它实现优先进入自己的房间或者回避某些房间等功能。你应该返回一个浮点数开销，或者返回 `Infinity` 代表不可进入。
   * @param roomName
   * @param fromRoomName
   */
  routeCallback: (roomName: string, fromRoomName: string) => any;
}

interface RoomStatusPermanent {
  status: "normal" | "closed";
  timestamp: null;
}

interface RoomStatusTemporary {
  status: "novice" | "respawn";
  timestamp: number;
}

type RoomStatus = RoomStatusPermanent | RoomStatusTemporary;

/**
 * 世界地图对象，用于在房间之间导航。
 */
interface GameMap {
  /**
   * 根据给定的房间名列出所有可用的出口。
   * @param roomName 房间名。
   * @returns 出口信息按照以下格式给出，在房间不存在时返回null。
   *
   * ```json
   * {
   *   "1": "W8N4",    // TOP
   *   "3": "W7N3",    // RIGHT
   *   "5": "W8N2",    // BOTTOM
   *   "7": "W9N3"     // LEFT
   * }
   * ```
   */
  describeExits(roomName: string): ExitsInformation;
  /**
   * 查找从给定房间到另一个房间的出口方向。
   * @param fromRoom 起点房间名或房间对象。
   * @param toRoom 终点房间名或房间对象。
   * @param opts (可选) 包含寻路选项的对象。参见 [`findRoute`](https://screeps-cn.github.io/api/#findRoute)。
   * @returns 房间方向常量，下列之一：
   * `FIND_EXIT_TOP`, `FIND_EXIT_RIGHT`, `FIND_EXIT_BOTTOM`, `FIND_EXIT_LEFT`
   *
   * 或下列错误码：
   * `ERR_NO_PATH`, `ERR_INVALID_ARGS`
   */
  findExit(
    fromRoom: string | Room,
    toRoom: string | Room,
    opts?: RouteOptions
  ): ExitConstant | ERR_NO_PATH | ERR_INVALID_ARGS;
  /**
   * 查找从给定房间到另一个房间的路径。
   * @param fromRoom 起点房间名或房间对象。
   * @param toRoom 终点房间名或房间对象。
   * @param opts (可选) 包含下列选项的对象：
   *
   * - `routeCallback` 这个回调函数接受两个参数：`function(roomName, fromRoomName)`。
   * 它可以用来计算进入一个房间的开销。你可以用它实现优先进入自己的房间或者回避某些房间等功能。
   * 你应该返回一个浮点数开销，或者返回 `Infinity` 代表不可进入。
   * @returns 如下格式的路径数组：
   *
   * ```json
   * [
   *   { exit: FIND_EXIT_RIGHT, room: 'arena21' },
   *   { exit: FIND_EXIT_BOTTOM, room: 'arena22' },
   *   ...
   * ]
   * ```
   *
   * 或如下错误码之一：`ERR_NO_PATH`
   */
  findRoute(
    fromRoom: string | Room,
    toRoom: string | Room,
    opts?: RouteOptions
  ):
    | {
        exit: ExitConstant;
        room: string;
      }[]
    | ERR_NO_PATH;
  /**
   * 获取两个房间之间直线距离（房间数）。你可以使用这个函数估算使用终端发送资源的能源开销，或用于使用观察者和核武器。
   * @param roomName1 第一个房间名。
   * @param roomName2 第二个房间名。
   * @param continuous 是否视世界地图为在边界连续。如果要计算交易或终端发送开销，请设置为 `true`。 默认值为 `false`。
   */
  getRoomLinearDistance(roomName1: string, roomName2: string, continuous?: boolean): number;
  /**
   * 此方法已被弃用，不久将被删除。
   * @deprecated 请使用更高效的方法 [`Game.map.getRoomTerrain`](https://screeps-cn.github.io/api/#Game.map.getRoomTerrain) 替代.
   */
  getTerrainAt(x: number, y: number, roomName: string): Terrain;
  /**
   * 此方法已被弃用，不久将被删除。
   * @deprecated 请使用更高效的方法 [`Game.map.getRoomTerrain`](https://screeps-cn.github.io/api/#Game.map.getRoomTerrain) 替代.
   */
  getTerrainAt(pos: RoomPosition): Terrain;
  /**
   * 获取 `Room.Terrain` 对象，快捷访问静态地形数据。此方法适用于所有房间，哪怕是无法访问的房间。
   * @param roomName 房间名。
   */
  getRoomTerrain(roomName: string): RoomTerrain;
  /**
   * 返回世界尺寸，即世界对角之间的房间数。例如对于一个从 W50N50 至 E50S50 的世界这个方法返回 `102`。
   */
  getWorldSize(): number;

  /**
   * 此方法已被弃用，不久将被删除。
   * @deprecated 请使用方法 [`Game.map.getRoomStatus`](https://screeps-cn.github.io/api/#Game.map.getRoomStatus) 替代.
   */
  isRoomAvailable(roomName: string): boolean;

  /**
   * 获取指定房间的开放状态。
   * @param roomName 房间名
   * @returns 包含如下属性的对象：
   *
   * ```json
   * {
   *   status: "normal" | "closed" | "novice" | "respawn",
   *   timestamp: number
   * }
   * ```
   * @see https://screeps-cn.github.io/start-areas.html
   */
  getRoomStatus(roomName: string): RoomStatus;

  /**
   * 地图可视化（Map visual）提供了一种途径来在游戏地图上显示各种可视化的调试信息。您可以使用 `Game.map.visual` 对象来绘制一些仅对您可见的简单图形。
   *
   * 地图可视化不会被存储在游戏数据库中，它们唯一的作用就是在您的浏览器上显示一些信息。所有的绘制效果只会被保留一个 tick，并且如果下个 tick 没有更新的话它们就会消失。
   * 所有的 `Game.map.visual` 调用都不会产生 CPU 消耗（只会产生一些代码执行的自然成本，并且大多与简单的 `JSON.serialize` 调用有关）。
   * 然而，这里有一条使用限制：您最多只能为每个房间发布 1000 KB 的序列化数据。
   *
   * 所有绘制坐标均等同于全局游戏坐标 ([`RoomPosition`](https://screeps-cn.github.io/api/#RoomPosition))。
   */
  visual: MapVisual;
}

// No static is available

interface MapVisual {
  /**
   * 绘制一条线。
   * @param pos1 起始点位置对象。
   * @param pos2 结束点位置对象。
   * @param style 样式
   * @returns `MapVisual` 对象本身，以便进行链式调用。
   */
  line(pos1: RoomPosition, pos2: RoomPosition, style?: MapLineStyle): MapVisual;

  /**
   * 绘制一个圆。
   * @param pos 中心点位置对象。
   * @param style 样式
   * @returns `MapVisual` 对象本身，以便进行链式调用。
   */
  circle(pos: RoomPosition, style?: MapCircleStyle): MapVisual;

  /**
   * 绘制一个矩形。
   * @param topLeftPos 左上角的位置对象。
   * @param width 矩形的宽。
   * @param height 矩形的高。
   * @param style 样式
   * @returns `MapVisual` 对象本身，以便进行链式调用。
   */
  rect(topLeftPos: RoomPosition, width: number, height: number, style?: MapPolyStyle): MapVisual;

  /**
   * 绘制一段折线.
   * @param points 包含了所有拐点的数组。每个数组元素都应是一个 `RoomPosition` 对象。
   * @param style 样式
   * @returns `MapVisual` 对象本身，以便进行链式调用。
   */
  poly(points: RoomPosition[], style?: MapPolyStyle): MapVisual;

  /**
   * 绘制一个文本标签。你可以使用任何有效的 Unicode 字符，包括 emoji。
   * @param text 文本信息
   * @param pos 文本基线（baseline）起始点的位置对象。
   * @param style 样式
   * @returns `MapVisual` 对象本身，以便进行链式调用。
   */
  text(text: string, pos: RoomPosition, style?: MapTextStyle): MapVisual;

  /**
   * 移除该房间的所有可视化效果。
   * @returns `MapVisual` 对象本身，以便进行链式调用。
   */
  clear(): MapVisual;

  /**
   * 获取本 tick 所有可视化效果的存储大小。最多不能超过 1024,000（1000 KB）。
   * @returns The size of the visuals in bytes.
   */
  getSize(): number;

  /**
   * 返回当前 tick 中添加到地图中的所有可视化效果的紧凑格式。
   * @returns 代表了可视化数据的字符串。除了将其存储以备后续使用外，您不应该对其进行其他操作。
   */
  export(): string;

  /**
   * 将先前导出（使用 `Game.map.visual.export`）的地图可视化效果添加到当前 tick。
   * @param data 从 `Game.map.visual.export` 返回的字符串。
   * @returns `MapVisual` 对象本身，以便进行链式调用。
   */
  import(data: string): MapVisual;
}

interface MapLineStyle {
  /**
   * 线条的宽度，默认值为 `0.1`。
   */
  width?: number;
  /**
   * 线条颜色，使用以下格式：`#ffffff`（十六进制颜色），默认为 `#ffffff`。
   */
  color?: string;
  /**
   * 透明度，默认值为 `0.5`。
   */
  opacity?: number;
  /**
   * `undefined` (实线)，`dashed` (虚线) 或者 `dotted` (点线) 之一。默认值为 `undefined`。
   */
  lineStyle?: "dashed" | "dotted" | "solid";
}

interface MapPolyStyle {
  /**
   * 线条颜色，使用以下格式：`#ffffff`（十六进制颜色），默认为 `#ffffff`。
   */
  fill?: string;
  /**
   * 透明度，默认值为 `0.5`。
   */
  opacity?: number;
  /**
   * 轮廓颜色，使用以下格式：`#ffffff`（十六进制颜色），默认为 `undefined`（无轮廓）。
   */
  stroke?: string | undefined;
  /**
   * 轮廓宽度，默认值为 `0.5`。
   */
  strokeWidth?: number;
  /**
   * `undefined` (实线)，`dashed` (虚线) 或者 `dotted` (点线) 之一。默认值为 `undefined`。
   */
  lineStyle?: "dashed" | "dotted" | "solid";
}

interface MapCircleStyle extends MapPolyStyle {
  /**
   * 圆的半径，默认值为 `10`。
   */
  radius?: number;
}

interface MapTextStyle {
  /**
   * 文本颜色，使用以下格式：`#ffffff`（十六进制颜色），默认为 `#ffffff`。
   */
  color?: string;
  /**
   * 文本字体，默认为 sans-serif
   */
  fontFamily?: string;
  /**
   * 字体大小，基于游戏坐标，默认为 `10`
   */
  fontSize?: number;
  /**
   * 字体风格（`'normal'`, `'italic'` 或者 `'oblique'`）
   */
  fontStyle?: string;
  /**
   * 字体变种（`'normal'` 或者 `'small-caps'`）
   */
  fontVariant?: string;
  /**
   * 轮廓颜色，使用以下格式：`#ffffff`（十六进制颜色），默认为 `undefined`（无轮廓）。
   */
  stroke?: string;
  /**
   * 轮廓宽带，默认为 `0.15`。
   */
  strokeWidth?: number;
  /**
   * 背景颜色，使用以下格式：`#ffffff`（十六进制颜色），默认为 `undefined`（无背景色）。
   * 当启用背景色时，文本的垂直对齐模式将被设置为居中（默认为 `baseline`）。
   */
  backgroundColor?: string;
  /**
   * 背景矩形的内边距（padding），默认为 `2`。
   */
  backgroundPadding?: number;
  /**
   * 文本对齐，`center`、`left`、`right` 之一。默认为 `center`。
   */
  align?: "center" | "left" | "right";
  /**
   * 透明度，默认值为 `0.5`。
   */
  opacity?: number;
}
