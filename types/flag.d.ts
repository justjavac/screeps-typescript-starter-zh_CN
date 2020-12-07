/**
 * 一个旗帜，旗帜可以用来标记房间中的一个特定的地点。旗帜只对其所有者可见。你最多只能拥有 10,000 个旗帜。
 */
interface Flag extends RoomObject {
  readonly prototype: Flag;

  /**
   * 旗帜的主要颜色。`COLOR_*` 常量之一。
   */
  color: ColorConstant;
  /**
   * 指向 `Memory.flags[flag.name]` 的链接。你可以使用它来快速访问到该旗帜的内存数据对象。
   */
  memory: FlagMemory;
  /**
   * 旗帜的名称。
   *
   * 你可以在创建新的旗帜时为其指定名字，名字一旦确定无法修改。
   *
   * 此名称是 `Game.flags` 对象中指向该旗帜对象的哈希键。你可以使用它来快速访问到该旗帜。名称最长不能超过 `60` 字符。
   */
  name: string;
  /**
   * 旗帜的次要颜色。`COLOR_*` 常量之一。
   */
  secondaryColor: ColorConstant;
  /**
   * 移除该旗帜。
   * @returns 永远返回 `OK`。
   */
  remove(): OK;
  /**
   * 给旗帜设置一个新颜色
   * @param color 旗帜的主要颜色。`COLOR_*` 常量之一。
   * @parma secondaryColor 旗帜的次要颜色。`COLOR_*` 常量之一。
   * @returns `OK`, `ERR_INVALID_ARGS`
   */
  setColor(color: ColorConstant, secondaryColor?: ColorConstant): OK | ERR_INVALID_ARGS;
  /**
   * 给旗帜设置一个新的位置。
   * @param x 相同房间内的 x 坐标。
   * @param y 相同房间内的 y 坐标。
   * @returns `OK`, `ERR_INVALID_TARGET`
   */
  setPosition(x: number, y: number): OK | ERR_INVALID_ARGS;
  /**
   * 给旗帜设置一个新的位置。
   * @param 可以是 `RoomPosition` 对象或者任何包含 `RoomPosition` 属性的对象。
   * @returns `OK`, `ERR_INVALID_TARGET`
   */
  setPosition(pos: RoomPosition | { pos: RoomPosition }): OK | ERR_INVALID_ARGS;
}

interface FlagConstructor extends _Constructor<Flag> {
  new (name: string, color: ColorConstant, secondaryColor: ColorConstant, roomName: string, x: number, y: number): Flag;
  (name: string, color: ColorConstant, secondaryColor: ColorConstant, roomName: string, x: number, y: number): Flag;
}

declare const Flag: FlagConstructor;
