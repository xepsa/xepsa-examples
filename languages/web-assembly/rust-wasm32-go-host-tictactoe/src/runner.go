package main

import (
	"bufio"
	"fmt"
	"io/ioutil"
	"os"
	"strconv"
	"strings"

	wasm "github.com/wasmerio/wasmer-go/wasmer"
)

func main() {
	wasmBytes, _ := ioutil.ReadFile("./wasm32-unknown-unknown/release/rust_wasm32_go_host_tictactoe.wasm")
	engine := wasm.NewEngine()
	store := wasm.NewStore(engine)

	// Compiles the module
	module, _ := wasm.NewModule(store, wasmBytes)

	// Instantiates the module
	importObject := wasm.NewImportObject()
	instance, _ := wasm.NewInstance(module, importObject)

	// Initialise gameboard and starting player.
	initGame, _ := instance.Exports.GetFunction("initGame")
	// Current player places their counter at grid position.
	takeTurn, _ := instance.Exports.GetFunction("takeTurn")
	// Return the value at grid position.
	getPiece, _ := instance.Exports.GetFunction("getPiece")
	// Return the player [X|O] who has the current turn.
	currentTurn, _ := instance.Exports.GetFunction("currentTurn")

	initGame()
	reader := bufio.NewReader(os.Stdin)
	fmt.Println("Tic Tac Toe Runner")
	fmt.Println("---------------------")
	for {
		render(getPiece)
		ct, _ := currentTurn()
		fmt.Printf("[%s's turn] enter row,col -> ", pieceChar(ct.(int32)))
		text, _ := reader.ReadString('\n')
		// convert CRLF to LF
		text = strings.Replace(text, "\n", "", -1)
		items := strings.Split(text, ",")
		row, _ := strconv.Atoi(items[0])
		col, _ := strconv.Atoi(items[1])
		takeTurn(row, col)
	}

}

func render(gp func(...interface{}) (interface{}, error)) {
	fmt.Println(".---.---.---.")
	for row := 0; row < 3; row++ {
		for col := 0; col < 3; col++ {
			ch, _ := gp(row, col)
			fmt.Printf("| %s ", pieceChar(ch.(int32)))
		}
		fmt.Println("|")
	}
	fmt.Println("`---^---^---'")
}

func pieceChar(piece int32) string {
	if piece == 0 {
		return " "
	} else if piece == 1 {
		return "X"
	} else if piece == 2 {
		return "O"
	} else {
		return "?"
	}
}
