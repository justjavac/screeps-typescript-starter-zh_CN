/**
 * 核弹原爆点，此对象无法被更改或移除。但可以用常数 `FIND_NUKES` 查找即将抵达房间的核弹。核弹只能由 [核弹发射井](https://screeps-cn.github.io/api/#StructureNuker) 发射
 */
interface Nuke extends RoomObject {
  readonly prototype: Nuke;

  /**
   * 全局唯一的对象标识。你可以通过调用 `Game.getObjectById` 方法取得对象实例。
   */
  id: Id<this>;
  /**
   * 发射此核弹的房间名。
   */
  launchRoomName: string;
  /**
   * 着落倒计时。
   */
  timeToLand: number;
}

interface NukeConstructor extends _Constructor<Nuke>, _ConstructorById<Nuke> {}

declare const Nuke: NukeConstructor;
