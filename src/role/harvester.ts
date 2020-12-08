/**
 * 采集者。
 *
 * 当把 creep 的 `role` 设置为 `"harvester"` 时，creep 在每个 tick 会执行 `roleHarvester.run` 代码。
 *
 * ```ts
 * Game.creeps['name'].memory.role = 'harvester';
 * ```
 *
 * creep 会移动到能量点（source）并采集能量。creep 携带能量达到上限时，让它返回出生点（spawn）。
 */
export const roleHarvester = {
  run(creep: Creep): void {
    if (creep.store.getFreeCapacity() > 0) {
      const sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    } else {
      const targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure: AnyStructure) => {
          return (
            (structure.structureType === STRUCTURE_EXTENSION ||
              structure.structureType === STRUCTURE_SPAWN ||
              structure.structureType === STRUCTURE_TOWER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        }
      });
      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
        }
      }
    }
  }
};
