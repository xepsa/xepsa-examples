# Go Wasmer Host

* Load the WebAssembly module from disk so we can treat it as an array (or slice in this case) of bytes.

* Next, we create an engine and a store and a module from the WebAssembly bytes. 

* Create an import object.

* Create an instance of the module.

