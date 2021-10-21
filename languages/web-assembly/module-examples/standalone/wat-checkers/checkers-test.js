fetch('./checkers.wasm').then(response =>
    response.arrayBuffer()
  // WA Instantiation - Simple
  // ).then(bytes => WebAssembly.instantiate(bytes)).then(results => {
  //
  // WA Instantiation - Imported Methods
  ).then(bytes => WebAssembly.instantiate(bytes, {
    events: {
      piecemoved: (fX, fY, tX, tY) => {
        // Allow the WA to display console logging debug info.
        console.log(
          "A piece moved from (" + fX + "," + fY + ") to (" + tX + "," + tY + ")"
        );
      },
      piececrowned: (x, y) => {
        // Allow the WA to display console logging debug info.
        console.log("A piece was crowned at (" + x + "," + y + ")");
      }
    },
  }
  )).then(results => {
    console.log("Loaded wasm module");
    instance = results.instance;
    console.log("instance", instance);
  
    // Piece - BitMap Values
    var white = 2;
    var black = 1;
    var crowned_white = 6;
    var crowned_black = 5;
  
    // Basic Tests
    //
    var offset = instance.exports.offsetForPosition(3, 4);
    console.log("test offset for 3, 4 is: ", offset);
  
    console.debug("test white is white: ", 
        instance.exports.isWhite(white));

    console.debug("test black is black: ", 
        instance.exports.isBlack(black));

    console.debug("test white is not black: ", 
      instance.exports.isBlack(white));

    console.debug("test black is not white: ", 
        instance.exports.isWhite(black));

    console.debug("test crowned white is crowned: ",
      instance.exports.isCrowned(crowned_white));

    console.debug("test crowned black is crowned: ",
      instance.exports.isCrowned(crowned_black));

    console.debug("test uncrowned white: ", 
      instance.exports.isWhite(instance.exports.withoutCrown(crowned_white)));

    console.debug("test uncrowned black: ",
      instance.exports.isBlack(instance.exports.withoutCrown(crowned_black)));


    // Board Tests
    //
    instance.exports.initBoard();
    console.log("test at start turn owner is: " + instance.exports.getTurnOwner());
    instance.exports.move(0, 5, 0, 4); // B move
    instance.exports.move(1, 0, 1, 1); // W move
    instance.exports.move(0, 4, 0, 3); // B move
    instance.exports.move(1, 1, 1, 0); // W move
    instance.exports.move(0, 3, 0, 2); // B move
    instance.exports.move(1, 0, 1, 1); // W move
    instance.exports.move(0, 2, 0, 0); // B move - This will crown
    instance.exports.move(1, 1, 1, 0); // W move
    let res = instance.exports.move(0, 0, 0, 2);  // B move - the crowned piece out.
    console.log("test at end turn owner is: " + instance.exports.getTurnOwner());

    document.getElementById("container").innerText = res;
  }
).catch(console.error);;