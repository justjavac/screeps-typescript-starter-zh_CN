/**
 * 房间中所有具有坐标的对象。几乎所有的游戏对象原型都是从 `RoomObject` 派生出来的。
 */
interface RoomObject {
  readonly prototype: RoomObject;
  /**
   * 附加的效果，一个包含如下属性的对象数组：
   *
   * - power `number` - 被应用的效果id。可以是自然效果或者超能效果。
   * - level `number` - 被应用的效果等级。如果不是超能效果的话则不存在。
   * - ticksRemaining number - 多长时间之后会失去这个效果。
   */
  effects: RoomObjectEffect[];
  /**
   * 表示该对象在房间中的坐标的对象。
   */
  pos: RoomPosition;
  /**
   * Room 对象的链接。如果对象是标志或工地并且放置在你不可见的房间中，则可能为 `undefined`。
   */
  room: Room | undefined;
}

interface RoomObjectConstructor extends _Constructor<RoomObject> {
  new (x: number, y: number, roomName: string): RoomObject;
  (x: number, y: number, roomName: string): RoomObject;
}

declare const RoomObject: RoomObjectConstructor;

/**
 * Discriminated union of possible effects on `effect`
 */
type RoomObjectEffect = NaturalEffect | PowerEffect;

/**
 * Natural effect applied to room object
 */
interface NaturalEffect {
  /**
   * Effect ID of the applied effect. `EFFECT_*` constant.
   */
  effect: EffectConstant;
  /**
   * How many ticks will the effect last.
   */
  ticksRemaining: number;
}

/**
 * Effect applied to room object as result of a `PowerCreep.usePower`.
 */
interface PowerEffect {
  /**
   * Power level of the applied effect.
   */
  level: number;
  /**
   * Effect ID of the applied effect. `PWR_*` constant.
   */
  effect: PowerConstant;
  /**
   * @deprecated Power ID of the applied effect. `PWR_*` constant. No longer documented, will be removed.
   */
  power: PowerConstant;
  /**
   * How many ticks will the effect last.
   */
  ticksRemaining: number;
}
