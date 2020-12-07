/**
 * 提供快速访问房间地形数据的对象。您可以为游戏世界中的任何房间构造这些对象，即使没有该房间的视野。
 * 从技术上讲，每个 `Room.Terrain` 对象都是一个非常轻量级的适配器，用于提供具有最小访问权限的静态地形缓冲区。
 */
interface RoomTerrain {
  /**
   * 通过 (x,y) 坐标获取指定房间位置处的地形。和 [`Game.map.getTerrainAt(...)`](https://screeps-cn.github.io/api/#Game.map.getTerrainAt) 方法不同，此方法不执行任何字符串操作，并返回整数 terrain 类型值。
   * @param x 该房间中的 X 坐标。
   * @param y 该房间中的 Y 坐标。
   */
  get(x: number, y: number): 0 | TERRAIN_MASK_WALL | TERRAIN_MASK_SWAMP;
}

interface RoomTerrainConstructor extends _Constructor<RoomTerrain> {
  /**
   * 通过房间名称创建一个新的 `Terrain`。`Terrain` 对象可以从游戏世界中的任何房间构造，即使没有该房间的视野。
   * @param roomName String name of the room.
   */
  new (roomName: string): RoomTerrain;
}
