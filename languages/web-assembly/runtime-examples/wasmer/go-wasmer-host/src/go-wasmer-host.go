package main

import (
	"fmt"
	"io/ioutil"

	wasm "github.com/wasmerio/wasmer-go/wasmer"
)

func main() {
	wasmBytes, _ := ioutil.ReadFile("modules/calc.wasm")

	engine := wasm.NewEngine()
	store := wasm.NewStore(engine)

	module, _ := wasm.NewModule(store, wasmBytes)

	importObject := wasm.NewImportObject()
	instance, _ := wasm.NewInstance(module, importObject)

	add, _ := instance.Exports.GetFunction("add")
	mul, _ := instance.Exports.GetFunction("mul")
	div, _ := instance.Exports.GetFunction("div")
	sub, _ := instance.Exports.GetFunction("sub")

	result, _ := add(2, 8)
	fmt.Println(result)
	result, _ = mul(2, 5)
	fmt.Println(result)
	result, _ = div(10, 2)
	fmt.Println(result)
	result, _ = sub(10, 2)
	fmt.Println(result)
}
