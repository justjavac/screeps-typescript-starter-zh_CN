import { ErrorMapper } from "utils/ErrorMapper";

import { roleHarvester } from "role.harvester";

export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
      continue;
    }

    roleHarvester.run(Game.creeps[name]);
  }
});
