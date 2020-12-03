/**
 * 一个正在建设中的工地。可以使用游戏界面右侧的 'Construct' 按钮创建工地或 [Room.createConstructionSite](https://screeps-cn.github.io/api/#Room.createConstructionSite) 方法。
 *
 * 要在工地建造一个建筑，需要给工人 creep 一些能量并执行 [Creep.build](https://screeps-cn.github.io/api/#Creep.build) 动作。
 *
 * 如果想移除敌人的工地，只需让一个 creep 踩在上面即可。
 */
interface ConstructionSite<T extends BuildableStructureConstant = BuildableStructureConstant> extends RoomObject {
  readonly prototype: ConstructionSite;
  /**
   * 全局唯一的对象标识。你可以通过调用 [`Game.getObjectById`](https://screeps-cn.github.io/api/#Game.getObjectById) 方法取得对象实例。
   */
  id: Id<this>;
  /**
   * 你是否拥有这个工地。
   */
  my: boolean;
  /**
   * 建筑拥有者信息。
   */
  owner: Owner;
  /**
   * 当前建造进度。
   */
  progress: number;
  /**
   * 完成建造所需的建造总进度。
   */
  progressTotal: number;
  /**
   * `STRUCTURE_*` 常量之一。
   */
  structureType: T;
  /**
   * 删除这个工地。
   * @returns 如下错误码之一：
   *
   * 常量 | 值 | 描述
   * :---- | :--- | :-----
   * `OK` | `0` | 这个操作已经成功纳入计划。
   * `ERR_NOT_OWNER` | `-1` | 你不是这个工地的拥有者，或者这不是你的房间。
   */
  remove(): number;
}

interface ConstructionSiteConstructor extends _Constructor<ConstructionSite>, _ConstructorById<ConstructionSite> {}

declare const ConstructionSite: ConstructionSiteConstructor;
