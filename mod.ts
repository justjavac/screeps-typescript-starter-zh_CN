declare const module: {
  exports: {
    loop: () => void;
  };
};

module.exports.loop = function (): void {
  console.log("running...");
};
